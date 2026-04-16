import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTicket } from '../services/support-service';

export function useCreateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTicket,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['support-tickets'] }),
  });
}
