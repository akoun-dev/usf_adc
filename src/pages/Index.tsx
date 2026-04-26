import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
    FileText,
    Users,
    BarChart3,
    MessageSquare,
    Bell,
    ArrowRight,
    Wifi,
    ChevronRight,
    Zap,
    Lock,
    TrendingUp,
    Globe,
    Calendar,
    MapPin,
    Shield,
    Map,
} from "lucide-react"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import heroLanding from "@/assets/hero20.png"
import { PublicFooter } from "@/features/public/components/PublicFooter"
import { PublicHeader } from "@/features/public"
import { PartnersLogoScroller } from "@/features/public/components/PartnersLogoScroller"
import { WelcomeSection } from "@/features/public/components/WelcomeSection"
import { AboutSection } from "@/features/public/components/AboutSection"
import { NewsEventsSection } from "@/features/public/components/NewsEventsSection"

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

// Static feature data with icon mapping (icons remain static, text is translated)
const featureIcons = [
    { icon: Shield, key: "auth", href: "/a-propos" },
    { icon: FileText, key: "fsu", href: null },
    { icon: Map, key: "map", href: "/carte-public" },
    { icon: BarChart3, key: "reports", href: null },
    { icon: Users, key: "collaboration", href: "/forum-public" },
    { icon: Bell, key: "notifications", href: null },
]

// Static stats data with icon mapping
const statIcons = [
    { value: "54", key: "countries", icon: Globe },
    { value: "2FA", key: "security", icon: Lock },
    { value: "24/7", key: "availability", icon: Zap },
    { value: "100%", key: "traceability", icon: TrendingUp },
]

// Static roles configuration (colors remain static, text is translated)
const roleConfigs = [
    { key: "public", color: "border-muted-foreground/20", bg: "bg-muted/50" },
    { key: "focal", color: "border-primary/30", bg: "bg-primary/5" },
    { key: "countryAdmin", color: "border-primary/40", bg: "bg-primary/10" },
    { key: "globalAdmin", color: "border-secondary/50", bg: "bg-secondary/10" },
]

/* ------------------------------------------------------------------ */
/*  HERO                                                               */
/* ------------------------------------------------------------------ */

const HeroSection = () => {
    const { t } = useTranslation()

    return (
        <section className=" relative h-[800px] sm:h-[550px] md:h-[650px] lg:h-[700px] xl:h-[800px] 2xl:h-[1000px] flex items-center">
            {/* Background */}
            <div className="absolute inset-0">
                <img
                    src={heroLanding}
                    alt="Connectivité numérique africaine"
                    className="h-full w-full object-cover"
                    width={1920}
                    height={800}
                    decoding="async"
                />
                <div className="absolute top-0 left-0 w-full w-[60%] bg-gradient-to-b from-black/50 via-black/30 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto max-w-6xl px-6 pt-32 pb-20 lg:px-12">
                <div className="max-w-xl space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/90 px-4 py-2 backdrop-blur-md border-2 border-white/30">
                        <Wifi className="h-4 w-4 text-white" />
                        <span className="text-sm font-semibold text-white">
                            {t("index.hero.badge")}
                        </span>
                    </div>

                    <h1 className="text-4xl font-bold leading-tight text-black drop-shadow-2xl sm:text-5xl lg:text-6xl">
                        {t("index.hero.title")}
                        <div className="text-secondary bg-primary/90 pl-5 pr-5 py-2 rounded-md mt-3">
                            {t("index.hero.subtitle")}
                        </div>
                    </h1>

                    <p className="max-w-lg text-lg leading-relaxed text-black italic lg:text-xl">
                        {t("index.hero.description")}
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Button
                            asChild
                            size="lg"
                            className="h-13 px-8 text-base bg-secondary hover:bg-secondary/90 text-gray-900 border-2 border-white/30 shadow-md backdrop-blur-sm font-semibold"
                        >
                            <Link to="/login">
                                {t("index.hero.accessPlatform")}
                                <ArrowRight className="m-4 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="h-13 p-3 text-base bg-white/95 text-primary border-2 border-white/40 hover:bg-white shadow-md backdrop-blur-sm font-semibold"
                        >
                            <a href="#features">
                                {t("index.hero.discover")}
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </a>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                <div className="flex flex-col items-center gap-2 text-white/40">
                    <span className="text-xs">{t("index.hero.scroll")}</span>
                    <div className="h-8 w-5 rounded-full border border-white/30 flex items-start justify-center pt-1">
                        <div className="h-2 w-1 rounded-full bg-white/60 animate-bounce" />
                    </div>
                </div>
            </div>

            {/* Bottom fade transition to next section */}
            {/*<div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-background z-10" />*/}
        </section>
    )
}

