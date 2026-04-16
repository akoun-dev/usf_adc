import { useQuery } from '@tanstack/react-query';
import { getComments } from '../services/comment-service';

export function useComments(ticketId: string) {
  return useQuery({
    queryKey: ['support-ticket-comments', ticketId],
    queryFn: () => getComments(ticketId),
    enabled: !!ticketId,
  });
}
