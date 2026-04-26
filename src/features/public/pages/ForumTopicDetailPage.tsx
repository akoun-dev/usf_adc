import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Clock, MessageSquare, Eye, Pin, Lock, CheckCircle } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { usePublicForumTopic } from '../hooks/usePublicForum';
import { incrementTopicViews } from '../services/forum.service';
import type { ForumTopic } from '../services/forum.service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import PageHero from '@/components/PageHero';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

function getAvatarColor(name: string) {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500',
    'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

const getStatusBadge = (status: string, t: (key: string) => string) => {
  const badges: Record<string, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
    'pinned': { label: t('public.forum.status.pinned'), className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400', icon: Pin },
    'solved': { label: t('public.forum.status.solved'), className: 'bg-green-500/10 text-green-700 dark:text-green-400', icon: CheckCircle },
    'active': { label: t('public.forum.status.active'), className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400', icon: CheckCircle },
  };
  return badges[status] || badges['active'];
};

export default function ForumTopicDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: topic, isLoading, error } = usePublicForumTopic(id || '');

  // Increment views when topic is loaded
  useEffect(() => {
    if (topic) {
      incrementTopicViews(topic.id);
    }
  }, [topic]);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="w-full px-4 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (error || !topic) {
    return (
      <PublicLayout>
        <div className="w-full px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('public.forum.topic.notFound')}</h1>
          <Button asChild>
            <Link to="/forum-public">{t('public.forum.topic.backToForum')}</Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  const statusBadge = getStatusBadge(topic.status || 'active', t);
  const StatusIcon = statusBadge.icon;
  const createdDate = new Date(topic.created_at);
  const updatedDate = new Date(topic.updated_at);

  return (
    <PublicLayout>
      <div className="w-full px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/forum-public" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('public.forum.topic.backToForum')}
          </Link>
        </Button>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarFallback className={getAvatarColor(topic.author?.full_name || 'User')}>
                  {topic.author?.full_name?.substring(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {topic.is_pinned && (
                    <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30 text-xs">
                      <Pin className="h-3 w-3 mr-1" />
                      {t('public.forum.status.pinned')}
                    </Badge>
                  )}
                  {topic.is_locked && (
                    <Badge variant="outline" className="text-xs">
                      <Lock className="h-3 w-3 mr-1" />
                      {t('public.forum.locked')}
                    </Badge>
                  )}
                  {topic.status === 'solved' && (
                    <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30 text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {statusBadge.label}
                    </Badge>
                  )}
                </div>

                <h1 className="text-2xl font-bold mb-4">{topic.title}</h1>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {topic.author?.full_name || t('public.forum.anonymous')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {createdDate.toLocaleDateString(t('public.forum.topic.dateLocale') || 'fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {topic.views} {t('public.forum.views')}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {topic._count?.posts || 0} {t('public.forum.posts')}
                  </span>
                </div>

                {topic.tags && topic.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {topic.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{topic.content}</p>
            </div>
          </CardContent>
        </Card>

        {topic.is_locked && (
          <Card className="mt-6 bg-muted/50 border-muted">
            <CardContent className="p-6 text-center text-muted-foreground">
              <Lock className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p className="font-medium mb-1">{t('public.forum.locked')}</p>
              <p className="text-sm">{t('public.forum.readOnlyFullDesc')}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PublicLayout>
  );
}
