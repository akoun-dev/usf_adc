import { useQuery } from '@tanstack/react-query';
import { fsuService } from '../services/fsu-service';
import type { SubmissionFilters } from '../types';

export function useSubmissions(filters?: SubmissionFilters) {
  return useQuery({
    queryKey: ['fsu-submissions', filters],
    queryFn: () => fsuService.list(filters),
  });
}
