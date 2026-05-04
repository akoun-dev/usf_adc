import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Send, User as UserIcon, Loader2, Lock } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useProjectComments } from '../hooks/useProjectComments';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

interface ProjectCommentsProps {
  projectId: string;
}

export function ProjectComments({ projectId }: ProjectCommentsProps) {
  const { t, i18n } = useTranslation();
  const { roles, isAuthenticated } = useAuth();
  const { comments, isLoading, addComment, isSubmitting } = useProjectComments(projectId);
  const [newComment, setNewComment] = useState('');

  // Check if user has permission to see comments
  const canSeeComments = roles.some(role => 
    ['super_admin', 'country_admin', 'point_focal'].includes(role)
  );

  if (!isAuthenticated || !canSeeComments) {
    return null; // Hidden for others
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await addComment({ content: newComment });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const dateLocale = i18n.language === 'en' ? enUS : fr;

  return (
    <Card className="mt-12 border-primary/10 shadow-sm overflow-hidden print:hidden">
      <CardHeader className="bg-primary/5 border-b border-primary/10">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          {t('common.comments', 'Commentaires Internes')}
          <span className="text-xs font-normal bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-2">
            Réservé aux administrateurs
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        
        {/* Input section */}
        <div className="flex gap-4 items-start">
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            <AvatarFallback className="bg-primary/5 text-primary">
              <UserIcon className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder={t('support.comments.placeholder', 'Ajouter une note ou un commentaire interne...')}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] bg-muted/30 focus-visible:ring-primary/20"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleAddComment} 
                disabled={isSubmitting || !newComment.trim()}
                className="gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {t('common.send', 'Envoyer')}
              </Button>
            </div>
          </div>
        </div>

        {/* Comments list */}
        <div className="space-y-6 pt-6 border-t border-gray-100">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-10 bg-muted/20 rounded-xl border border-dashed">
              <MessageSquare className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Aucun commentaire pour le moment.</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-4 group">
                <Avatar className="h-9 w-9 mt-1 border border-primary/5">
                  <AvatarImage src={comment.profiles?.avatar_url || ''} />
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                    {comment.profiles?.full_name?.substring(0, 2).toUpperCase() || '??'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-muted/30 p-4 rounded-2xl rounded-tl-none group-hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-foreground">
                        {comment.profiles?.full_name || 'Utilisateur inconnu'}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                        {formatDistanceToNow(new Date(comment.created_at), { 
                          addSuffix: true, 
                          locale: dateLocale 
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
