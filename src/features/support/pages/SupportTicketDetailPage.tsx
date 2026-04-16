import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useTicket } from '../hooks/useTicket';
import { TicketDetail } from '../components/TicketDetail';
import { TicketComments } from '../components/TicketComments';
import { useTranslation } from 'react-i18next';

export default function SupportTicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: ticket, isLoading } = useTicket(id!);
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!ticket) {
    return <p className="py-12 text-center text-muted-foreground">{t('support.ticketNotFound')}</p>;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/support"><ArrowLeft className="mr-2 h-4 w-4" />{t('support.back')}</Link>
      </Button>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <TicketDetail ticket={ticket as any} />
      <TicketComments ticketId={id!} />
    </div>
  );
}