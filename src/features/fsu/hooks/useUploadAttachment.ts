import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fsuService } from '../services/fsu-service';

export function useUploadAttachment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { submissionId: string; userId: string; file: File }) =>
      fsuService.uploadAttachment(params.submissionId, params.userId, params.file),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['fsu-attachments', vars.submissionId] });
    },
  });
}

export function useDeleteAttachment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { attachmentId: string; filePath: string; submissionId: string }) =>
      fsuService.deleteAttachment(params.attachmentId, params.filePath),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['fsu-attachments', vars.submissionId] });
    },
  });
}
