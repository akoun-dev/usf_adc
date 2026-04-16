import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import type { SubmissionStatus } from '@/core/constants/roles';

const STATUS_VARIANTS: Record<SubmissionStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  submitted: 'bg-primary/10 text-primary',
  under_review: 'bg-secondary/20 text-secondary-foreground',
  approved: 'bg-success/10 text-success',
  rejected: 'bg-destructive/10 text-destructive',
  revision_requested: 'bg-warning/10 text-warning-foreground',
};

interface Props {
  status: SubmissionStatus;
}

export function SubmissionStatusBadge({ status }: Props) {
  const { t } = useTranslation();
  return (
    <Badge className={STATUS_VARIANTS[status]} variant="secondary">
      {t(`fsu.status.${status}`)}
    </Badge>
  );
}