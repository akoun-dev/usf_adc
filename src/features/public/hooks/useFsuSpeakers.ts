import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Speaker {
    id: string;
    name: string;
    role: string;
    message: string;
    photo: string;
    fsu_name?: string;
}

async function fetchFsuSpeakers(): Promise<Speaker[]> {
    const { data, error } = await supabase
        .from('fsu_agencies')
        .select(`
            id, 
            dg_name, 
            dg_message, 
            dg_photo_url, 
            fsu_name, 
            countries(name_fr)
        `)
        .not('dg_name', 'is', null)
        .not('dg_message', 'is', null);

    if (error) throw error;

    return (data || []).map(a => ({
        id: a.id,
        name: a.dg_name || '',
        role: a.fsu_name || (a.countries as any)?.name_fr || '',
        message: a.dg_message as any,
        photo: a.dg_photo_url || '',
        fsu_name: a.fsu_name || ''
    }));
}

export function useFsuSpeakers() {
    return useQuery({
        queryKey: ['fsu-speakers'],
        queryFn: fetchFsuSpeakers
    });
}