/* ------------------------------------------------------------------ */
/*  FEATURES                                                           */
/* ------------------------------------------------------------------ */

const FeaturesSection = () => {
    const { ref, isVisible } = useScrollAnimation()
    const { t } = useTranslation()
    return (
        <section
            id="features"
            className="relative px-6 pt-8 pb-10 lg:pt-12 lg:pb-16 bg-background"
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
                    <h2 className="text-3xl font-bold text-foreground lg:text-4xl">
                        {t("index.featuresSection.title")}
                    </h2>
                    <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t("index.featuresSection.description")}
                    </p>
                </div>

                {/* Quick Access */}
                <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Link to="/carte-public" className="group">
                        <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                            <CardContent className="p-4 text-center">
                                <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <h4 className="font-semibold text-sm">
                                    {t("index.quickAccess.map.title")}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {t("index.quickAccess.map.desc")}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link to="/documents-publics" className="group">
                        <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                            <CardContent className="p-4 text-center">
                                <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <h4 className="font-semibold text-sm">
                                    {t("index.quickAccess.documents.title")}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {t("index.quickAccess.documents.desc")}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link to="/forum-public" className="group">
                        <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                            <CardContent className="p-4 text-center">
                                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <h4 className="font-semibold text-sm">
                                    {t("index.quickAccess.forum.title")}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {t("index.quickAccess.forum.desc")}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link to="/projets" className="group">
                        <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                            <CardContent className="p-4 text-center">
                                <Bell className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <h4 className="font-semibold text-sm">
                                    {t("index.quickAccess.projects.title")}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
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


/* ------------------------------------------------------------------ */
/*  ROLES                                                              */
/* ------------------------------------------------------------------ */

const RolesSection = () => {
    const { ref, isVisible } = useScrollAnimation()
    const { t } = useTranslation()
    return (
        <section className="relative px-6 py-10 lg:py-20 bg-background">
            {/* Bottom transition to CTA */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-primary/10" />
            <div
                ref={ref}
                className={`w-full text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                    <Users className="h-4 w-4" />
                    {t("index.rolesSection.badge")}
                </div>
                <h2 className="text-3xl font-bold text-foreground lg:text-4xl">
                    {t("index.rolesSection.title")}
                </h2>
                <p className="mt-3 mb-12 text-lg text-muted-foreground">
                    {t("index.rolesSection.description")}
                </p>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {roleConfigs.map((r, i) => (
                        <div
                            key={r.key}
                            className={`group rounded-xl border ${r.color} ${r.bg} p-6 text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-md ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                            style={{ transitionDelay: `${i * 120}ms` }}
                        >
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-card shadow-sm">
                                <span className="text-lg font-bold text-primary">
                                    {i + 1}
                                </span>
                            </div>
                            <h3 className="mb-2 font-semibold text-foreground">
                                {t(`index.roles.${r.key}.label`)}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {t(`index.roles.${r.key}.desc`)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

/* ------------------------------------------------------------------ */
/*  CTA                                                                */
/* ------------------------------------------------------------------ */

const CtaSection = () => {
    const { ref, isVisible } = useScrollAnimation()
    const { t } = useTranslation()
    return (
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 gradient-hero" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div
                ref={ref}
                className={`relative z-10 w-full px-6 py-20 text-center lg:py-20 transition-all duration-700 ${isVisible ? "opacity-100 scale-100" : "opacity-100 scale-95"}`}
            >
                <h2 className="text-3xl font-bold text-white lg:text-4xl">
                    {t("index.cta.title")}
                </h2>
                <p className="mt-4 text-lg text-white/75 max-w-2xl mx-auto">
                    {t("index.cta.description")}
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="h-13 px-8 text-base bg-white/10 text-white border-white/20 hover:bg-white/20"
                    >
                        <Link to="/login">{t("index.cta.login")}</Link>
                    </Button>
                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="h-13 px-8 text-base bg-white/10 text-white border-white/20 hover:bg-white/20"
                    >
                        <a href="mailto:contact@atuuat.africa">
                            {t("index.cta.contact")}
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    )
}



/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

const Index = () => (
    <div className="min-h-screen bg-background sarus">
        <PublicHeader variant="transparent" />
        <HeroSection />
        <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 bg-white/30">
                <WelcomeSection />
            </div>
            <div className="w-full lg:w-1/2 bg-muted/30">
                <AboutSection />
            </div>
        </div>
        <NewsEventsSection />
        <FeaturesSection />
        <PartnersLogoScroller />
        <PublicFooter />
    </div>
)

export default Index
