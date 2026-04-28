import { useTranslation } from "react-i18next"
import {
    Shield,
    BookOpen,
    Globe,
    Target,
    FileText,
    ChevronRight,
    Scale,
    Landmark,
    Users,
    Wifi,
    TrendingUp,
    Lightbulb,
    CheckCircle2,
    ArrowRight,
} from "lucide-react"
import { PublicLayout } from "../components/PublicLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import PageHero from "@/components/PageHero"
import bgHeader from '@/assets/bg-header.jpg'


export default function StrategiesPolitiquesPage() {
    const { t } = useTranslation('public')

    const strategies = [
        {
            icon: Globe,
            titleKey: "strategies.items.digitalTransformation.title",
            descKey: "strategies.items.digitalTransformation.desc",
            color: "from-blue-500 to-cyan-500",
        },
        {
            icon: Wifi,
            titleKey: "strategies.items.connectivity.title",
            descKey: "strategies.items.connectivity.desc",
            color: "from-green-500 to-emerald-500",
        },
        {
            icon: Scale,
            titleKey: "strategies.items.regulatoryFramework.title",
            descKey: "strategies.items.regulatoryFramework.desc",
            color: "from-purple-500 to-pink-500",
        },
        {
            icon: Users,
            titleKey: "strategies.items.inclusion.title",
            descKey: "strategies.items.inclusion.desc",
            color: "from-amber-500 to-orange-500",
        },
        {
            icon: TrendingUp,
            titleKey: "strategies.items.economicGrowth.title",
            descKey: "strategies.items.economicGrowth.desc",
            color: "from-red-500 to-rose-500",
        },
        {
            icon: Lightbulb,
            titleKey: "strategies.items.innovation.title",
            descKey: "strategies.items.innovation.desc",
            color: "from-indigo-500 to-violet-500",
        },
    ]

    const policyDocuments = [
        {
            titleKey: "strategies.documents.digitalAgenda.title",
            descKey: "strategies.documents.digitalAgenda.desc",
            yearKey: "strategies.documents.digitalAgenda.year",
            icon: FileText,
        },
        {
            titleKey: "strategies.documents.universalService.title",
            descKey: "strategies.documents.universalService.desc",
            yearKey: "strategies.documents.universalService.year",
            icon: Shield,
        },
        {
            titleKey: "strategies.documents.spectrumPolicy.title",
            descKey: "strategies.documents.spectrumPolicy.desc",
            yearKey: "strategies.documents.spectrumPolicy.year",
            icon: Target,
        },
        {
            titleKey: "strategies.documents.cyberSecurity.title",
            descKey: "strategies.documents.cyberSecurity.desc",
            yearKey: "strategies.documents.cyberSecurity.year",
            icon: Landmark,
        },
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
                            {t("strategies.hero.title")}
                        </h1>
                        <p className="text-xl text-base !mt-2">
                            {t("strategies.hero.description")}
                        </p>
                    </div>
                </div>

            </div>


            <div className="space-y-12 w-full px-20 min-[1900px]:px-40 lg:px-12 md:px-10 sm:px-6 py-10">


                {/* Introduction */}
                <div className="py-10">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                {t("strategies.intro.title")}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                                {t("strategies.intro.description")}
                            </p>
                            <div className="flex items-center gap-2 text-primary">
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="font-medium">{t("strategies.intro.highlight")}</span>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                        <Target className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{t("strategies.intro.vision")}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                        <Globe className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{t("strategies.intro.scope")}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                        <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{t("strategies.intro.beneficiaries")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Strategies Grid */}
                <div className="py-10">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                            {t("strategies.section.title")}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            {t("strategies.section.description")}
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {strategies.map((strategy, index) => (
                            <Card
                                key={index}
                                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden"
                            >
                                <div className={`h-2 bg-gradient-to-r ${strategy.color}`} />
                                <CardContent className="p-6">
                                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${strategy.color} text-white mb-4`}>
                                        <strategy.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                        {t(strategy.titleKey)}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {t(strategy.descKey)}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Policy Documents */}
                <div className="py-10">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                            {t("strategies.documents.title")}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            {t("strategies.documents.description")}
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {policyDocuments.map((doc, index) => (
                            <Card
                                key={index}
                                className="group hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
                            >
                                <CardContent className="p-6 flex gap-4">
                                    <div className="h-12 w-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <doc.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline" className="text-xs">
                                                {t(doc.yearKey)}
                                            </Badge>
                                        </div>
                                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                                            {t(doc.titleKey)}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {t(doc.descKey)}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="py-10">
                    <Card className="bg-gradient-to-r from-primary to-primary/50 border-0 overflow-hidden">
                        <CardContent className="p-8 sm:p-12 text-center">
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                                {t("strategies.cta.title")}
                            </h2>
                            <p className="text-white/90 max-w-2xl mx-auto mb-6">
                                {t("strategies.cta.description")}
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Button
                                    size="lg"
                                    className="bg-secondary text-black hover:text-primary hover:bg-white/90 font-semibold"
                                    asChild
                                >
                                    <a href="/documents-publics">
                                        {t("strategies.cta.documents")}
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </a>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="bg-white text-primary hover:bg-white/90 font-semibold"
                                    asChild
                                >
                                    <a href="/forum-public">
                                        {t("strategies.cta.forum")}
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PublicLayout>
    )
}
