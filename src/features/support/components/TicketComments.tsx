import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useComments } from '../hooks/useComments';
import { useAddComment } from '../hooks/useAddComment';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Send } from 'lucide-react';

export function TicketComments({ ticketId }: { ticketId: string }) {
  const { data: comments, isLoading } = useComments(ticketId);
  const addComment = useAddComment(ticketId);
  const [content, setContent] = useState('');
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  const locale = i18n.language === 'pt' ? 'pt-PT' : i18n.language === 'en' ? 'en-US' : 'fr-FR';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    addComment.mutate(content.trim(), {
      onSuccess: () => { setContent(''); toast({ title: t('support.comments.added') }); },
      onError: () => toast({ title: t('common.error'), description: t('support.comments.addError'), variant: 'destructive' }),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5" />
          {t('support.comments.title')} ({comments?.length ?? 0})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : comments && comments.length > 0 ? (
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="rounded-lg border bg-muted/30 p-3">
                <p className="whitespace-pre-wrap text-sm">{c.content}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(c.created_at).toLocaleString(locale)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t('support.comments.noComments')}</p>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('support.comments.placeholder')}
            rows={2}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={addComment.isPending || !content.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}