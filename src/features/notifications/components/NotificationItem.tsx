import { Info, AlertTriangle, AlertCircle, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Notification } from '../types';

const TYPE_CONFIG: Record<Notification['type'], { icon: React.ElementType; className: string }> = {
  info: { icon: Info, className: 'text-blue-500 bg-blue-500/10' },
  warning: { icon: AlertTriangle, className: 'text-yellow-500 bg-yellow-500/10' },
  action_required: { icon: AlertCircle, className: 'text-destructive bg-destructive/10' },
  system: { icon: Settings, className: 'text-muted-foreground bg-muted' },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days}j`;
}

interface Props {
  notification: Notification;
  onClick: (n: Notification) => void;
}

export default function NotificationItem({ notification, onClick }: Props) {
  const { icon: Icon, className: iconClass } = TYPE_CONFIG[notification.type];
  const isUnread = !notification.read_at;

  return (
    <button
      onClick={() => onClick(notification)}
      className={cn(
        'flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-accent/50',
        isUnread ? 'border-primary/20 bg-primary/5' : 'border-border bg-card'
      )}
    >
      <div className={cn('mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full', iconClass)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={cn('truncate text-sm', isUnread ? 'font-semibold text-foreground' : 'font-medium text-foreground/80')}>
            {notification.title}
          </p>
          {isUnread && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{notification.message}</p>
        <p className="mt-1 text-xs text-muted-foreground/60">{timeAgo(notification.created_at)}</p>
      </div>
    </button>
  );
}
