import { useMutation, useQueryClient } from '@tanstack/react-query';
import { moderationService } from '../services/moderation-service';
import { toast } from 'sonner';

export function useReportContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: moderationService.reportContent,
    onSuccess: () => {
      toast.success('Contenu signalé avec succès');
      qc.invalidateQueries({ queryKey: ['forum-reports'] });
    },
    onError: () => toast.error('Erreur lors du signalement'),
  });
}
