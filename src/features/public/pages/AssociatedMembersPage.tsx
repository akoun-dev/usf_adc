import { useTranslation } from "react-i18next"
import { PublicLayout } from "../components/PublicLayout"
import PageHero from "@/components/PageHero"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Handshake, Globe, Building2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

// ATU Associate Members data
const associatedMembers = [
    {
        id: 1,
        name: "ANSUT",
        fullName: "Agence Nationale du Service Universel des Télécommunications",
        country: "Côte d'Ivoire",
        logo: "🇨🇮",
        type: "agency",
        sector: "Service Universel",
        since: "2019",
        website: "https://ansut.ci",
        description: "Agence nationale ivoirienne responsable de la mise en œuvre du Service Universel des Télécommunications",
        projects: ["Déploiement 4G rural", "Écoles connectées"]
    },
    {
        id: 2,
        name: "MTN Group",
        fullName: "MTN Group Limited",
        country: "South Africa",
        logo: "🇿🇦",
        type: "operator",
        sector: "Opérateur Mobile",
        since: "2019",
        website: "https://www.mtn.com",
        description: "Groupe panafricain de télécommunications mobiles, présent dans 21 pays africains",
        projects: ["Connectivité transfrontalière", "Infrastructure 5G"]
    },
    {
        id: 3,
        name: "Orange Group",
        fullName: "Orange Middle East & Africa",
        country: "France",
        logo: "🇫🇷",
        type: "operator",
        sector: "Opérateur Télécoms",
        since: "2020",
        website: "https://www.orange.com",
        description: "Opérateur présent en 20+ pays d'Afrique de l'Ouest et du Centre",
        projects: ["Partage d'infrastructure", "Services numériques"]
    },
    {
        id: 4,
        name: "Huawei",
        fullName: "Huawei Technologies Co. Ltd.",
        country: "China",
        logo: "🇨🇳",
        type: "vendor",
        sector: "Équipements Réseaux",
        since: "2019",
        website: "https://www.huawei.com",
        description: "Leader mondial des solutions ICT et équipements de télécommunications",
        projects: ["Infrastructure 5G", "Smart Cities"]
    },
    {
        id: 5,
        name: "Google",
        fullName: "Google LLC",
        country: "United States",
        logo: "🇺🇸",
        type: "tech",
        sector: "Technologie & Services Numériques",
        since: "2021",
        website: "https://www.google.com",
        description: "Services cloud, connectivité et initiatives de digitalisation en Afrique",
        projects: ["Google Station WiFi", "Cloud services"]
    },
    {
        id: 6,
        name: "Microsoft",
        fullName: "Microsoft Corporation",
        country: "United States",
        logo: "🇺🇸",
        type: "tech",
        sector: "Cloud & Solutions Numériques",
        since: "2020",
        website: "https://www.microsoft.com",
        description: "Solutions cloud et services numériques pour les entreprises et administrations",
        projects: ["Formation digitale", "Cloud computing"]
    },
    {
        id: 7,
        name: "Amazon Data Services",
        fullName: "Amazon Web Services (AWS)",
        country: "United States",
        logo: "🇺🇸",
        type: "tech",
        sector: "Cloud & Infrastructure",
        since: "2022",
        website: "https://aws.amazon.com",
        description: "Services cloud et infrastructures pour les projets de connectivité",
        projects: ["Data centers", "Cloud infrastructure"]
    },
    {
        id: 8,
        name: "Nokia Solutions",
        fullName: "Nokia Corporation",
        country: "Finland",
        logo: "🇫🇮",
        type: "vendor",
        sector: "Équipements & Solutions Réseaux",
        since: "2019",
        website: "https://www.nokia.com",
        description: "Équipements réseaux, solutions 5G et services professionnels",
        projects: ["Réseaux mobiles", "IoT solutions"]
    },
    {
        id: 9,
        name: "Vodacom Group",
        fullName: "Vodacom Group Limited",
        country: "South Africa",
        logo: "🇿🇦",
        type: "operator",
        sector: "Opérateur Mobile",
        since: "2020",
        website: "https://www.vodacom.com",
        description: "Opérateur mobile panafricain, filiale de Vodafone",
        projects: ["Services mobiles", "Data services"]
    },
    {
        id: 10,
        name: "SES Luxembourg",
        fullName: "SES S.A.",
        country: "Luxembourg",
        logo: "🇱🇺",
        type: "satellite",
        sector: "Satellites & Connectivité",
        since: "2021",
        website: "https://www.ses.com",
        description: "Opérateur satellite mondial fournissant une connectivité high-speed",
        projects: ["Connectivité satellite", "Services broadband"]
    },
    {
        id: 11,
        name: "SpaceX",
        fullName: "SpaceX - Starlink",
        country: "United States",
        logo: "🇺🇸",
        type: "satellite",
        sector: "Satellites & Connectivité",
        since: "2023",
        website: "https://www.starlink.com",
        description: "Constellation satellites Starlink pour la connectivité mondiale et rurale",
        projects: ["Internet satellite", "Zones mal desservies"]
    },
    {
        id: 12,
        name: "GSMA",
        fullName: "GSM Association",
        country: "United Kingdom",
        logo: "🇬🇧",
        type: "organization",
        sector: "Association Professionnelle",
        since: "2019",
        website: "https://www.gsma.com",
        description: "Association représentant les opérateurs mobiles mondiaux et l'écosystème mobile",
        projects: ["Rapports FSU", "Best practices"]
    },
    {
        id: 13,
        name: "Eutelsat",
        fullName: "Eutelsat Group",
        country: "France",
        logo: "🇫🇷",
        type: "satellite",
        sector: "Satellites & Connectivité",
        since: "2020",
        website: "https://www.eutelsat.com",
        description: "Opérateur satellite européen couvrant l'Afrique avec des services de connectivité",
        projects: ["Services satellite", "Broadband rural"]
    },
    {
        id: 14,
        name: "Intelsat",
        fullName: "Intelsat S.A.",
        country: "Luxembourg",
        logo: "🇱🇺",
        type: "satellite",
        sector: "Satellites & Connectivité",
        since: "2019",
        website: "https://www.intelsat.com",
        description: "Opérateur satellite fournissant des services de connectivité en Afrique",
        projects: ["Réseaux cellulaires", "Services IP"]
    },
    {
        id: 15,
        name: "ZTE",
        fullName: "ZTE Corporation",
        country: "China",
        logo: "🇨🇳",
        type: "vendor",
        sector: "Équipements & Solutions Réseaux",
        since: "2019",
        website: "https://www.zte.com.cn",
        description: "Équipementier chinois proposant des solutions réseaux et télécoms",
        projects: ["Infrastructure 4G/5G", "Solutions broadband"]
    }
]

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

                {/* Members Grid */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">{t("associatedMembers.membersList")}</h2>
                            <p className="text-muted-foreground">{t("associatedMembers.membersListDesc")}</p>
                        </div>
                        <Badge variant="secondary" className="text-lg px-4 py-2">
                            {associatedMembers.length} {t("associatedMembers.members")}
                        </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {associatedMembers.map((member) => (
                            <Card key={member.id} className="hover:shadow-lg transition-all duration-300 border-2">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl">
                                            {member.logo}
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
                </div>

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
