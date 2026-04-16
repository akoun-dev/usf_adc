import { useQuery } from '@tanstack/react-query';
import { fsuService } from '../services/fsu-service';

export function useSubmission(id: string | undefined) {
  return useQuery({
    queryKey: ['fsu-submission', id],
    queryFn: () => fsuService.getById(id!),
    enabled: !!id,
  });
}
