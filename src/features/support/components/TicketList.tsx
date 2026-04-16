import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TicketStatusBadge } from './TicketStatusBadge';
import { useTranslation } from 'react-i18next';
import type { SupportTicket } from '../types';

export function TicketList({ tickets }: { tickets: SupportTicket[] }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'pt' ? 'pt-PT' : i18n.language === 'en' ? 'en-US' : 'fr-FR';

  if (tickets.length === 0) {
    return <p className="py-8 text-center text-muted-foreground">{t('support.noTickets')}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('support.tableHeaders.title')}</TableHead>
          <TableHead>{t('support.tableHeaders.status')}</TableHead>
          <TableHead>{t('support.tableHeaders.priority')}</TableHead>
          <TableHead>{t('support.tableHeaders.date')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id}>
            <TableCell>
              <Link to={`/support/${ticket.id}`} className="font-medium text-primary hover:underline">
                {ticket.title}
              </Link>
            </TableCell>
            <TableCell><TicketStatusBadge status={ticket.status} /></TableCell>
            <TableCell>{t(`support.priority.${ticket.priority}`)}</TableCell>
            <TableCell className="text-muted-foreground">{new Date(ticket.created_at).toLocaleDateString(locale)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}