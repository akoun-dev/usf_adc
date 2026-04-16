import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import type { TicketStatus } from '@/core/constants/roles';

const variantMap: Record<TicketStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  open: 'destructive',
  in_progress: 'default',
  resolved: 'secondary',
  closed: 'outline',
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const { t } = useTranslation();
  return <Badge variant={variantMap[status] ?? 'outline'}>{t(`support.ticketStatus.${status}`)}</Badge>;
}