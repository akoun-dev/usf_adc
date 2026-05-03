import { useMutation, useQueryClient } from '@tanstack/react-query';
import { upsertSetting } from '../services/admin-service';
import type { Json } from '@/integrations/supabase/types';

export function useUpdateSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value, label, category }: { key: string; value: Json; label: string; category: string }) => 
      upsertSetting(key, value, label, category),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['platform-settings'] }),
  });
}
