import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCreatePost } from '../hooks/useCreatePost';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

export function PostForm({ topicId }: { topicId: string }) {
  const [content, setContent] = useState('');
  const { user } = useAuth();
  const { mutate, isPending } = useCreatePost();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    mutate(
      { topic_id: topicId, content: content.trim(), author_id: user.id },
      {
        onSuccess: () => {
          setContent('');
          toast({ title: 'Réponse publiée' });
        },
        onError: () => {
          toast({ title: 'Erreur', description: 'Impossible de publier la réponse.', variant: 'destructive' });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Écrire une réponse…"
        className="min-h-[60px] flex-1"
        required
        maxLength={2000}
      />
      <Button type="submit" size="icon" disabled={isPending || !content.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
