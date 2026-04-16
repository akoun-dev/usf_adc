import { useQuery } from '@tanstack/react-query';
import { getSettings } from '../services/admin-service';

export function useSettings() {
  return useQuery({
    queryKey: ['platform-settings'],
    queryFn: getSettings,
  });
}
