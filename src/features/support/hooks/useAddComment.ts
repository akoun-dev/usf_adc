import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addComment } from '../services/comment-service';

export function useAddComment(ticketId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => addComment(ticketId, content),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['support-ticket-comments', ticketId] }),
  });
}
