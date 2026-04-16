import { useMutation, useQueryClient } from '@tanstack/react-query';
import { forumService } from '../services/forum-service';
import { toast } from 'sonner';

export function useUpdatePost(topicId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      forumService.updatePost(id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts', topicId] });
      toast.success('Réponse modifiée');
    },
    onError: () => toast.error('Erreur lors de la modification'),
  });
}
