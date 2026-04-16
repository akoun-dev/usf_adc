import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Country {
  id: string;
  name_fr: string;
  name_en: string;
  code_iso: string;
  region: string;
}

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('countries')
        .select('id, name_fr, name_en, code_iso, region')
        .order('name_fr');
      if (error) throw error;
      return data as Country[];
    },
  });
}
