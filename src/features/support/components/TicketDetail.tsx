import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TicketStatusBadge } from './TicketStatusBadge';
import { useUpdateTicketStatus, useAssignTicket } from '../hooks/useUpdateTicket';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useUsers } from '@/features/users/hooks/useUsers';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import type { SupportTicket } from '../types';

export function TicketDetail({ ticket }: { ticket: SupportTicket }) {
  const { roles } = useAuth();
  const { t, i18n } = useTranslation();
  const isAdmin = roles.includes('global_admin') || roles.includes('country_admin');
  const updateStatus = useUpdateTicketStatus();
  const assignTicket = useAssignTicket();
  const { data: users } = useUsers();
  const { toast } = useToast();

  const locale = i18n.language === 'pt' ? 'pt-PT' : i18n.language === 'en' ? 'en-US' : 'fr-FR';

  const handleStatusChange = (status: string) => {
    updateStatus.mutate({ id: ticket.id, status }, {
      onSuccess: () => toast({ title: t('support.statusUpdated') }),
      onError: () => toast({ title: t('common.error'), variant: 'destructive' }),
    });
  };

  const handleAssign = (value: string) => {
    const assignedTo = value === '__none__' ? null : value;
    assignTicket.mutate({ id: ticket.id, assignedTo }, {
      onSuccess: () => toast({ title: assignedTo ? t('support.ticketAssigned') : t('support.assignRemoved') }),
      onError: () => toast({ title: t('common.error'), variant: 'destructive' }),
    });
  };

  const activeUsers = (users ?? []).filter((u) => u.is_active);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{ticket.title}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {t('support.createdAt')} {new Date(ticket.created_at).toLocaleDateString(locale)} — {t('support.form.priority')} : {t(`support.priority.${ticket.priority}`)}
            </p>
            {ticket.assignee?.full_name && (
              <p className="mt-1 text-sm text-muted-foreground">
                {t('support.assignedTo')} : <span className="font-medium text-foreground">{ticket.assignee.full_name}</span>
              </p>
            )}
          </div>
          <TicketStatusBadge status={ticket.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="whitespace-pre-wrap">{ticket.description}</p>

        {isAdmin && (
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{t('support.changeStatus')} :</span>
              <Select value={ticket.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">{t('support.ticketStatus.open')}</SelectItem>
                  <SelectItem value="in_progress">{t('support.ticketStatus.in_progress')}</SelectItem>
                  <SelectItem value="resolved">{t('support.ticketStatus.resolved')}</SelectItem>
                  <SelectItem value="closed">{t('support.ticketStatus.closed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{t('support.assignTo')} :</span>
              <Select value={ticket.assigned_to ?? '__none__'} onValueChange={handleAssign}>
                <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">{t('support.unassigned')}</SelectItem>
                  {activeUsers.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.full_name ?? u.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}