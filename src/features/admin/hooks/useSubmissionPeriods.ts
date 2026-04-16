import { useQuery } from '@tanstack/react-query';
import { getSubmissionPeriods } from '../services/admin-service';

export function useSubmissionPeriods() {
  return useQuery({
    queryKey: ['submission-periods'],
    queryFn: getSubmissionPeriods,
  });
}
