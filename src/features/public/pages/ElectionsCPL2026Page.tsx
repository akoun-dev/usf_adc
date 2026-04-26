import { useTranslation } from "react-i18next"
import { PublicLayout } from "../components/PublicLayout"
import PageHero from "@/components/PageHero"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, Users, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Link } from "react-router-dom"

const electionTimeline = [
    {
        phase: "announcement",
        icon: AlertCircle,
        date: "T1 2026",
        color: "from-orange-500 to-amber-500",
        titleKey: "elections.timeline.announcement",
        description: "Période de déclaration des candidatures et publication des candidats"
    },
    {
        phase: "campaign",
        icon: Users,
        date: "T2 2026",
        color: "from-blue-500 to-cyan-500",
        titleKey: "elections.timeline.campaign",
        description: "Campagne électorale et présentation des programmes"
    },
    {
        phase: "voting",
        icon: CheckCircle,
        date: "T3 2026",
        color: "from-purple-500 to-pink-500",
        titleKey: "elections.timeline.voting",
        description: "Période de vote pour les États membres"
    },
    {
        phase: "results",
        icon: Calendar,
        date: "T4 2026",
        color: "from-green-500 to-emerald-500",
        titleKey: "elections.timeline.results",
        description: "Annonce officielle des résultats"
    }
]

const electionDocuments = [
    {
        id: 1,
        title: "Règlement électoral CPL-2026",
        description: "Document officiel définissant les règles et procédures",
        type: "PDF",
        size: "2.4 MB"
    },
    {
        id: 2,
        title: "Critères d'éligibilité",
        description: "Exigences pour les candidats et votants",
        type: "PDF",
        size: "1.1 MB"
    },
    {
        id: 3,
        title: "Calendrier électoral détaillé",
        description: "Dates limites et étapes importantes",
        type: "PDF",
        size: "856 KB"
    }
]

export default function ElectionsCPL2026Page() {
    const { t } = useTranslation('public')

    return (
        <PublicLayout>
            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                <PageHero
                    title={t("elections.title")}
                    description={t("elections.description")}
                    icon={<Calendar className="h-6 w-6 text-secondary" />}
                />

                {/* Overview */}
                <div className="mb-12">
                    <Card className="bg-gradient-to-br from-primary to-secondary text-white dark:from-primary/80 dark:to-secondary/80 border-0">
                        <CardContent className="p-8">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-xl bg-white/20 dark:bg-black/20 flex items-center justify-center shrink-0">
                                    <Calendar className="h-8 w-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-3">{t("elections.overview.title")}</h2>
                                    <p className="text-white/80 dark:text-white/70 text-lg">
                                        {t("elections.overview.description")}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Timeline */}
                <div className="mb-12">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-2 text-foreground">{t("elections.timeline.title")}</h2>
                        <p className="text-muted-foreground">Calendrier des étapes clés du processus électoral</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {electionTimeline.map((phase) => {
                            const Icon = phase.icon
                            return (
                                <Card key={phase.phase} className="hover:shadow-lg transition-all duration-300 border-2 bg-card dark:bg-card/95">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col items-center text-center">
                                            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${phase.color} flex items-center justify-center mb-4`}>
                                                <Icon className="h-7 w-7 text-white" />
                                            </div>
                                            <Badge variant="secondary" className="mb-3">
                                                {phase.date}
                                            </Badge>
                                            <h3 className="font-bold text-lg mb-2 text-foreground">{t(phase.titleKey)}</h3>
                                            <p className="text-sm text-muted-foreground">{phase.description}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>

                {/* Process & Eligibility */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    <Card className="border-2 bg-card dark:bg-card/95">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/10 flex items-center justify-center shrink-0">
                                    <CheckCircle className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl mb-2 text-foreground">{t("elections.eligibility.title")}</h3>
                                    <p className="text-muted-foreground">{t("elections.eligibility.description")}</p>
                                </div>
                            </div>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• Être un État membre de l'ATU</li>
                                <li>• Avoir cotisé régulièrement au budget de l'ATU</li>
                                <li>• Être en règle avec ses obligations statutaires</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-2 bg-card dark:bg-card/95">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/10 flex items-center justify-center shrink-0">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl mb-2 text-foreground">{t("elections.process.title")}</h3>
                                    <p className="text-muted-foreground">{t("elections.process.description")}</p>
                                </div>
                            </div>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• Vote à bulletin secret</li>
                                <li>• Un vote par État membre</li>
                                <li>• Majorité simple requise</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Documents */}
                <div className="mb-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-2 text-foreground">{t("elections.documents.title")}</h2>
                        <p className="text-muted-foreground">{t("elections.documents.description")}</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {electionDocuments.map((doc) => (
                            <Card key={doc.id} className="hover:shadow-lg transition-all duration-300 border-2 bg-card dark:bg-card/95">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/10 flex items-center justify-center shrink-0">
                                            <FileText className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <Badge variant="outline" className="mb-2 text-xs">
                                                {doc.type}
                                            </Badge>
                                            <h3 className="font-bold mb-1 text-foreground">{doc.title}</h3>
                                            <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-muted-foreground">{doc.size}</span>
                                                <Button size="sm" variant="outline">
                                                    Télécharger
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* CTA to view candidates */}
                <Card className="bg-gradient-to-br from-primary to-secondary text-white dark:from-primary/80 dark:to-secondary/80 border-0">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Voir les candidats</h2>
                                <p className="text-white/80 dark:text-white/70">
                                    Consultez la liste des candidats au poste de Secrétaire Général de l'ATU
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                                    <Link to="/candidats-atu-sg">
                                        <Users className="h-5 w-5 mr-2" />
                                        Candidats ATU SG
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
