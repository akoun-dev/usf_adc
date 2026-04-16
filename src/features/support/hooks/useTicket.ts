import { useQuery } from '@tanstack/react-query';
import { getTicket } from '../services/support-service';

export function useTicket(id: string) {
  return useQuery({
    queryKey: ['support-ticket', id],
    queryFn: () => getTicket(id),
    enabled: !!id,
  });
}
