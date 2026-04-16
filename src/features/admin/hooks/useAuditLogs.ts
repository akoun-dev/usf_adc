import { useQuery } from '@tanstack/react-query';
import { getAuditLogs } from '../services/admin-service';

export function useAuditLogs(limit = 100) {
  return useQuery({
    queryKey: ['audit-logs', limit],
    queryFn: () => getAuditLogs(limit),
  });
}
