import { useQuery } from '@tanstack/react-query';
import { validationService } from '../services/validation-service';

export function useValidationActions(submissionId: string | undefined) {
  return useQuery({
    queryKey: ['validation-actions', submissionId],
    queryFn: () => validationService.getActions(submissionId!),
    enabled: !!submissionId,
  });
}
