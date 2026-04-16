import { useQuery } from '@tanstack/react-query';
import { moderationService } from '../services/moderation-service';

export function useForumReports(statusFilter?: string) {
  return useQuery({
    queryKey: ['forum-reports', statusFilter],
    queryFn: () => moderationService.getReports(statusFilter),
  });
}
