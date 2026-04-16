import { useMutation, useQueryClient } from '@tanstack/react-query';
import { forumService } from '../services/forum-service';
import { toast } from 'sonner';

export function useUpdateTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, title, content }: { id: string; title: string; content: string }) =>
      forumService.updateTopic(id, { title, content }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['forum-topic', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['forum-topics'] });
      toast.success('Sujet modifié');
    },
    onError: () => toast.error('Erreur lors de la modification du sujet'),
  });
}
