import { usePromotionHistory } from '../hooks/usePromotionHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History } from 'lucide-react';
import { ROLE_LABELS, type AppRole } from '@/core/constants/roles';

interface PromotionHistoryProps {
  userId: string;
}

export default function PromotionHistory({ userId }: PromotionHistoryProps) {
  const { data: promotions, isLoading } = usePromotionHistory(userId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-5 w-5" />
            Historique des rôles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Chargement…</p>
        </CardContent>
      </Card>
    );
  }

  if (!promotions?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-5 w-5" />
            Historique des rôles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Aucun historique de promotion disponible.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="h-5 w-5" />
          Historique des rôles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {promotions.map((p) => {
            const label = ROLE_LABELS[p.role as AppRole] ?? p.role;
            const date = new Date(p.created_at);
            return (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-md border border-border px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{label}</Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {date.toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
