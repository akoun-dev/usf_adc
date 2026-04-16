import { useQuery } from '@tanstack/react-query';
import { getTickets } from '../services/support-service';

export function useTickets() {
  return useQuery({
    queryKey: ['support-tickets'],
    queryFn: getTickets,
  });
}
