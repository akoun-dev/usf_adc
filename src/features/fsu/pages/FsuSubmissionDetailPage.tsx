import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useSubmission } from '../hooks/useSubmission';
import { SubmissionDetail } from '../components/SubmissionDetail';
import { useTranslation } from 'react-i18next';

export default function FsuSubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: submission, isLoading, error } = useSubmission(id);
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-destructive">{t('fsu.submissionNotFound')}</p>
        <Button variant="link" onClick={() => navigate('/fsu/submissions')}>{t('fsu.backToHistory')}</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/fsu/submissions')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">{t('fsu.submissionDetail')}</h1>
      </div>

      <SubmissionDetail submission={submission} userId={user?.id ?? ''} />
    </div>
  );
}