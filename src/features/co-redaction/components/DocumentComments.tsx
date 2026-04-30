/**
 * Section commentaires d'un document
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Send, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  useDocumentComments,
  useAddComment,
  useDeleteComment,
} from '../hooks/useCoRedaction';

interface DocumentCommentsProps {
  documentId: string;
}

export function DocumentComments({ documentId }: DocumentCommentsProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');

  const { data: comments, isLoading } = useDocumentComments(documentId);
  const addComment = useAddComment();
  const deleteComment = useDeleteComment();

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    await addComment.mutateAsync({
      documentId,
      content: newComment.trim(),
    });
    setNewComment('');
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'PPp', { locale: fr });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h3 className="font-semibold">
          {t('coRedaction.comments', 'Commentaires')} ({comments?.length || 0})
        </h3>
      </div>

      {/* Formulaire de commentaire */}
      {user && (
        <div className="space-y-2">
          <Textarea
            placeholder={t('coRedaction.commentPlaceholder', 'Ajouter un commentaire...')}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={!newComment.trim() || addComment.isPending}
              size="sm"
              className="gap-2"
            >
              {addComment.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {t('coRedaction.send', 'Envoyer')}
            </Button>
          </div>
        </div>
      )}

      <Separator />

      {/* Liste des commentaires */}
      <ScrollArea className="max-h-[400px]">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : comments && comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 group">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="text-xs bg-primary/10">
                    {comment.author_name?.charAt(0)?.toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{comment.author_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.created_at)}
                    </span>
                    {user?.id === comment.user_id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 text-destructive"
                        onClick={() => deleteComment.mutate({ commentId: comment.id, documentId })}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mb-2" />
            <p className="text-sm">{t('coRedaction.noComments', 'Aucun commentaire')}</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
