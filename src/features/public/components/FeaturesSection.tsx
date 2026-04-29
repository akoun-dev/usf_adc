import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
    FileText,
    MessageSquare,
    Bell,
    Zap,
    MapPin,
    Shield,
    BarChart3,
    Users,
} from "lucide-react"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import { Card, CardContent } from "@/components/ui/card"



/* ------------------------------------------------------------------ */
/*  FEATURES                                                           */
/* ------------------------------------------------------------------ */

export function FeaturesSection() {
    const { ref, isVisible } = useScrollAnimation()
    const { t } = useTranslation()

    // Static feature data with icon mapping (icons remain static, text is translated)
const featureIcons = [
    { icon: Shield, key: "auth", href: "/a-propos" },
    { icon: FileText, key: "fsu", href: null },
    { icon: Map, key: "map", href: "/carte-public" },
    { icon: BarChart3, key: "reports", href: null },
    { icon: Users, key: "collaboration", href: "/forum-public" },
    { icon: Bell, key: "notifications", href: null },
]

    return (
        <section
            id="features"
            className="relative pt-8 pb-10 lg:pt-12 lg:pb-16 bg-background px-20 min-[1900px]:px-40 lg:px-12 md:px-10 sm:px-6 xs:px-4 py-10"
        >
            {/* Bottom transition to About */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-muted/30" />
            <div
                ref={ref}
                className={`w-full transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                        <Zap className="h-4 w-4" />
                        {t("index.featuresSection.badge")}
                    </div>
                    <h2 className="text-3xl font-bold text-foreground lg:text-4xl text-primary mb-4">
                        {t("index.featuresSection.title")}
                    </h2>
                    <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t("index.featuresSection.description")}
                    </p>
                </div>

                {/* Quick Access */}
                <div className="mt-12 grid gap-4 sm:grid-cols-2 xs:grid-cols-1 lg:grid-cols-4">
                    <Link to="/carte-public" className="group">
                        <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                            <CardContent className="p-4 text-center">
                                <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <h3 className="font-semibold text-md">
                                    {t("index.quickAccess.map.title")}
                                </h3>
                                <p className="text-md text-muted-foreground mt-1">
                                    {t("index.quickAccess.map.desc")}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link to="/documents-publics" className="group">
                        <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                            <CardContent className="p-4 text-center">
                                <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <h3 className="font-semibold text-md">
                                    {t("index.quickAccess.documents.title")}
                                </h3>
                                <p className="text-md text-muted-foreground mt-1">
                                    {t("index.quickAccess.documents.desc")}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link to="/forum-public" className="group">
                        <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                            <CardContent className="p-4 text-center">
                                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <h3 className="font-semibold text-md">
                                    {t("index.quickAccess.forum.title")}
                                </h3>
                                <p className="text-md text-muted-foreground mt-1">
                                    {t("index.quickAccess.forum.desc")}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link to="/projets" className="group">
                        <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                            <CardContent className="p-4 text-center">
                                <Bell className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <h3 className="font-semibold text-md">
                                    {t("index.quickAccess.projects.title")}
                                </h3>
                                <p className="text-md text-muted-foreground mt-1">
                                    {t("index.quickAccess.projects.desc")}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </section>
    )
}
