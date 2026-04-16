import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, X, RefreshCw } from 'lucide-react';
import { useInvitations } from '../hooks/useInvitations';
import { useCancelInvitation } from '../hooks/useCancelInvitation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import type { Invitation } from '../services/invitation-service';

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'default',
  accepted: 'secondary',
  expired: 'destructive',
  cancelled: 'outline',
};

export function InvitationList() {
  const { t } = useTranslation();
  const { data: invitations, isLoading } = useInvitations();
  const { mutate: cancel } = useCancelInvitation();
  const qc = useQueryClient();

  const reinviteMutation = useMutation({
    mutationFn: async (inv: Invitation) => {
      // Create a new invitation with same params
      const { error } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('invitations' as any)
        .insert({
          email: inv.email,
          role: inv.role,
          country_id: inv.country_id,
          invited_by: inv.invited_by,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invitations'] });
      toast.success(t('invitations.reinviteSent', 'Nouvelle invitation envoyée'));
    },
    onError: () => {
      toast.error(t('common.error'));
    },
  });

  const copyLink = (inv: Invitation) => {
    const url = `${window.location.origin}/accept-invitation?token=${inv.token}`;
    navigator.clipboard.writeText(url);
    toast.success(t('invitations.linkCopied'));
  };

  if (isLoading) {
    return <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14" />)}</div>;
  }

  if (!invitations?.length) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          {t('invitations.noInvitations')}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('auth.email')}</TableHead>
              <TableHead>{t('invitations.role')}</TableHead>
              <TableHead>{t('users.country')}</TableHead>
              <TableHead>{t('users.status')}</TableHead>
              <TableHead>{t('invitations.expiresAt')}</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-medium">{inv.email}</TableCell>
                <TableCell><Badge variant="outline">{inv.role}</Badge></TableCell>
                <TableCell>{inv.country?.name_fr || '—'}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[inv.status] || 'outline'}>
                    {t(`invitations.status.${inv.status}`, inv.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(inv.expires_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {inv.status === 'pending' && (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => copyLink(inv)} title={t('invitations.copyLink')}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => cancel(inv.id)} title={t('common.cancel')}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {inv.status === 'expired' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => reinviteMutation.mutate(inv)}
                        disabled={reinviteMutation.isPending}
                        title={t('invitations.reinvite', 'Réinviter')}
                      >
                        <RefreshCw className="mr-1 h-3 w-3" />
                        {t('invitations.reinvite', 'Réinviter')}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
