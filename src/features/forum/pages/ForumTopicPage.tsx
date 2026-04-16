import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Pin, Lock, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useTopic } from '../hooks/useTopic';
import { useUpdateTopic } from '../hooks/useUpdateTopic';
import { useDeleteTopic } from '../hooks/useDeleteTopic';
import { useUpdatePost } from '../hooks/useUpdatePost';
import { useDeletePost } from '../hooks/useDeletePost';
import { PostItem } from '../components/PostItem';
import { PostForm } from '../components/PostForm';
import { useTranslation } from 'react-i18next';

export default function ForumTopicPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { user, hasRole } = useAuth();
  const { topic: topicQuery, posts: postsQuery } = useTopic(id!);
  const updateTopic = useUpdateTopic();
  const deleteTopic = useDeleteTopic();
  const updatePost = useUpdatePost(id!);
  const deletePost = useDeletePost(id!);

  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [showDeleteTopicDialog, setShowDeleteTopicDialog] = useState(false);

  const isAdmin = hasRole('global_admin');
  const currentUserId = user?.id;

  if (topicQuery.isLoading) {
    return <div className="space-y-4"><Skeleton className="h-40" /><Skeleton className="h-20" /><Skeleton className="h-20" /></div>;
  }

  const topic = topicQuery.data;
  if (!topic) return <p className="text-muted-foreground">{t('forum.topic.notFound')}</p>;

  const canManageTopic = currentUserId === topic.created_by || isAdmin;
  const initials = (topic.author?.full_name || 'A').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return t('forum.timeAgo.minutes', { count: mins });
    const hours = Math.floor(mins / 60);
    if (hours < 24) return t('forum.timeAgo.hours', { count: hours });
    const days = Math.floor(hours / 24);
    return t('forum.timeAgo.days', { count: days });
  };

  const handleStartEditTopic = () => {
    setEditTitle(topic.title);
    setEditContent(topic.content);
    setIsEditingTopic(true);
  };

  const handleSaveTopic = () => {
    if (editTitle.trim() && editContent.trim()) {
      updateTopic.mutate({ id: topic.id, title: editTitle.trim(), content: editContent.trim() }, {
        onSuccess: () => setIsEditingTopic(false),
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/forum"><ArrowLeft className="mr-2 h-4 w-4" />{t('forum.topic.backToForum')}</Link>
      </Button>

      <Card>
        <CardContent className="p-6">
          {isEditingTopic ? (
            <div className="space-y-3">
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder={t('forum.topic.titlePlaceholder')} />
              <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="min-h-[100px]" />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveTopic} disabled={!editTitle.trim() || !editContent.trim() || updateTopic.isPending}>
                  {updateTopic.isPending ? t('forum.topic.saving') : t('forum.topic.save')}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditingTopic(false)}>{t('forum.topic.cancel')}</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start gap-2 mb-1">
                {topic.is_pinned && <Pin className="h-4 w-4 text-primary shrink-0 mt-1" />}
                {topic.is_locked && <Lock className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />}
                <h1 className="text-xl font-bold text-foreground flex-1">{topic.title}</h1>
                {canManageTopic && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleStartEditTopic}>
                        <Pencil className="mr-2 h-4 w-4" />{t('forum.topic.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setShowDeleteTopicDialog(true)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />{t('forum.topic.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                {topic.category && <Badge variant="secondary">{topic.category.name}</Badge>}
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-[10px] bg-muted">{initials}</AvatarFallback>
                  </Avatar>
                  <span>{topic.author?.full_name ?? t('forum.anonymous')}</span>
                </div>
                <span>{timeAgo(topic.created_at)}</span>
              </div>
              <p className="mt-4 text-foreground whitespace-pre-wrap">{topic.content}</p>
            </>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {t('forum.topic.replies', { count: postsQuery.data?.length ?? 0 })}
        </h2>
        {postsQuery.isLoading ? (
          <div className="space-y-3">{[1, 2].map(i => <Skeleton key={i} className="h-16" />)}</div>
        ) : postsQuery.data && postsQuery.data.length > 0 ? (
          <Card>
            <CardContent className="p-4">
              {postsQuery.data.map((post) => (
                <PostItem
                  key={post.id}
                  post={post}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                  onUpdate={(postId, content) => updatePost.mutate({ id: postId, content })}
                  onDelete={(postId) => deletePost.mutate(postId)}
                />
              ))}
            </CardContent>
          </Card>
        ) : (
          <p className="text-sm text-muted-foreground">{t('forum.topic.noReplies')}</p>
        )}
      </div>

      {!topic.is_locked && (
        <div>
          <h3 className="text-sm font-medium text-foreground mb-2">{t('forum.topic.reply')}</h3>
          <PostForm topicId={topic.id} />
        </div>
      )}

      <AlertDialog open={showDeleteTopicDialog} onOpenChange={setShowDeleteTopicDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('forum.topic.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('forum.topic.deleteConfirmDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('forum.topic.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTopic.mutate(topic.id)}
            >
              {t('forum.topic.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
