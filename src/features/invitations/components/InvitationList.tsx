import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, X, RefreshCw, Eye, AlertTriangle } from 'lucide-react';
import { useInvitations } from '../hooks/useInvitations';
import { useCancelInvitation } from '../hooks/useCancelInvitation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const reinviteMutation = useMutation({
    mutationFn: async (inv: Invitation) => {
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
      toast.success(t('invitations.reinviteSent', 'Nouvelle invitation envoyee'));
    },
    onError: () => {
      toast.error(t('common.error'));
    },
  });

  const handleCancelClick = (inv: Invitation) => {
    setSelectedInvitation(inv);
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = () => {
    if (selectedInvitation) {
      cancel(selectedInvitation.id);
      setShowCancelDialog(false);
      setSelectedInvitation(null);
    }
  };

  const handleViewDetails = (inv: Invitation) => {
    setSelectedInvitation(inv);
    setShowDetailsDialog(true);
  };

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
    <>
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              {t('invitations.cancelInvitation')}
            </DialogTitle>
            <DialogDescription>
              {t('invitations.cancelConfirm', 'Etes-vous sur de vouloir annuler cette invitation ?')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleConfirmCancel}>
              {t('common.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('invitations.details')}</DialogTitle>
          </DialogHeader>
          {selectedInvitation && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('auth.email')}</p>
                  <p className="font-medium">{selectedInvitation.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('invitations.role')}</p>
                  < Badge variant="outline">{selectedInvitation.role}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('users.status')}</p>
                  <Badge variant={statusVariant[selectedInvitation.status]}>
                    {t(`invitations.status.${selectedInvitation.status}`, selectedInvitation.status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('users.country')}</p>
                  <p>{selectedInvitation.country?.name_fr || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('invitations.expiresAt')}</p>
                  <p>{new Date(selectedInvitation.expires_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('invitations.createdBy')}</p>
                  <p>{selectedInvitation.inviter?.full_name || '-'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Token</p>
                <code className="text-xs bg-muted p-1 rounded">{selectedInvitation.token}</code>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              {t('common.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleViewDetails(inv)} title={t('invitations.details')}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {inv.status === 'pending' && (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => copyLink(inv)} title={t('invitations.copyLink')}>
                          <Copy className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleCancelClick(inv)} title={t('common.cancel')}>
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </>
                    )}
                    {inv.status === 'expired' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => reinviteMutation.mutate(inv)}
                        disabled={reinviteMutation.isPending}
                        title={t('invitations.reinvite', 'Reinviter')}
                      >
                        <RefreshCw className={`mr-1 h-3 w-3 ${reinviteMutation.isPending ? 'animate-spin' : ''}`} />
                        {t('invitations.reinvite', 'Reinviter')}
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
    </>
  );
}
