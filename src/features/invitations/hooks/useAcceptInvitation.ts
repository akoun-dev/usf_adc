import { useMutation } from '@tanstack/react-query';
import { acceptInvitation } from '../services/invitation-service';

export function useAcceptInvitation() {
  return useMutation({
    mutationFn: acceptInvitation,
  });
}
