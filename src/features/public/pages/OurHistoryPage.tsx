import { useTranslation } from "react-i18next"
import { PublicLayout } from "../components/PublicLayout"
import PageHero from "@/components/PageHero"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Target, Globe, Play, Award, TrendingUp, Building2 } from "lucide-react"
import atuLogo from "@/assets/atu-uat-logo.png"
import bgHeader from '@/assets/bg-header.jpg'





const timelineEvents = [
    {
        year: "ourHistory.timeline.1977.year",
        icon: Calendar,
        color: "from-blue-500 to-cyan-500",
        title: "ourHistory.timeline.1977.title",
        description: "ourHistory.timeline.1977.description"
    },
    {
        year: "ourHistory.timeline.1999.year",
        icon: Target,
        color: "from-green-500 to-emerald-500",
        title: "ourHistory.timeline.1999.title",
        description: "ourHistory.timeline.1999.description"
    },
    {
        year: "ourHistory.timeline.today.year",
        icon: Users,
        color: "from-purple-500 to-pink-500",
        title: "ourHistory.timeline.today.title",
        description: "ourHistory.timeline.today.description"
    }
]

const keyFigures = [
    {
        icon: Users,
        value: "ourHistory.keyFigures.memberStates.value",
        label: "ourHistory.keyFigures.memberStates.label",
        description: "ourHistory.keyFigures.memberStates.description"
    },
    {
        icon: Building2,
        value: "ourHistory.keyFigures.associateMembers.value",
        label: "ourHistory.keyFigures.associateMembers.label",
        description: "ourHistory.keyFigures.associateMembers.description"
    },
    {
        icon: Globe,
        value: "ourHistory.keyFigures.foundingYear.value",
        label: "ourHistory.keyFigures.foundingYear.label",
        description: "ourHistory.keyFigures.foundingYear.description"
    },
    {
        icon: TrendingUp,
        value: "ourHistory.keyFigures.transformation.value",
        label: "ourHistory.keyFigures.transformation.label",
        description: "ourHistory.keyFigures.transformation.description"
    }
]

const whatWeDo = [
    {
        icon: Globe,
        title: "ourHistory.whatWeDo.ticExchange.title",
        description: "ourHistory.whatWeDo.ticExchange.description"
    },
    {
        icon: Building2,
        title: "ourHistory.whatWeDo.internationalRepresentation.title",
        description: "ourHistory.whatWeDo.internationalRepresentation.description"
    },
    {
        icon: TrendingUp,
        title: "ourHistory.whatWeDo.sustainableDevelopment.title",
        description: "ourHistory.whatWeDo.sustainableDevelopment.description"
    }
]

