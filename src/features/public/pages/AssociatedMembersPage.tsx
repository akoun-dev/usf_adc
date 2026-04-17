import { useTranslation } from "react-i18next"
import { PublicLayout } from "../components/PublicLayout"
import PageHero from "@/components/PageHero"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Handshake, Globe, Building2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

// Service to fetch associated members from database
async function fetchAssociatedMembers() {
    try {
        const { data, error } = await supabase
            .from('membres_associes')
            .select('*, countries(name_fr, name_en, code_iso, flag_url)')
            .eq('est_actif', true)
            .order('nom', { ascending: true });
        
        if (error) throw error;
        
        return data.map(member => ({
            id: member.id,
            name: member.nom,
            fullName: member.nom_complet || member.nom,
            country: member.countries?.name_fr || 'Unknown',
            logo: member.logo_url || getCountryFlag(member.countries?.code_iso),
            type: mapMemberType(member.type),
            sector: member.secteur || 'N/A',
            since: member.depuis || 'N/A',
            website: member.site_web,
            description: member.description || '',
            projects: member.projets || []
        }));
    } catch (error) {
        console.error('Error fetching members:', error);
        return [];
    }
}

// Service to fetch partners from database
async function fetchPartners() {
    try {
        const { data, error } = await supabase
            .from('partenaires')
            .select('*, countries(name_fr, name_en, code_iso, flag_url)')
            .eq('est_actif', true)
            .order('nom', { ascending: true });
        
        if (error) throw error;
        
        return data.map(partner => ({
            id: partner.id,
            name: partner.nom,
            fullName: partner.nom_complet || partner.nom,
            country: partner.countries?.name_fr || 'Unknown',
            logo: partner.logo_url || getCountryFlag(partner.countries?.code_iso),
            type: mapPartnerType(partner.type),
            sector: partner.domaine || 'N/A',
            since: partner.depuis || 'N/A',
            website: partner.site_web,
            description: partner.description || '',
            projects: partner.projets || []
        }));
    } catch (error) {
        console.error('Error fetching partners:', error);
        return [];
    }
}

// Helper functions
function getCountryFlag(countryCode) {
    if (!countryCode) return '🌍';
    // Simple country code to flag emoji mapping
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char =>  127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

function mapMemberType(type) {
    const typeMap = {
        'agence': 'agency',
        'operateur': 'operator',
        'institution': 'institution',
        'association': 'organization'
    };
    return typeMap[type] || type;
}

function mapPartnerType(type) {
    const typeMap = {
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
    const { t } = useTranslation('public')
    
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
            <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <PageHero
                    title={t("associatedMembers.title")}
                    description={t("associatedMembers.description")}
                    icon={<Users className="h-6 w-6 text-secondary" />}
                />

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
                        <p className="text-muted-foreground">{t('common.loading')}</p>
                    </div>
                )}
                
                {/* Error state */}
                {hasError && (
                    <div className="text-center py-12">
                        <div className="mx-auto w-fit p-4 rounded-full bg-destructive/10 mb-4">
                            <Users className="h-8 w-8 text-destructive" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{t('common.error')}</h3>
                        <p className="text-muted-foreground mb-4">
                            {t('associatedMembers.loadError')}
                        </p>
                        <Button onClick={() => window.location.reload()}>
                            {t('common.retry')}
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
                            <Badge variant="secondary" className="text-lg px-4 py-2">
                                {allMembers.length} {t("associatedMembers.members")}
                            </Badge>
                        </div>

                        {allMembers.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">{t('associatedMembers.noMembers')}</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {allMembers.map((member) => (
                                    <Card key={member.id} className="hover:shadow-lg transition-all duration-300 border-2">
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-16 h-16 flex items-center justify-center">
                                                    {member.logo.includes('http') ? (
                                                        <img
                                                            src={member.logo}
                                                            alt={`${member.name} logo`}
                                                            className="w-full h-full max-w-[64px] max-h-[64px] object-contain"
                                                        />
                                                    ) : (
                                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl">
                                                            {member.logo}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                                                    <p className="text-xs text-muted-foreground mb-2">{member.fullName}</p>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            {t(`associatedMembers.types.${member.type}`)}
                                                        </Badge>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {t("associatedMembers.since")} {member.since}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mb-1">{member.country}</p>
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
                                            <div className="flex gap-2">
                                                {member.website && (
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
                                                )}
                                                <Button asChild size="sm" variant="outline" className="flex-1">
                                                    <Link to={`/membres-associes/${member.id}`} className="flex items-center justify-center gap-1">
                                                        {t("associatedMembers.viewProfile")}
                                                        <ArrowRight className="h-3 w-3" />
                                                    </Link>
                                                </Button>
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
