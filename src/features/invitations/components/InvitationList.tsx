import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, X, RefreshCw, Eye, AlertTriangle, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { useInvitations } from '../hooks/useInvitations';
import { useCancelInvitation } from '../hooks/useCancelInvitation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

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
      toast.success(t('invitations.reinviteSent', 'Nouvelle invitation envoyée'));
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

  const handleSort = (field: string) => {
    if (sortField === field) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
        setSortField(field);
        setSortOrder("asc");
    }
  };

  const filteredAndSorted = useMemo(() => {
    if (!invitations) return [];
    
    let result = invitations.filter(inv =>
        (inv.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (inv.country?.name_fr || "").toLowerCase().includes(search.toLowerCase())
    );

    result.sort((a, b) => {
        let aValue: any = a[sortField as keyof typeof a] || "";
        let bValue: any = b[sortField as keyof typeof b] || "";
        
        if (sortField === "country") {
            aValue = a.country?.name_fr || "";
            bValue = b.country?.name_fr || "";
        }

        if (sortOrder === "asc") {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
    });

    return result;
  }, [invitations, search, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const paginatedInvitations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSorted.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSorted, currentPage, itemsPerPage]);

  const stats = useMemo(() => ({
    total: invitations?.length || 0,
    filtered: filteredAndSorted.length
  }), [invitations, filteredAndSorted]);

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
              {t('invitations.cancelConfirm', 'Êtes-vous sûr de vouloir annuler cette invitation ?')}
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
                  <p className="font-medium truncate">{selectedInvitation.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('invitations.role')}</p>
                  <Badge variant="outline">{selectedInvitation.role}</Badge>
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
              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-1">Lien d'invitation</p>
                <div className="flex items-center gap-2">
                    <code className="flex-1 text-[10px] bg-slate-50 border p-2 rounded truncate">
                        {`${window.location.origin}/accept-invitation?token=${selectedInvitation.token}`}
                    </code>
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => copyLink(selectedInvitation)}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
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

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('invitations.searchPlaceholder', 'Rechercher par email ou pays...')}
            value={search}
            onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1);
            }}
            className="pl-10 bg-white"
          />
        </div>
        {search && (
          <Button variant="ghost" size="sm" onClick={() => setSearch("")}>
            {t('common.reset', 'Réinitialiser')}
          </Button>
        )}
      </div>

      {stats.filtered !== stats.total && (
        <div className="mb-4 text-sm text-muted-foreground">
            {t('common.showing', 'Affichage de')} {stats.filtered} {t('nav.invitations').toLowerCase()} {t('common.of', 'sur')} {stats.total}
        </div>
      )}

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead>
                <button onClick={() => handleSort("email")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                    {t('auth.email')}
                    {sortField === "email" && (sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                </button>
              </TableHead>
              <TableHead>{t('invitations.role')}</TableHead>
              <TableHead>
                <button onClick={() => handleSort("country")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                    {t('users.country')}
                    {sortField === "country" && (sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                </button>
              </TableHead>
              <TableHead>{t('users.status')}</TableHead>
              <TableHead>
                <button onClick={() => handleSort("expires_at")} className="flex items-center gap-1 hover:text-foreground transition-colors">
                    {t('invitations.expiresAt')}
                    {sortField === "expires_at" && (sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                </button>
              </TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                    </TableRow>
                ))
            ) : paginatedInvitations.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                        {t('invitations.noInvitations')}
                    </TableCell>
                </TableRow>
            ) : (
                paginatedInvitations.map((inv) => (
                <TableRow key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-bold text-sm">{inv.email}</TableCell>
                    <TableCell><Badge variant="outline" className="font-bold text-[10px]">{inv.role}</Badge></TableCell>
                    <TableCell>
                        {inv.country ? (
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="font-bold text-[10px] px-1.5 py-0">
                                    {inv.country.code_iso}
                                </Badge>
                                <span className="text-sm font-medium text-slate-600">
                                    {inv.country.name_fr}
                                </span>
                            </div>
                        ) : '—'}
                    </TableCell>
                    <TableCell>
                    <Badge variant={statusVariant[inv.status] || 'outline'} className="font-bold text-[10px]">
                        {t(`invitations.status.${inv.status}`, inv.status)}
                    </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-medium">
                    {new Date(inv.expires_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                    <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(inv)} title={t('invitations.details')} className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                        </Button>
                        {inv.status === 'pending' && (
                        <>
                            <Button variant="ghost" size="icon" onClick={() => copyLink(inv)} title={t('invitations.copyLink')} className="h-8 w-8">
                            <Copy className="h-4 w-4 text-primary" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleCancelClick(inv)} title={t('common.cancel')} className="h-8 w-8">
                            <X className="h-4 w-4 text-destructive" />
                            </Button>
                        </>
                        )}
                        {inv.status === 'expired' && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => reinviteMutation.mutate(inv)}
                            disabled={reinviteMutation.isPending}
                            title={t('invitations.reinvite', 'Réinviter')}
                            className="h-8 w-8"
                        >
                            <RefreshCw className={`h-4 w-4 text-primary ${reinviteMutation.isPending ? 'animate-spin' : ''}`} />
                        </Button>
                        )}
                    </div>
                    </TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <span className="whitespace-nowrap">{t("admin.rowsPerPage", "Lignes par page")}:</span>
                    <Select
                        value={itemsPerPage.toString()}
                        onValueChange={v => {
                            setItemsPerPage(parseInt(v))
                            setCurrentPage(1)
                        }}
                    >
                        <SelectTrigger className="w-[70px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <span className="whitespace-nowrap">
                    {Math.min((currentPage - 1) * itemsPerPage + 1, stats.filtered)}-
                    {Math.min(currentPage * itemsPerPage, stats.filtered)} {t("admin.of", "sur")} {stats.filtered}
                </span>
            </div>
            <Pagination className="w-auto m-0">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, i) => {
                        const pageNum = i + 1
                        if (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                            return (
                                <PaginationItem key={pageNum}>
                                    <PaginationLink
                                        isActive={currentPage === pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className="cursor-pointer"
                                    >
                                        {pageNum}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        } else if (
                            pageNum === currentPage - 2 ||
                            pageNum === currentPage + 2
                        ) {
                            return (
                                <PaginationItem key={pageNum}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )
                        }
                        return null
                    })}

                    <PaginationItem>
                        <PaginationNext 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
      )}
    </>
  );
}
