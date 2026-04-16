import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fsuService } from '../services/fsu-service';
import type { FsuFormData } from '../types';

export function useSubmitSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; userId: string; formData: FsuFormData }) =>
      fsuService.submit(params.id, params.userId, params.formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fsu-submissions'] });
    },
  });
}
