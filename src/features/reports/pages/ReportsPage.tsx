import { BarChart3, FileDown, FileText, Wand2, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReportsData } from '../hooks/useReportsData';
import KpiCards from '../components/KpiCards';
import StatusChart from '../components/StatusChart';
import TimelineChart from '../components/TimelineChart';
import CountryTable from '../components/CountryTable';
import KpiComparison from '../components/KpiComparison';
import { Button } from '@/components/ui/button';
import { exportReportsCSV } from '../utils/export-csv';
import { exportReportsPDF } from '../utils/export-pdf';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth/hooks/useAuth';
import PageHero from '@/components/PageHero';

export default function ReportsPage() {
  const { data, isLoading } = useReportsData();
  const { t } = useTranslation();
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  const isAdmin = hasRole('country_admin') || hasRole('global_admin');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-20 text-center text-muted-foreground">{t('reports.noData')}</div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHero
        title={t('reports.title')}
        description={t('reports.desc')}
        icon={<BarChart3 className="h-6 w-6 text-secondary" />}
      >
        <div className="flex gap-2">
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/reports/builder')}
              className="bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 border-white/20"
            >
              <Wand2 className="mr-1 h-4 w-4" />{t('reports.builder', 'Générateur')}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportReportsCSV(data)}
            className="bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 border-white/20"
          >
            <FileDown className="mr-1 h-4 w-4" />CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportReportsPDF(data)}
            className="bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 border-white/20"
          >
            <FileText className="mr-1 h-4 w-4" />PDF
          </Button>
        </div>
      </PageHero>
      <KpiCards total={data.total} pending={data.pending} approved={data.approved} approvalRate={data.approvalRate} />
      <div className="grid gap-6 lg:grid-cols-2">
        <StatusChart data={data.byStatus} />
        <TimelineChart data={data.byMonth} />
      </div>
      {/* US-054: KPI Comparison */}
      <KpiComparison />
      <CountryTable data={data.byCountry} />
    </div>
  );
}
