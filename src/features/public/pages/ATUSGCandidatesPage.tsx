import { useTranslation } from "react-i18next"
import { PublicLayout } from "../components/PublicLayout"
import PageHero from "@/components/PageHero"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Eye, Mail, Globe, Award, Briefcase } from "lucide-react"
import { Link } from "react-router-dom"

// Mock candidates data - to be replaced with real data
const atuSGCandidates = [
    {
        id: 1,
        name: "Candidat 1",
        country: "Pays membre 1",
        flag: "🏳️",
        position: "Poste actuel",
        currentRole: "Ministre des Télécommunications",
        experience: "20 ans d'expérience dans le secteur",
        education: "Doctorat en Télécommunications",
        vision: "Vision pour une Afrique connectée et digitale",
        manifesto: "Programme électoral axé sur l'inclusion numérique",
        achievements: [
            "Lancement de 5 projets FSU nationaux",
            "Mise en place de politiques de connectivité rurale",
            "Réduction de la fracture numérique de 40%"
        ],
        website: "https://example.com",
        email: "candidat1@example.com"
    },
    {
        id: 2,
        name: "Candidat 2",
        country: "Pays membre 2",
        flag: "🏴",
        position: "Poste actuel",
        currentRole: "PDG d'Opérateur Télécoms",
        experience: "15 ans dans l'industrie privée",
        education: "MBA en Management",
        vision: "Transformation digitale par le partenariat public-privé",
        manifesto: "Innovation et investissement dans les infrastructures",
        achievements: [
            "Déploiement de 1000 km de fibre optique",
            "Création de 5000 emplois directs",
            "Investissement de 500M$ en infrastructures"
        ],
        website: "https://example.com",
        email: "candidat2@example.com"
    }
]

const nominationProcess = [
    {
        step: 1,
        title: "Candidature",
        description: "Soumission du dossier de candidature complet"
    },
    {
        step: 2,
        title: "Vérification",
        description: "Vérification de l'éligibilité par le comité"
    },
    {
        step: 3,
        title: "Campagne",
        description: "Présentation du programme électoral"
    },
    {
        step: 4,
        title: "Élection",
        description: "Vote par les États membres"
    }
]

export default function ATUSGCandidatesPage() {
    const { t } = useTranslation('public')

    return (
        <PublicLayout>
            <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <PageHero
                    title={t("candidates.title")}
                    description={t("candidates.description")}
                    icon={<Award className="h-6 w-6 text-secondary" />}
                />

                {/* Candidates Grid */}
                <div className="mb-12">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-2 text-foreground">{t("candidates.candidatesList")}</h2>
                        <p className="text-muted-foreground">Candidats au poste de Secrétaire Général de l'ATU</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {atuSGCandidates.map((candidate) => (
                            <Card key={candidate.id} className="hover:shadow-lg transition-all duration-300 border-2 bg-card dark:bg-card/95">
                                <CardContent className="p-6">
                                    {/* Header */}
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl">
                                            {candidate.flag}
                                        </div>
                                        <div className="flex-1">
                                            <Badge variant="secondary" className="mb-2">Candidat #{candidate.id}</Badge>
                                            <h3 className="text-xl font-bold mb-1 text-foreground">{candidate.name}</h3>
                                            <p className="text-sm text-muted-foreground mb-1">{candidate.country}</p>
                                            <p className="text-sm text-primary font-medium">{candidate.currentRole}</p>
                                        </div>
                                    </div>

                                    {/* Experience & Education */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-start gap-2">
                                            <Briefcase className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-xs font-medium text-foreground">Expérience</p>
                                                <p className="text-xs text-muted-foreground">{candidate.experience}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Award className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-xs font-medium text-foreground">Formation</p>
                                                <p className="text-xs text-muted-foreground">{candidate.education}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vision */}
                                    <div className="mb-4 p-4 rounded-lg bg-muted/50 dark:bg-muted/30">
                                        <p className="text-sm font-medium mb-1 flex items-center gap-1 text-foreground">
                                            <Eye className="h-3 w-3" />
                                            {t("candidates.vision")}
                                        </p>
                                        <p className="text-sm text-muted-foreground">{candidate.vision}</p>
                                    </div>

                                    {/* Manifesto */}
                                    <div className="mb-4 p-4 rounded-lg bg-muted/50 dark:bg-muted/30">
                                        <p className="text-sm font-medium mb-1 flex items-center gap-1 text-foreground">
                                            <FileText className="h-3 w-3" />
                                            {t("candidates.manifesto")}
                                        </p>
                                        <p className="text-sm text-muted-foreground">{candidate.manifesto}</p>
                                    </div>

                                    {/* Achievements */}
                                    <div className="mb-6">
                                        <p className="text-sm font-medium mb-2 text-foreground">{t("candidates.experience")}</p>
                                        <ul className="space-y-1">
                                            {candidate.achievements.map((achievement, idx) => (
                                                <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                                                    <span className="text-primary">•</span>
                                                    {achievement}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        {candidate.website && (
                                            <Button asChild variant="outline" size="sm" className="flex-1">
                                                <a
                                                    href={candidate.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-1"
                                                >
                                                    <Globe className="h-3 w-3" />
                                                    Site web
                                                </a>
                                            </Button>
                                        )}
                                        <Button asChild variant="outline" size="sm" className="flex-1">
                                            <a
                                                href={`mailto:${candidate.email}`}
                                                className="flex items-center justify-center gap-1"
                                            >
                                                <Mail className="h-3 w-3" />
                                                Contacter
                                            </a>
                                        </Button>
                                        <Button asChild size="sm" variant="outline" className="flex-1">
                                            <Link to={`/candidats-atu-sg/${candidate.id}`} className="flex items-center justify-center gap-1">
                                                <Eye className="h-3 w-3" />
                                                {t("candidates.viewProfile")}
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Nomination Process */}
                <div className="mb-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-2 text-foreground">{t("candidates.nomination.title")}</h2>
                        <p className="text-muted-foreground">{t("candidates.nomination.description")}</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {nominationProcess.map((step) => (
                            <Card key={step.step} className="border-2 bg-card dark:bg-card/95">
                                <CardContent className="p-6 text-center">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-xl font-bold text-primary">{step.step}</span>
                                    </div>
                                    <h3 className="font-bold mb-2 text-foreground">{step.title}</h3>
                                    <p className="text-sm text-muted-foreground">{step.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Voting Process */}
                <Card className="bg-gradient-to-br from-primary to-secondary text-white dark:from-primary/80 dark:to-secondary/80 border-0">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">{t("candidates.voting.title")}</h2>
                                <p className="text-white/80 dark:text-white/70">
                                    {t("candidates.voting.description")}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                                    <Link to="/elections-cpl-2026">
                                        En savoir plus
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PublicLayout>
    )
}
