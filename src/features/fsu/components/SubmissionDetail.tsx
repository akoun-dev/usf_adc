import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmissionStatusBadge } from './SubmissionStatusBadge';
import { AttachmentUploader } from './AttachmentUploader';
import { SubmissionPreview } from './SubmissionPreview';
import { useTranslation } from 'react-i18next';
import type { FsuSubmission } from '../types';
import type { FsuFormValues } from '../schemas/fsuFormSchema';
import type { Json } from '@/integrations/supabase/types';

interface Props {
  submission: FsuSubmission;
  userId: string;
}

export function SubmissionDetail({ submission, userId }: Props) {
  const { t, i18n } = useTranslation();
  const jsonData = submission.data as Record<string, unknown>;
  const formData: FsuFormValues = {
    period_start: submission.period_start,
    period_end: submission.period_end,
    connectivity: (jsonData?.connectivity ?? {}) as FsuFormValues['connectivity'],
    financing: (jsonData?.financing ?? {}) as FsuFormValues['financing'],
    quality: (jsonData?.quality ?? {}) as FsuFormValues['quality'],
  };

  const isDraft = submission.status === 'draft';
  const locale = i18n.language === 'pt' ? 'pt-PT' : i18n.language === 'en' ? 'en-US' : 'fr-FR';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {t('fsu.submissionPeriod', { start: submission.period_start, end: submission.period_end })}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('fsu.createdAt')} {new Date(submission.created_at).toLocaleDateString(locale)}
          </p>
        </div>
        <SubmissionStatusBadge status={submission.status} />
      </div>

      <SubmissionPreview data={formData} />

      <AttachmentUploader
        submissionId={submission.id}
        userId={userId}
        readOnly={!isDraft}
      />
    </div>
  );
}