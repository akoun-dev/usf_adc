import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '../hooks/useNotifications';
import { useMarkAllAsRead } from '../hooks/useMarkAsRead';
import NotificationItem from './NotificationItem';
import type { Notification } from '../types';

interface Props {
  onNotificationClick: (n: Notification) => void;
}

export default function NotificationList({ onNotificationClick }: Props) {
  const { data: notifications = [], isLoading } = useNotifications();
  const markAll = useMarkAllAsRead();

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : 'Tout est lu'}
        </p>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAll.mutate()}
            disabled={markAll.isPending}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Tout marquer comme lu
          </Button>
        )}
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bell className="h-12 w-12 text-muted-foreground/30" />
          <p className="mt-4 text-sm font-medium text-foreground">Aucune notification</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Vous serez notifié des événements importants ici.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onClick={onNotificationClick} />
          ))}
        </div>
      )}
    </div>
  );
}
