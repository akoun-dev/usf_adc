import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fsuService } from '../services/fsu-service';
import type { FsuFormData } from '../types';

export function useCreateSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { userId: string; countryId: string; formData: FsuFormData }) =>
      fsuService.create(params.userId, params.countryId, params.formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fsu-submissions'] });
    },
  });
}

export function useSaveDraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { id: string; userId: string; formData: Partial<FsuFormData> }) =>
      fsuService.saveDraft(params.id, params.userId, params.formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fsu-submissions'] });
    },
  });
}
