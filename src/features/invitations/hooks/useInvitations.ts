import { useQuery } from '@tanstack/react-query';
import { fetchInvitations } from '../services/invitation-service';

export function useInvitations() {
  return useQuery({
    queryKey: ['invitations'],
    queryFn: fetchInvitations,
  });
}
