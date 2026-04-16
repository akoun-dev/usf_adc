import { useQuery } from '@tanstack/react-query';
import { validationService } from '../services/validation-service';
import type { SubmissionFilters } from '@/features/fsu/types';

export function useValidationSubmissions(filters?: SubmissionFilters) {
  return useQuery({
    queryKey: ['validation-submissions', filters],
    queryFn: () => validationService.listSubmissionsForValidation(filters),
  });
}
