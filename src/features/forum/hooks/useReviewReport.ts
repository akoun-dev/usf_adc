import { useMutation, useQueryClient } from '@tanstack/react-query';
import { moderationService } from '../services/moderation-service';
import { toast } from 'sonner';

export function useReviewReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, status, reviewerId }: { reportId: string; status: 'reviewed' | 'dismissed'; reviewerId: string }) =>
      moderationService.reviewReport(reportId, status, reviewerId),
    onSuccess: () => {
      toast.success('Signalement traité');
      qc.invalidateQueries({ queryKey: ['forum-reports'] });
    },
    onError: () => toast.error('Erreur lors du traitement'),
  });
}
