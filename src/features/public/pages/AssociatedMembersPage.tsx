import { useTranslation } from "react-i18next"
import { PublicLayout } from "../components/PublicLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Handshake, Globe, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import bgHeader from '@/assets/bg-header.jpg'

// ── Types ──────────────────────────────────────────────────────────────

/** Données de jointure pays retournées par Supabase */
type CountryJoin = {
    name_fr: string | null;
    name_en: string | null;
    code_iso: string | null;
} | null;

/** Membre associé brut retourné par la requête Supabase (table membres_associes) */
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

/** Partenaire brut retourné par la requête Supabase (table partenaires) */
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

/** Membre associé / partenaire formaté pour l'affichage */
type AssociatedMember = {
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

// ── Services ───────────────────────────────────────────────────────────

// Service to fetch associated members from database
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

// Service to fetch partners from database
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

// Helper functions
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

const membershipBenefits = [
    {
        icon: Globe,
        titleKey: "associatedMembers.benefits.network.title",
        descKey: "associatedMembers.benefits.network.desc"
    },
    {
        icon: Users,
        titleKey: "associatedMembers.benefits.collaboration.title",
        descKey: "associatedMembers.benefits.collaboration.desc"
    },
    {
        icon: Handshake,
        titleKey: "associatedMembers.benefits.partnerships.title",
        descKey: "associatedMembers.benefits.partnerships.desc"
    }
]

export default function AssociatedMembersPage() {
    const { t } = useTranslation(['public', 'translation'])

    // Fetch members and partners from database
    const {
        data: members = [],
        isLoading: membersLoading,
        error: membersError
    } = useQuery({
        queryKey: ['associated-members'],
        queryFn: fetchAssociatedMembers
    })

    const {
        data: partners = [],
        isLoading: partnersLoading,
        error: partnersError
    } = useQuery({
        queryKey: ['partners'],
        queryFn: fetchPartners
    })

    // Combine members and partners for display
    const allMembers = [...members, ...partners]
    const isLoading = membersLoading || partnersLoading
    const hasError = membersError || partnersError

    return (
        <PublicLayout>

            <div className="space-y-12 relative bg-gray-50">

                {/* Hero */}
                <div
                    className="relative bg-cover bg-center bg-no-repeat pb-5 !m-0 border-b"
                    style={{ backgroundImage: `url(${bgHeader})` }}
                >
                    <div className="absolute inset-0" />
                    <div className="relative text-center max-w-4xl mx-auto space-y-6 h-56 flex flex-col items-center justify-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-primary">
                            {t("associatedMembers.title")}
                        </h1>
                        <p className="text-xl text-base/80 leading-relaxed !mt-2">
                            {t("associatedMembers.description")}
                        </p>
                    </div>
                </div>

            </div>


            <div className="w-full px-20 min-[1900px]:px-40 lg:px-12 md:px-10 sm:px-6 py-10">

                {/* Benefits Section */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {membershipBenefits.map((benefit, index) => (
                        <Card key={index} className="border-2">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <benefit.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">{t(benefit.titleKey)}</h3>
                                        <p className="text-sm text-muted-foreground">{t(benefit.descKey)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Loading state */}
                {isLoading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">{t('translation:common.loading')}</p>
                    </div>
                )}

                {/* Error state */}
                {hasError && (
                    <div className="text-center py-12">
                        <div className="mx-auto w-fit p-4 rounded-full bg-destructive/10 mb-4">
                            <Users className="h-8 w-8 text-destructive" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{t('translation:common.error')}</h3>
                        <p className="text-muted-foreground mb-4">
                            {t('associatedMembers.loadError')}
                        </p>
                        <Button onClick={() => window.location.reload()}>
                            {t('translation:common.retry')}
                        </Button>
                    </div>
                )}

                {/* Members Grid */}
                {!isLoading && !hasError && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">{t("associatedMembers.membersList")}</h2>
                                <p className="text-muted-foreground">{t("associatedMembers.membersListDesc")}</p>
                            </div>
                            <Badge variant="secondary" className="text-xs px-4 py-2">
                                {allMembers.length} {t("associatedMembers.members")}
                            </Badge>
                        </div>

                        {allMembers.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">{t('associatedMembers.noMembers')}</p>
                            </div>
                        ) : (
                            <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {allMembers.map((member) => (
                                    <Card key={member.id} className="hover:shadow-lg transition-all duration-300 border-2 h-full">
                                        <CardContent className="pt-4 pb-6 px-6 flex flex-col h-full">
                                            <div className="flex flex-col items-center gap-4 mb-4">
                                                <Badge className="font-normal text-sm mb-1 bg-gray-200 text-gray-600 hover:bg-secondary hover:text-black">{member.name}</Badge>
                                                <div className="h-20 flex items-start justify-center">
                                                    {member.logo.includes('http') ? (
                                                        <img
                                                            src={member.logo}
                                                            alt={`${member.name} logo`}
                                                            className="w-full h-full max-h-[75px] object-contain"
                                                        />
                                                    ) : (
                                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl">
                                                            {member.logo}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 flex flex-col items-center text-center">
                                                    <hr className="my-3 w-full" />
                                                    <p className="text-xs text-muted-foreground mb-3">{member.fullName}</p>

                                                    <div className="flex items-center justify-center gap-2 mb-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            {t(`associatedMembers.types.${member.type}`)}
                                                        </Badge>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {t("associatedMembers.since")} {member.since}
                                                        </Badge>
                                                    </div>

                                                    <p className="text-xs text-primary font-medium">{member.sector}</p>
                                                </div>

                                            </div>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                {member.description}
                                            </p>
                                            {member.projects && member.projects.length > 0 && (
                                                <div className="mb-4 p-3 rounded-lg bg-muted/50">
                                                    <p className="text-xs font-medium mb-2 flex items-center gap-1">
                                                        <Users className="h-3 w-3" />
                                                        {t("associatedMembers.projects")}
                                                    </p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {member.projects.map((project, idx) => (
                                                            <Badge key={idx} variant="outline" className="text-xs">
                                                                {project}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex gap-2 mt-auto pt-4">
                                                {member.website ? (
                                                    <Button asChild variant="outline" size="sm" className="flex-1">
                                                        <a
                                                            href={member.website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-center gap-1"
                                                        >
                                                            <Globe className="h-3 w-3" />
                                                            {t("associatedMembers.visitWebsite")}
                                                        </a>
                                                    </Button>
                                                ) : (
                                                    <Button asChild size="sm" variant="outline" className="flex-1">
                                                        <a
                                                            href={`mailto:membership@atuuat.africa`}
                                                            className="flex items-center justify-center gap-1"
                                                        >
                                                            <Globe className="h-3 w-3" />
                                                            {t("associatedMembers.visitWebsite")}
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Become Member CTA */}
                <Card className="bg-gradient-to-br from-primary to-secondary text-white border-0">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">{t("associatedMembers.becomeMember.title")}</h2>
                                <p className="text-white/80">
                                    {t("associatedMembers.becomeMember.description")}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                                    <a href="mailto:membership@atuuat.africa">
                                        <Building2 className="h-5 w-5 mr-2" />
                                        {t("associatedMembers.becomeMember.contactButton")}
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PublicLayout>
    )
}
