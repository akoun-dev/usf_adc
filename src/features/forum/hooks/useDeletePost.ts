import { useMutation, useQueryClient } from '@tanstack/react-query';
import { forumService } from '../services/forum-service';
import { toast } from 'sonner';

export function useDeletePost(topicId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => forumService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts', topicId] });
      toast.success('Réponse supprimée');
    },
    onError: () => toast.error('Erreur lors de la suppression'),
  });
}
