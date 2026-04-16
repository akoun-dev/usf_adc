import { useQuery } from '@tanstack/react-query';
import { reportsService } from '../services/reports-service';

export function useReportsData() {
  return useQuery({
    queryKey: ['reports-data'],
    queryFn: reportsService.getReportsData,
  });
}
