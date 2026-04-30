/**
 * Badge de statut du workflow documentaire
 */
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { DocumentWorkflowStatus } from '../types';
import { WORKFLOW_STATUS_LABELS, WORKFLOW_STATUS_COLORS } from '../types';
import { useTranslation } from 'react-i18next';

interface DocumentStatusBadgeProps {
  status: DocumentWorkflowStatus;
  className?: string;
}

export function DocumentStatusBadge({ status, className }: DocumentStatusBadgeProps) {
  const { t } = useTranslation();

  const labelKey = {
    draft: t('coRedaction.statusDraft', 'Brouillon'),
    editing: t('coRedaction.statusEditing', 'En édition'),
    submitted: t('coRedaction.statusSubmitted', 'Soumis'),
    closed: t('coRedaction.statusClosed', 'Clôturé'),
    reopened: t('coRedaction.statusReopened', 'Réouvert'),
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        'text-xs font-medium border-0',
        WORKFLOW_STATUS_COLORS[status],
        className
      )}
    >
      {labelKey[status] || WORKFLOW_STATUS_LABELS[status]}
    </Badge>
  );
}
