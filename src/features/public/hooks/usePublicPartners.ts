import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export interface PublicPartner {
    id: string
    nom: string
    nom_complet: string | null
    logo_url: string | null
    type: string
    site_web: string | null
    est_actif: boolean | null
}

/**
 * Hook to fetch all active public partners (type "partenaire") with logos
 */
export function usePublicPartners() {
    return useQuery<PublicPartner[]>({
        queryKey: ['public-partners'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('partenaires')
                .select('id, nom, nom_complet, logo_url, type, site_web, est_actif')
                .eq('est_actif', true)
                .order('nom', { ascending: true })

            if (error) throw error
            return (data ?? []) as PublicPartner[]
        },
        staleTime: 15 * 60 * 1000, // 15 minutes
    })
}
