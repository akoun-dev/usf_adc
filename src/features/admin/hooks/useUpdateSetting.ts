import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSetting } from '../services/admin-service';
import type { Json } from '@/integrations/supabase/types';

export function useUpdateSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, value }: { id: string; value: Json }) => updateSetting(id, value),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['platform-settings'] }),
  });
}
