import { Link } from 'react-router-dom';
import { MessageSquare, Pin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import type { ForumTopic } from '../types';

export function TopicCard({ topic }: { topic: ForumTopic }) {
  const { t } = useTranslation();

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return t('forum.timeAgo.minutes', { count: mins });
    const hours = Math.floor(mins / 60);
    if (hours < 24) return t('forum.timeAgo.hours', { count: hours });
    const days = Math.floor(hours / 24);
    return t('forum.timeAgo.days', { count: days });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <Link to={`/forum/${topic.id}`} className="block">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {topic.is_pinned && <Pin className="h-3.5 w-3.5 text-primary shrink-0" />}
                <h3 className="font-semibold text-foreground truncate">{topic.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{topic.content}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                {topic.category && (
                  <Badge variant="secondary" className="text-xs">{topic.category.name}</Badge>
                )}
                <span>{topic.author?.full_name ?? t('forum.anonymous')}</span>
                <span>{timeAgo(topic.created_at)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground shrink-0">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">{topic.post_count ?? 0}</span>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
