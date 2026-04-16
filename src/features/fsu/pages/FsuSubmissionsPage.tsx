import { useNavigate } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SubmissionHistory } from '../components/SubmissionHistory';
import { useTranslation } from 'react-i18next';
import PageHero from '@/components/PageHero';

export default function FsuSubmissionsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHero
        title={t('fsu.title')}
        description={t('fsu.historyDesc')}
        icon={<FileText className="h-6 w-6 text-secondary" />}
      >
        <Button
          onClick={() => navigate('/fsu/submissions/new')}
          className="bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 border-white/20"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('fsu.newEntry')}
        </Button>
      </PageHero>
      <SubmissionHistory />
    </div>
  );
}
