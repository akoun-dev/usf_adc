import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PromotionRecord {
  id: string;
  role: string;
  created_at: string;
  promoted_by: string | null;
}

export function usePromotionHistory(userId: string | undefined) {
  return useQuery({
    queryKey: ['promotion-history', userId],
    queryFn: async (): Promise<PromotionRecord[]> => {
      if (!userId) return [];
      const { data, error } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('role_promotions' as any)
        .select('id, role, created_at, promoted_by')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (data as any) ?? [];
    },
    enabled: !!userId,
  });
}
