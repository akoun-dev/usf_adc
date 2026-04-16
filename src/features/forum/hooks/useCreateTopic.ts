import { useMutation, useQueryClient } from '@tanstack/react-query';
import { forumService } from '../services/forum-service';

export function useCreateTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: forumService.createTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-topics'] });
    },
  });
}
