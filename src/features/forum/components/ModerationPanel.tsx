import { useState } from 'react';
import { Shield, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useForumReports } from '../hooks/useForumReports';
import { useReviewReport } from '../hooks/useReviewReport';

interface Props {
  userId: string;
}

const STATUS_BADGE: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  pending: { label: 'En attente', variant: 'default' },
  reviewed: { label: 'Traité', variant: 'secondary' },
  dismissed: { label: 'Rejeté', variant: 'outline' },
};

export function ModerationPanel({ userId }: Props) {
  const [filter, setFilter] = useState('pending');
  const { data: reports, isLoading } = useForumReports(filter);
  const { mutate: review, isPending } = useReviewReport();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Modération du forum
          </CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="reviewed">Traités</SelectItem>
              <SelectItem value="dismissed">Rejetés</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-16" />)}</div>
        ) : !reports?.length ? (
          <p className="text-sm text-muted-foreground text-center py-6">Aucun signalement</p>
        ) : (
          <div className="space-y-3">
            {reports.map((r) => {
              const badge = STATUS_BADGE[r.status] || STATUS_BADGE.pending;
              return (
                <div key={r.id} className="flex items-start justify-between gap-4 rounded-lg border p-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={badge.variant} className="text-xs">{badge.label}</Badge>
                      <span className="text-xs text-muted-foreground capitalize">{r.target_type}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{r.reason}</p>
                  </div>
                  {r.status === 'pending' && (
                    <div className="flex gap-1 shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-success hover:text-success"
                        disabled={isPending}
                        onClick={() => review({ reportId: r.id, status: 'reviewed', reviewerId: userId })}
                        title="Marquer comme traité"
                      >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-muted-foreground"
                        disabled={isPending}
                        onClick={() => review({ reportId: r.id, status: 'dismissed', reviewerId: userId })}
                        title="Rejeter le signalement"
                      >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
