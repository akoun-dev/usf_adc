import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Users, CheckSquare, AlertTriangle, BarChart3, Clock, Activity, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PageHero from '@/components/PageHero';

export default function AdminPaysDashboard() {
  const { profile } = useAuth();
  const fullName = profile?.full_name ?? 'Administrateur';
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHero
        title={t('dashboard.adminPays')}
        description={t('dashboard.welcomeAdmin', { name: fullName })}
        icon={<Shield className="h-6 w-6 text-secondary" />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: t('dashboard.activeUsers'), value: '0', icon: Users, color: 'text-primary' },
          { title: t('dashboard.pendingValidation'), value: '0', icon: Clock, color: 'text-warning' },
          { title: t('dashboard.validationRate'), value: '—', icon: Activity, color: 'text-success' },
        ].map((stat) => (
          <Card key={stat.title} className="group stat-card transition-all hover:-translate-y-0.5 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{stat.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.alertsTitle')}</CardTitle>
            <CardDescription>{t('dashboard.alertsNeedAttention')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 rounded-lg border border-dashed p-6 text-center text-muted-foreground">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">{t('dashboard.noAlerts')}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.quickActions')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: t('dashboard.validateSubmissions'), icon: CheckSquare },
              { label: t('dashboard.manageUsers'), icon: Users },
              { label: t('dashboard.viewReportsShort'), icon: BarChart3 },
            ].map((a) => (
              <div key={a.label} className="flex items-center gap-3 rounded-md border p-3 transition-all hover:bg-primary/5 hover:border-primary/20 cursor-pointer">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <a.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">{a.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