export default function OurHistoryPage() {
    const { t } = useTranslation('public')

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
                            {t("ourHistory.hero.title")}
                        </h1>
                        <p className="text-xl text-base !mt-2">
                            {t("ourHistory.hero.description")}
                        </p>
                    </div>
                </div>

            </div>






            <div className="w-full px-20 min-[1900px]:px-40 lg:px-12 md:px-10 sm:px-6 py-10">

                {/* Hero with Logo */}
                <div className="mb-12">
                    <Card className="bg-gradient-to-br from-primary to-secondary text-white dark:from-primary/80 dark:to-secondary/80 border-0 overflow-hidden">
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="w-32 h-32 rounded-xl bg-white dark:bg-card flex items-center justify-center shrink-0 shadow-lg">
                                    <img
                                        src={atuLogo}
                                        alt="ATU-UAT Logo"
                                        className="w-24 h-24"
                                    />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-3xl font-bold mb-3">{t("ourHistory.header.title")}</h2>
                                    <p className="text-white/90 dark:text-white/80 text-lg mb-2">
                                        {t("ourHistory.header.founded")}
                                    </p>
                                    <p className="text-white/80 dark:text-white/70">
                                        {t("ourHistory.header.description")}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Key Figures */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {keyFigures.map((figure, index) => {
                        const Icon = figure.icon
                        return (
                            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-2 bg-card dark:bg-card/95">
                                <CardContent className="p-6">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-3">
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <p className="text-3xl font-bold text-primary mb-1">{t(figure.value)}</p>
                                    <p className="font-semibold text-sm mb-1 text-foreground">{t(figure.label)}</p>
                                    <p className="text-xs text-muted-foreground">{t(figure.description)}</p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Video Section */}
                <div className="mb-12">
                    <Card className="border-2 overflow-hidden bg-card dark:bg-card/95">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                    <Play className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">{t("ourHistory.video.title")}</h2>
                                    <p className="text-muted-foreground">{t("ourHistory.video.description")}</p>
                                </div>
                            </div>
                            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/C1Lh0zz3l_o?start=3"
                                    title="ATU-UAT Presentation"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Mission & Vision */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/10 dark:to-primary/5 border-2 border-primary/20 hover:shadow-lg transition-all bg-card dark:bg-card/80">
                        <CardContent className="p-8">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/20 dark:bg-primary/10 flex items-center justify-center shrink-0">
                                    <Target className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold mb-3 text-foreground">{t("ourHistory.mission.title")}</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {t("ourHistory.mission.description")}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 dark:from-secondary/10 dark:to-secondary/5 border-2 border-secondary/20 hover:shadow-lg transition-all bg-card dark:bg-card/80">
                        <CardContent className="p-8">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-secondary/20 dark:bg-secondary/10 flex items-center justify-center shrink-0">
                                    <Award className="h-6 w-6 text-secondary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold mb-3 text-foreground">{t("ourHistory.vision.title")}</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {t("ourHistory.vision.description")}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Brief History */}
                <div className="mb-12">
                    <Card className="border-2 bg-card dark:bg-card/95">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/10 flex items-center justify-center">
                                    <Calendar className="h-6 w-6 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground">{t("ourHistory.briefHistory.title")}</h2>
                            </div>
                            <div className="space-y-6">
                                <div className="pl-4 border-l-4 border-primary">
                                    <p className="text-muted-foreground leading-relaxed">
                                        {t("ourHistory.briefHistory.1977")}
                                    </p>
                                </div>
                                <div className="pl-4 border-l-4 border-secondary">
                                    <p className="text-muted-foreground leading-relaxed">
                                        {t("ourHistory.briefHistory.1999")}
                                    </p>
                                </div>
                                <div className="pl-4 border-l-4 border-primary/50">
                                    <p className="text-muted-foreground leading-relaxed">
                                        {t("ourHistory.briefHistory.today")}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* What We Do */}
                <div className="mb-12">
                    <Card className="bg-gradient-to-br from-muted to-muted/50 dark:from-muted/20 dark:to-muted/10 border-2 bg-card dark:bg-card/80">
                        <CardContent className="p-8">
                            <h2 className="text-2xl font-bold mb-6 text-center text-foreground">{t("ourHistory.whatWeDo.title")}</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                {whatWeDo.map((item, index) => {
                                    const Icon = item.icon
                                    return (
                                        <div key={index} className="text-center">
                                            <div className={`w-16 h-16 rounded-full ${index % 2 === 0 ? 'bg-primary/10 dark:bg-primary/10' : 'bg-secondary/10 dark:bg-secondary/10'} flex items-center justify-center mx-auto mb-4`}>
                                                <Icon className={`h-8 w-8 ${index % 2 === 0 ? 'text-primary' : 'text-secondary'}`} />
                                            </div>
                                            <h3 className="font-bold mb-2 text-foreground">{t(item.title)}</h3>
                                            <p className="text-sm text-muted-foreground">{t(item.description)}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Timeline */}
                <div className="mb-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-foreground">{t("ourHistory.timelineSection.title")}</h2>
                        <p className="text-muted-foreground text-lg">{t("ourHistory.timelineSection.description")}</p>
                    </div>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-primary transform -translate-x-1/2 rounded-full"></div>

                        <div className="space-y-12">
                            {timelineEvents.map((event, index) => {
                                const Icon = event.icon
                                const isLeft = index % 2 === 0

                                return (
                                    <div
                                        key={index}
                                        className={`relative flex items-center ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} gap-6`}
                                    >
                                        {/* Content */}
                                        <div className={`flex-1 ${isLeft ? "md:text-right md:pr-12" : "md:text-left md:pl-12"}`}>
                                            <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card dark:bg-card/95">
                                                <CardContent className="p-6">
                                                    <Badge className={`mb-4 text-sm px-4 py-1 bg-gradient-to-r ${event.color} text-white`}>
                                                        {t(event.year)}
                                                    </Badge>
                                                    <h3 className="text-xl font-bold mb-3 text-foreground">{t(event.title)}</h3>
                                                    <p className="text-muted-foreground">{t(event.description)}</p>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Icon */}
                                        <div className="hidden md:flex w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary items-center justify-center shadow-lg z-10 ring-4 ring-white dark:ring-background">
                                            <Icon className="h-8 w-8 text-white" />
                                        </div>

                                        {/* Empty spacer for alignment */}
                                        <div className="hidden md:flex-1 md:block"></div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
}
