import { CheckSquare } from 'lucide-react';
import { ValidationSubmissionList } from '../components/ValidationSubmissionList';
import { useTranslation } from 'react-i18next';
import PageHero from '@/components/PageHero';

export default function ValidationListPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      <PageHero
        title={t('validation.title')}
        description={t('validation.desc')}
        icon={<CheckSquare className="h-6 w-6 text-secondary" />}
      />
      <ValidationSubmissionList />
    </div>
  );
}
