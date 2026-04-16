import { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePerformValidation } from '../hooks/usePerformValidation';
import { useTranslation } from 'react-i18next';
import type { ValidationActionType, SubmissionStatus } from '@/core/constants/roles';

interface Props {
  submissionId: string;
  userId: string;
  currentStatus: SubmissionStatus;
  isGlobalAdmin?: boolean;
}

export function ValidationPanel({ submissionId, userId, currentStatus, isGlobalAdmin }: Props) {
  const { t } = useTranslation();
  const [comment, setComment] = useState('');
  const [selectedAction, setSelectedAction] = useState<ValidationActionType | null>(null);
  const { mutate, isPending } = usePerformValidation();

  const canValidate = currentStatus === 'submitted' || currentStatus === 'under_review';

  const handleAction = (action: ValidationActionType) => {
    if ((action === 'reject' || action === 'request_revision') && !comment.trim()) {
      setSelectedAction(action);
      return;
    }
    mutate(
      { submissionId, action, comment: comment.trim() || null, userId, isGlobalAdmin },
      { onSuccess: () => { setComment(''); setSelectedAction(null); } },
    );
  };

  if (!canValidate && currentStatus !== 'approved' && currentStatus !== 'rejected' && currentStatus !== 'revision_requested') {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('validation.actionsTitle')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!canValidate ? (
          <p className="text-sm text-muted-foreground">
            {t('validation.alreadyProcessed', { status: t(`fsu.status.${currentStatus}`) })}
          </p>
        ) : (
          <>
            <Textarea
              placeholder={t('validation.commentPlaceholder')}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
            {selectedAction && !comment.trim() && (
              <p className="text-sm text-destructive">
                {t('validation.commentRequired')}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleAction('approve')}
                disabled={isPending}
                className="bg-success text-success-foreground hover:bg-success/90"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                {t('validation.approve')}
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleAction('reject')}
                disabled={isPending}
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                {t('validation.reject')}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAction('request_revision')}
                disabled={isPending}
                className="border-warning text-warning-foreground hover:bg-warning/10"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                {t('validation.requestRevision')}
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleAction('comment')}
                disabled={isPending || !comment.trim()}
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                {t('validation.comment')}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}