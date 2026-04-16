import { useMutation, useQueryClient } from '@tanstack/react-query';
import { forumService } from '../services/forum-service';

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: forumService.createPost,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts', variables.topic_id] });
    },
  });
}
