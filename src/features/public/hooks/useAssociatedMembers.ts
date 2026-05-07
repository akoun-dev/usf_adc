import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// ── Types ──────────────────────────────────────────────────────────────

type CountryJoin = {
    name_fr: string | null;
    name_en: string | null;
    code_iso: string | null;
} | null;

type MembreAssocieRow = {
    id: string;
    nom: string;
    nom_complet: string | null;
    logo_url: string | null;
    type: string;
    secteur: string | null;
    depuis: string | null;
    site_web: string | null;
    description: string | null;
    projets: unknown | null;
    pays_id: string | null;
    countries: CountryJoin;
};

type PartenaireRow = {
    id: string;
    nom: string;
    nom_complet: string | null;
    logo_url: string | null;
    type: string;
    domaine: string | null;
    depuis: string | null;
    site_web: string | null;
    description: string | null;
    projets: unknown | null;
    pays_id: string | null;
    countries: CountryJoin;
};

export type AssociatedMember = {
    id: string;
    name: string;
    fullName: string;
    country: string;
    logo: string;
    type: string;
    sector: string;
    since: string;
    website: string | null;
    description: string;
    projects: string[];
};

// ── Helpers ────────────────────────────────────────────────────────────

function getCountryFlag(countryCode: string | undefined): string {
    if (!countryCode) return '🌍';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

function mapMemberType(type: string): string {
    const typeMap: Record<string, string> = {
        'agence': 'agency',
        'operateur': 'operator',
        'institution': 'institution',
        'association': 'organization'
    };
    return typeMap[type] || type;
}

function mapPartnerType(type: string): string {
    const typeMap: Record<string, string> = {
        'institutionnel': 'institution',
        'prive': 'private',
        'ong': 'ngo',
        'international': 'international'
    };
    return typeMap[type] || type;
}

// ── Service functions ──────────────────────────────────────────────────

async function fetchAssociatedMembers(): Promise<AssociatedMember[]> {
    const { data, error } = await supabase
        .from('membres_associes')
        .select('id, nom, nom_complet, logo_url, type, secteur, depuis, site_web, description, projets, pays_id, countries(name_fr, name_en, code_iso)')
        .eq('est_actif', true)
        .order('nom', { ascending: true });

    if (error) throw error;

    return (data as MembreAssocieRow[] ?? []).map((member): AssociatedMember => {
        const country = member.countries;
        return {
            id: member.id,
            name: member.nom,
            fullName: member.nom_complet || member.nom,
            country: country?.name_fr || 'Unknown',
            logo: member.logo_url || getCountryFlag(country?.code_iso),
            type: mapMemberType(member.type),
            sector: member.secteur || 'N/A',
            since: member.depuis || 'N/A',
            website: member.site_web,
            description: member.description || '',
            projects: (member.projets as { projets: string[] } | null)?.projets || []
        };
    });
}

async function fetchPartners(): Promise<AssociatedMember[]> {
    const { data, error } = await supabase
        .from('partenaires')
        .select('id, nom, nom_complet, logo_url, type, domaine, depuis, site_web, description, projets, pays_id, countries(name_fr, name_en, code_iso)')
        .eq('est_actif', true)
        .order('nom', { ascending: true });

    if (error) throw error;

    return (data as PartenaireRow[] ?? []).map((partner): AssociatedMember => {
        const country = partner.countries;
        return {
            id: partner.id,
            name: partner.nom,
            fullName: partner.nom_complet || partner.nom,
            country: country?.name_fr || 'Unknown',
            logo: partner.logo_url || getCountryFlag(country?.code_iso),
            type: mapPartnerType(partner.type),
            sector: partner.domaine || 'N/A',
            since: partner.depuis || 'N/A',
            website: partner.site_web,
            description: partner.description || '',
            projects: (partner.projets as { projets: string[] } | null)?.projets || []
        };
    });
}

// ── Hooks ──────────────────────────────────────────────────────────────

export function useAssociatedMembers() {
    return useQuery({
        queryKey: ['associated-members'],
        queryFn: fetchAssociatedMembers
    });
}

export function usePartners() {
    return useQuery({
        queryKey: ['partners'],
        queryFn: fetchPartners
    });
}
