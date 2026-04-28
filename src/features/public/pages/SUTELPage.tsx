import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
    Shield,
    Target,
    Users,
    Building2,
    FileText,
    Phone,
    Mail,
    Globe,
    Zap,
    TrendingUp,
    Lightbulb,
    Handshake,
    Award,
    BookOpen,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    Network,
    DollarSign,
    MapPin,
    Calendar,
    AlertTriangle
} from "lucide-react"
import { PublicLayout } from "../components/PublicLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import PageHero from "@/components/PageHero"
import bgHeader from '@/assets/bg-header.jpg'







export default function SUTELPage() {
    const { t } = useTranslation('public')

    // Mission data with translations
    const missions = [
        { icon: Shield, titleKey: "sutel.missions.universal.title", descKey: "sutel.missions.universal.desc", color: "from-blue-500 to-cyan-500" },
        { icon: Users, titleKey: "sutel.missions.inclusion.title", descKey: "sutel.missions.inclusion.desc", color: "from-purple-500 to-pink-500" },
        { icon: TrendingUp, titleKey: "sutel.missions.economic.title", descKey: "sutel.missions.economic.desc", color: "from-green-500 to-emerald-500" },
        { icon: Lightbulb, titleKey: "sutel.missions.innovation.title", descKey: "sutel.missions.innovation.desc", color: "from-amber-500 to-orange-500" }
    ]

    // Actors data with translations
    const actors = [
        { nameKey: "sutel.actors.ansut.name", fullNameKey: "sutel.actors.ansut.fullName", roleKey: "sutel.actors.ansut.role", countryKey: "sutel.actors.ansut.country", descKey: "sutel.actors.ansut.desc", websiteKey: "sutel.actors.ansut.website" },
        { nameKey: "sutel.actors.uat.name", fullNameKey: "sutel.actors.uat.fullName", roleKey: "sutel.actors.uat.role", countryKey: "sutel.actors.uat.country", descKey: "sutel.actors.uat.desc", websiteKey: "sutel.actors.uat.website" },
        { nameKey: "sutel.actors.gsma.name", fullNameKey: "sutel.actors.gsma.fullName", roleKey: "sutel.actors.gsma.role", countryKey: "sutel.actors.gsma.country", descKey: "sutel.actors.gsma.desc", websiteKey: "sutel.actors.gsma.website" },
        { nameKey: "sutel.actors.uit.name", fullNameKey: "sutel.actors.uit.fullName", roleKey: "sutel.actors.uit.role", countryKey: "sutel.actors.uit.country", descKey: "sutel.actors.uit.desc", websiteKey: "sutel.actors.uit.website" }
    ]

    // Projects data with translations
    const projects = [
        { titleKey: "sutel.projects.fiber.title", budgetKey: "sutel.projects.fiber.budget", impactKey: "sutel.projects.fiber.impact", icon: Network, statusKey: "sutel.projects.fiber.status" },
        { titleKey: "sutel.projects.financial.title", budgetKey: "sutel.projects.financial.budget", impactKey: "sutel.projects.financial.impact", icon: DollarSign, statusKey: "sutel.projects.financial.status" },
        { titleKey: "sutel.projects.rural.title", budgetKey: "sutel.projects.rural.budget", impactKey: "sutel.projects.rural.impact", icon: MapPin, statusKey: "sutel.projects.rural.status" }
    ]

    // Challenges data with translations
    const challenges = [
        { titleKey: "sutel.challenges.underutilization.title", descKey: "sutel.challenges.underutilization.desc", solutionKey: "sutel.challenges.underutilization.solution" },
        { titleKey: "sutel.challenges.complexity.title", descKey: "sutel.challenges.complexity.desc", solutionKey: "sutel.challenges.complexity.solution" },
        { titleKey: "sutel.challenges.harmonization.title", descKey: "sutel.challenges.harmonization.desc", solutionKey: "sutel.challenges.harmonization.solution" }
    ]

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
                            {t('sutel.hero.title')}
                        </h1>
                        <p className="text-xl text-base !mt-2">
                            {t('sutel.hero.description')}
                        </p>
                    </div>
                </div>

            </div>








            <div className="w-full px-20 min-[1900px]:px-40 lg:px-12 md:px-10 sm:px-6 py-10">
                
                {/* Definition Section */}
                <Card className="mb-12 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
                    <CardContent className="p-8">
                        <div className="flex items-start gap-6">
                            <div className="shrink-0 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <BookOpen className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-4">{t('sutel.definition.title')}</h2>
                                <p className="text-muted-foreground mb-4 leading-relaxed">
                                    {t('sutel.definition.p1')}
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    {t('sutel.definition.p2')}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Financement Info */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <Card className="border-2 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
                        <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-amber-600" />
                            </div>
                            <h3 className="font-bold mb-2">{t('sutel.funding.title')}</h3>
                            <p className="text-sm text-muted-foreground">
                                {t('sutel.funding.description')}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-2 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                        <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="font-bold mb-2">{t('sutel.management.title')}</h3>
                            <p className="text-sm text-muted-foreground">
                                {t('sutel.management.description')}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-2 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                        <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <Target className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="font-bold mb-2">{t('sutel.objectiveCard.title')}</h3>
                            <p className="text-sm text-muted-foreground">
                                {t('sutel.objectiveCard.description')}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Missions Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Target className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold">{t('sutel.missionsSection.title')}</h2>
                            <p className="text-muted-foreground">{t('sutel.missionsSection.subtitle')}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-6">
                        {missions.map((mission, index) => (
                            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 overflow-hidden">
                                <div className={`h-2 bg-gradient-to-r ${mission.color}`} />
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${mission.color} flex items-center justify-center shrink-0`}>
                                            <mission.icon className="h-7 w-7 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                                                {t(mission.titleKey)}
                                            </h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {t(mission.descKey)}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Objectifs List */}
                    <Card className="mt-8 border-2 border-primary/20 bg-primary/5">
                        <CardContent className="p-6">
                            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                                <CheckCircle2 className="h-6 w-6 text-primary" />
                                {t('sutel.missionsSection.specificObjectives')}
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {[
                                    { key: 'sutel.missionsSection.obj1' },
                                    { key: 'sutel.missionsSection.obj2' },
                                    { key: 'sutel.missionsSection.obj3' },
                                    { key: 'sutel.missionsSection.obj4' },
                                    { key: 'sutel.missionsSection.obj5' }
                                ].map((obj, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                                            <CheckCircle2 className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="text-sm">{t(obj.key)}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Acteurs Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold">{t('sutel.actorsSection.title')}</h2>
                            <p className="text-muted-foreground">{t('sutel.actorsSection.subtitle')}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {actors.map((actor, index) => (
                            <Card key={index} className="hover:shadow-lg transition-all duration-300 border-2">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0">
                                            <Building2 className="h-7 w-7 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="font-bold text-lg">{t(actor.nameKey)}</h3>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">{t(actor.fullNameKey)}</p>
                                                </div>
                                                <Badge variant="outline" className="shrink-0 text-xs">
                                                    {t(actor.roleKey)}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-3">{t(actor.descKey)}</p>
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm text-primary">{t(actor.websiteKey)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* SUTEL 2025 Event */}
                    <Card className="mt-8 border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
                                    <Calendar className="h-10 w-10 text-white" />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <Badge className="mb-2 bg-amber-500/20 text-amber-700 border-amber-500/30">
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        {t('sutel.event.badge')}
                                    </Badge>
                                    <h3 className="font-bold text-xl mb-2">{t('sutel.event.title')}</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {t('sutel.event.description')}
                                    </p>
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        <Badge variant="outline">{t('sutel.event.tag1')}</Badge>
                                        <Badge variant="outline">{t('sutel.event.tag2')}</Badge>
                                        <Badge variant="outline">{t('sutel.event.tag3')}</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Projets Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Zap className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold">{t('sutel.projectsSection.title')}</h2>
                            <p className="text-muted-foreground">{t('sutel.projectsSection.subtitle')}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {projects.map((project, index) => (
                            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 overflow-hidden">
                                <div className="h-3 bg-gradient-to-r from-primary to-secondary" />
                                <CardContent className="p-6">
                                    <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <project.icon className="h-7 w-7 text-white" />
                                    </div>
                                    <h3 className="font-bold text-lg text-center mb-3">{t(project.titleKey)}</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between p-2 rounded-lg bg-muted/50">
                                            <span className="text-muted-foreground">{t('sutel.projects.budget')}</span>
                                            <span className="font-medium">{t(project.budgetKey)}</span>
                                        </div>
                                        <div className="flex justify-between p-2 rounded-lg bg-muted/50">
                                            <span className="text-muted-foreground">{t('sutel.projects.impact')}</span>
                                            <span className="font-medium text-xs text-right">{t(project.impactKey)}</span>
                                        </div>
                                    </div>
                                    <Badge className="w-full mt-4 justify-center" variant="outline">
                                        {t(project.statusKey)}
                                    </Badge>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Défis et Perspectives */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">{t('sutel.challengesSection.title')}</h3>
                                <p className="text-sm text-muted-foreground">{t('sutel.challengesSection.subtitle')}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {challenges.map((challenge, i) => (
                                <Card key={i} className="border-l-4 border-l-red-500">
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold mb-1">{t(challenge.titleKey)}</h4>
                                        <p className="text-sm text-muted-foreground mb-2">{t(challenge.descKey)}</p>
                                        <p className="text-xs text-primary font-medium">→ {t(challenge.solutionKey)}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">{t('sutel.perspectivesSection.title')}</h3>
                                <p className="text-sm text-muted-foreground">{t('sutel.perspectivesSection.subtitle')}</p>
                            </div>
                        </div>
                        <Card className="border-2 border-green-500/20 bg-green-500/5 h-full">
                            <CardContent className="p-6">
                                <ul className="space-y-4">
                                    {[
                                        { key: 'sutel.perspectivesSection.p1' },
                                        { key: 'sutel.perspectivesSection.p2' },
                                        { key: 'sutel.perspectivesSection.p3' },
                                        { key: 'sutel.perspectivesSection.p4' },
                                        { key: 'sutel.perspectivesSection.p5' }
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            </div>
                                            <span className="text-sm">{t(item.key)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Ressources Section */}
                <Card className="mb-12 border-2">
                    <CardContent className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{t('sutel.resourcesSection.title')}</h2>
                                <p className="text-muted-foreground">{t('sutel.resourcesSection.subtitle')}</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <a
                                href="https://gsma.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 p-4 rounded-xl border-2 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                                    <FileText className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">{t('sutel.resourcesSection.gsma.title')}</h4>
                                    <p className="text-sm text-muted-foreground">{t('sutel.resourcesSection.gsma.desc')}</p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground ml-auto" />
                            </a>
                            <a
                                href="https://atuuat.africa"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 p-4 rounded-xl border-2 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
                                    <FileText className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">{t('sutel.resourcesSection.uat.title')}</h4>
                                    <p className="text-sm text-muted-foreground">{t('sutel.resourcesSection.uat.desc')}</p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground ml-auto" />
                            </a>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact CTA */}
                <Card className="bg-gradient-to-br from-primary to-secondary text-white border-0">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">{t('sutel.cta.title')}</h2>
                                <p className="text-white/80">
                                    {t('sutel.cta.description')}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                                    <a href="https://ansut.ci" target="_blank" rel="noopener noreferrer">
                                        <Globe className="h-5 w-5 mr-2" />
                                        {t('sutel.cta.projectsButton')}
                                    </a>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                                    <Link to="/contact">
                                        <Mail className="h-5 w-5 mr-2" />
                                        {t('sutel.cta.contactButton')}
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
