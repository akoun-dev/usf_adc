import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSubmissionPeriod, updateSubmissionPeriod, deleteSubmissionPeriod } from '../services/admin-service';

export function useCreateSubmissionPeriod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createSubmissionPeriod,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['submission-periods'] }),
  });
}

export function useUpdateSubmissionPeriod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string } & Record<string, unknown>) =>
      updateSubmissionPeriod(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['submission-periods'] }),
  });
}

export function useDeleteSubmissionPeriod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteSubmissionPeriod,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['submission-periods'] }),
  });
}
