import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useSubmission } from '@/features/fsu/hooks/useSubmission';
import { SubmissionDetail } from '@/features/fsu/components/SubmissionDetail';
import { ValidationPanel } from '../components/ValidationPanel';
import { ValidationHistory } from '../components/ValidationHistory';
import { useTranslation } from 'react-i18next';
import type { SubmissionStatus } from '@/core/constants/roles';

export default function ValidationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const { data: submission, isLoading, error } = useSubmission(id);
  const { t } = useTranslation();

  const isAdmin = hasRole('country_admin') || hasRole('global_admin');

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
        <p className="text-destructive">{t('validation.notFound')}</p>
        <Button variant="link" onClick={() => navigate('/validation')}>{t('validation.backToValidation')}</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/validation')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">{t('validation.validationTitle')}</h1>
      </div>

      <SubmissionDetail submission={submission} userId={user?.id ?? ''} />

      {isAdmin && (
        <ValidationPanel
          submissionId={submission.id}
          userId={user?.id ?? ''}
          currentStatus={submission.status as SubmissionStatus}
          isGlobalAdmin={hasRole('global_admin')}
        />
      )}

      <ValidationHistory submissionId={submission.id} />
    </div>
  );
}