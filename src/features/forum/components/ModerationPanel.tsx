import { useState } from 'react';
import { Shield, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useForumReports } from '../hooks/useForumReports';
import { useReviewReport } from '../hooks/useReviewReport';
import { useTranslation } from 'react-i18next';

interface Props {
  userId: string;
}

export function ModerationPanel({ userId }: Props) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('pending');
  const { data: reports, isLoading } = useForumReports(filter);
  const { mutate: review, isPending } = useReviewReport();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('forum.moderation.title')}
          </CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('forum.moderation.all')}</SelectItem>
              <SelectItem value="pending">{t('forum.moderation.pending')}</SelectItem>
              <SelectItem value="reviewed">{t('forum.moderation.reviewed')}</SelectItem>
              <SelectItem value="dismissed">{t('forum.moderation.dismissed')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-16" />)}</div>
        ) : !reports?.length ? (
          <p className="text-sm text-muted-foreground text-center py-6">{t('forum.moderation.noReports')}</p>
        ) : (
          <div className="space-y-3">
            {reports.map((r) => (
              <div key={r.id} className="flex items-start justify-between gap-4 rounded-lg border p-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="default" className="text-xs">{t(`forum.moderation.status.${r.status}`)}</Badge>
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
                      title={t('forum.moderation.markReviewed')}
                    >
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-muted-foreground"
                      disabled={isPending}
                      onClick={() => review({ reportId: r.id, status: 'dismissed', reviewerId: userId })}
                      title={t('forum.moderation.dismiss')}
                    >
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
