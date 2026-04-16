import { useMutation, useQueryClient } from '@tanstack/react-query';
import { validationService } from '../services/validation-service';
import type { ValidationActionType } from '@/core/constants/roles';
import { toast } from 'sonner';

const ACTION_MESSAGES: Record<ValidationActionType, string> = {
  approve: 'Soumission approuvée',
  reject: 'Soumission rejetée',
  request_revision: 'Révision demandée',
  comment: 'Commentaire ajouté',
};

export function usePerformValidation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      submissionId: string;
      action: ValidationActionType;
      comment: string | null;
      userId: string;
      isGlobalAdmin?: boolean;
    }) =>
      validationService.performAction(
        params.submissionId,
        params.action,
        params.comment,
        params.userId,
        params.isGlobalAdmin,
      ),
    onSuccess: (_, variables) => {
      toast.success(ACTION_MESSAGES[variables.action]);
      queryClient.invalidateQueries({ queryKey: ['validation-actions', variables.submissionId] });
      queryClient.invalidateQueries({ queryKey: ['fsu-submission', variables.submissionId] });
      queryClient.invalidateQueries({ queryKey: ['validation-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['fsu-submissions'] });
    },
    onError: () => {
      toast.error("Erreur lors de l'action de validation");
    },
  });
}
