import React, { lazy, Suspense, useState, useMemo, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
    Shield,
    FileText,
    Map,
    Users,
    BarChart3,
    MessageSquare,
    Bell,
    ArrowRight,
    CheckCircle,
    Wifi,
    ChevronRight,
    ChevronDown,
    Zap,
    Lock,
    TrendingUp,
    Globe,
    Menu,
    X,
    BookOpen,
    Calendar,
    Newspaper,
    Clock,
    MapPin,
    ChevronLeft,
    LogOut,
    User,
} from "lucide-react"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LanguageSwitcher } from "@/features/shell/components/LanguageSwitcher"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Autoplay from "embla-carousel-autoplay"
import heroLanding from "@/assets/hero10.png"
import sectionCollab from "@/assets/section-collaboration.jpg"
import atuLogo from "@/assets/atu-uat-logo.png"
import { usePublicNews } from "@/features/public/hooks/usePublicNews"
import { usePublicEvents } from "@/features/public/hooks/usePublicEvents"
import { PublicFooter } from "@/features/public/components/PublicFooter"
import { PublicHeader } from "@/features/public"
import { MiniCalendar } from "@/features/public/components/MiniCalendar"
import { PartnersLogoScroller } from "@/features/public/components/PartnersLogoScroller"

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
    const navigate = useNavigate()
    const { isAuthenticated, profile, signOut, user } = useAuth()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)


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
                <div className="max-w-2xl space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/90 px-4 py-2 backdrop-blur-md border-2 border-white/30 shadow-lg">
                        <Wifi className="h-4 w-4 text-white" />
                        <span className="text-sm font-semibold text-white">
                            {t("index.hero.badge")}
                        </span>
                    </div>

                    <h1 className="text-4xl font-bold leading-tight text-white drop-shadow-2xl sm:text-5xl lg:text-6xl">
                        {t("index.hero.title")}
                        <br />
                        <span className="text-secondary drop-shadow-xl">
                            {t("index.hero.subtitle")}
                        </span>
                    </h1>

                    <p className="max-w-lg text-lg leading-relaxed text-white drop-shadow-lg lg:text-xl">
                        {t("index.hero.description")}
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Button
                            asChild
                            size="lg"
                            className="h-13 px-8 text-base bg-secondary hover:bg-secondary/90 text-gray-900 border-2 border-white/30 shadow-xl backdrop-blur-sm font-semibold"
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
                            className="h-13 p-3 text-base bg-white/95 text-primary border-2 border-white/40 hover:bg-white shadow-xl backdrop-blur-sm font-semibold"
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
                className={`container mx-auto max-w-6xl transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
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
/*  NEWS & EVENTS - CAROUSELS (CORRIGÉS)                               */
/* ------------------------------------------------------------------ */

const NewsCarousel = () => {
    const { t, i18n } = useTranslation()
    const { data: news, isLoading } = usePublicNews()

    const formatDateBadge = (dateString: string) => {
        const date = new Date(dateString)
        return {
            day: date.getDate(),
            month: date.toLocaleDateString(i18n.language, { month: "short" }),
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div
                        key={i}
                        className="rounded-xl border border-border bg-card/50 p-5 animate-pulse"
                    >
                        <div className="flex gap-4">
                            <div className="h-14 w-14 rounded-lg bg-muted" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-24 rounded bg-muted" />
                                <div className="h-5 w-3/4 rounded bg-muted" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (!news || news.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                        <Newspaper className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {t("index.newsEvents.noNews")}
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="relative">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                    // ✅ CORRECTION : watchDrag amélioré pour permettre les clics sur les éléments interactifs
                    watchDrag: (_emblaApi, event) => {
                        const target = event.target as HTMLElement
                        // Autoriser le drag seulement si on ne clique pas sur un élément interactif
                        return !target.closest(
                            "a, button, [role='button'], input, textarea, [data-no-drag]"
                        )
                    },
                }}
                plugins={[
                    Autoplay({
                        delay: 4000,
                        stopOnInteraction: true,
                        stopOnMouseEnter: true,
                    }),
                ]}
                className="w-full"
            >
                <CarouselContent>
                    {news.map(article => (
                        <CarouselItem
                            key={article.id}
                            className="md:basis-1/2 lg:basis-1/3"
                        >
                            {/* ✅ CORRECTION : Link avec h-full et block pour couvrir toute la carte */}
                            <Link
                                to={`/actualites/${article.id}`}
                                className="block h-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
                            >
                                <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden h-full">
                                    {article.image_url && (
                                        <div className="relative h-40 overflow-hidden">
                                            <img
                                                src={article.image_url}
                                                alt={article.title}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                            {/* ✅ CORRECTION : pointer-events-none sur l'overlay décoratif */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                                            {article.source && (
                                                // ✅ CORRECTION : pointer-events-none sur le badge décoratif
                                                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground pointer-events-none">
                                                    {article.source}
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                    <CardContent className="p-4">
                                        {article.published_at && (
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary h-10 w-10 pointer-events-none">
                                                    <span className="text-sm font-bold leading-none">
                                                        {
                                                            formatDateBadge(
                                                                article.published_at
                                                            ).day
                                                        }
                                                    </span>
                                                    <span className="text-[9px] uppercase font-medium leading-tight mt-0.5">
                                                        {
                                                            formatDateBadge(
                                                                article.published_at
                                                            ).month
                                                        }
                                                    </span>
                                                </div>
                                                {article.category && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs pointer-events-none"
                                                    >
                                                        {article.category}
                                                    </Badge>
                                                )}
                                            </div>
                                        )}
                                        <h4 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                            {article.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {article.excerpt ||
                                                article.content?.substring(
                                                    0,
                                                    80
                                                )}
                                            ...
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-12" />
                <CarouselNext className="hidden md:flex -right-12" />
            </Carousel>
        </div>
    )
}

const EventsCarousel = () => {
    const { t, i18n } = useTranslation()
    const { data: events, isLoading } = usePublicEvents()

    const formatDateBadge = (dateString: string) => {
        const date = new Date(dateString)
        return {
            day: date.getDate(),
            month: date.toLocaleDateString(i18n.language, { month: "short" }),
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div
                        key={i}
                        className="rounded-xl border border-border bg-card/50 p-5 animate-pulse"
                    >
                        <div className="flex gap-4">
                            <div className="h-14 w-14 rounded-lg bg-muted" />
                            <div className="flex-1 space-y-2">
                                <div className="h-5 w-3/4 rounded bg-muted" />
                                <div className="h-3 w-1/2 rounded bg-muted" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (!events || events.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                        <Calendar className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {t("index.newsEvents.noEvents")}
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="relative">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                    dragFree: false,
                    // ✅ CORRECTION : watchDrag amélioré pour permettre les clics sur les éléments interactifs
                    watchDrag: (_emblaApi, event) => {
                        const target = event.target as HTMLElement
                        // Autoriser le drag seulement si on ne clique pas sur un élément interactif
                        return !target.closest(
                            "a, button, [role='button'], input, textarea, [data-no-drag]"
                        )
                    },
                }}
                plugins={[
                    Autoplay({
                        delay: 4000,
                        stopOnInteraction: true,
                        stopOnMouseEnter: true,
                    }),
                ]}
                className="w-full"
            >
                <CarouselContent>
                    {events.map(event => (
                        <CarouselItem
                            key={event.id}
                            className="md:basis-1/2"
                        >
                            {/* ✅ CORRECTION : Link avec h-full et block pour couvrir toute la carte */}
                            <Link
                                to={`/calendrier/${event.id}`}
                                className="block h-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
                            >
                                <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden h-full">
                                    {event.image_url && (
                                        <div className="relative h-40 overflow-hidden">
                                            <img
                                                src={event.image_url}
                                                alt={event.title}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                            {/* ✅ CORRECTION : pointer-events-none sur l'overlay décoratif */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                                            {event.event_type && (
                                                // ✅ CORRECTION : pointer-events-none sur le badge décoratif
                                                <Badge className="absolute top-3 left-3 bg-secondary text-gray-900 text-xs pointer-events-none">
                                                    {event.event_type}
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                    <CardContent className="p-4">
                                        {event.start_date && (
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex shrink-0 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-secondary to-secondary/70 text-gray-900 h-10 w-10 shadow-sm pointer-events-none">
                                                    <span className="text-sm font-bold leading-none">
                                                        {
                                                            formatDateBadge(
                                                                event.start_date
                                                            ).day
                                                        }
                                                    </span>
                                                    <span className="text-[9px] uppercase font-medium leading-tight mt-0.5">
                                                        {
                                                            formatDateBadge(
                                                                event.start_date
                                                            ).month
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <h4 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                            {event.title}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                            {event.start_date && (
                                                <span className="flex items-center gap-1 pointer-events-none">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(
                                                        event.start_date
                                                    ).toLocaleDateString(
                                                        i18n.language,
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                        }
                                                    )}
                                                </span>
                                            )}
                                            {event.location && (
                                                <span className="flex items-center gap-1 pointer-events-none">
                                                    <MapPin className="h-3 w-3" />
                                                    <span className="truncate">
                                                        {event.location}
                                                    </span>
                                                </span>
                                            )}
                                        </div>
                                        <span className="inline-flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            {t("index.newsEvents.register")}
                                            <ArrowRight className="h-3 w-3" />
                                        </span>
                                    </CardContent>
                                </Card>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-4" />
                <CarouselNext className="hidden md:flex -right-4" />
            </Carousel>
        </div>
    )
}

const NewsEventsSection = () => {
    const { ref, isVisible } = useScrollAnimation()
    const { t } = useTranslation()

    return (
        <section
            id="news"
            className="relative px-6 py-10 lg:py-20 bg-gradient-to-b from-muted/30 to-background"
        >
            <div
                ref={ref}
                className={`container mx-auto max-w-6xl transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                        <Newspaper className="h-4 w-4" />
                        {t("index.newsEvents.badge")}
                    </div>
                    <h2 className="text-3xl font-bold text-foreground lg:text-4xl">
                        {t("index.newsEvents.title")}
                    </h2>
                    <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t("index.newsEvents.description")}
                    </p>
                </div>

                {/* News Carousel */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                <Newspaper className="h-4 w-4 text-primary" />
                            </div>
                            {t("index.newsEvents.latestNews")}
                        </h3>
                        <Link
                            to="/actualites"
                            className="inline-flex items-center"
                        >
                            <Button variant="ghost" size="sm">
                                {t("index.newsEvents.viewAll")}
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                    <NewsCarousel />
                </div>

                {/* Events Carousel + Calendar */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/20">
                                <Calendar className="h-4 w-4 text-secondary" />
                            </div>
                            {t("index.newsEvents.upcomingEvents")}
                        </h3>
                        <Link
                            to="/calendrier"
                            className="inline-flex items-center"
                        >
                            <Button variant="ghost" size="sm">
                                {t("index.newsEvents.viewAll")}
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Colonne 1 : Carousel (2/3) */}
                        <div className="lg:col-span-2">
                            <EventsCarousel />
                        </div>

                        {/* Colonne 2 : Mini Calendrier (1/3) */}
                        <div>
                            <MiniCalendar />
                        </div>
                    </div>
                </div>

                {/* CTA Enhanced */}
                <div>
                    <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border-primary/20 overflow-hidden">
                        <div className="absolute bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIwLjAzIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
                        <CardContent className="relative p-8 text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                                <Bell className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                {t("index.newsEvents.joinCommunity")}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                                {t("index.newsEvents.joinCommunityDesc")}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button asChild>
                                    <Link to="/actualites">
                                        <Newspaper className="mr-2 h-4 w-4" />
                                        {t("index.newsEvents.viewNews")}
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link to="/calendrier">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {t("index.newsEvents.calendar")}
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

/* ------------------------------------------------------------------ */
/*  ABOUT / COLLABORATION                                             */
/* ------------------------------------------------------------------ */

const AboutSection = () => {
    const { ref, isVisible } = useScrollAnimation()
    const { t } = useTranslation()
    const [currentIndex, setCurrentIndex] = useState(0)

    const carouselItems = [
        {
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop",
            titleKey: "index.about.carousel.universal.title",
            descKey: "index.about.carousel.universal.desc",
            icon: <Globe className="h-8 w-8" />,
        },
        {
            image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop",
            titleKey: "index.about.carousel.dashboard.title",
            descKey: "index.about.carousel.dashboard.desc",
            icon: <BarChart3 className="h-8 w-8" />,
        },
        {
            image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=800&fit=crop",
            titleKey: "index.about.carousel.collaboration.title",
            descKey: "index.about.carousel.collaboration.desc",
            icon: <Users className="h-8 w-8" />,
        },
        {
            image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=800&fit=crop",
            titleKey: "index.about.carousel.innovation.title",
            descKey: "index.about.carousel.innovation.desc",
            icon: <Zap className="h-8 w-8" />,
        },
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % carouselItems.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [carouselItems.length])

    return (
        <section id="about" className="relative overflow-hidden bg-muted/30">
            {/* Bottom transition to Roles */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-background" />
            <div
                ref={ref}
                className="container mx-auto max-w-6xl px-6 py-10 lg:py-20"
            >
                {/* Header */}
                <div
                    className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                >
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                        <Globe className="h-4 w-4" />
                        {t("index.about.badge")}
                    </div>
                    <h2 className="text-3xl font-bold text-foreground lg:text-4xl mb-4">
                        {t("index.about.title")}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {t("index.about.description")}
                    </p>
                </div>

                {/* Fade Carousel */}
                <div
                    className={`transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                >
                    <div className="relative">
                        {carouselItems.map((item, index) => (
                            <div
                                key={index}
                                className={`transition-opacity duration-1000 ${
                                    index === currentIndex
                                        ? "opacity-100"
                                        : "opacity-0 absolute inset-0 pointer-events-none"
                                }`}
                            >
                                <Card className="border-0 overflow-hidden shadow-2xl">
                                    <CardContent className="p-0">
                                        <div className="grid lg:grid-cols-2">
                                            {/* Image */}
                                            <div className="relative h-96 lg:h-[600px]">
                                                <img
                                                    src={item.image}
                                                    alt={t(item.titleKey)}
                                                    className="h-full w-full object-cover"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
                                            </div>

                                            {/* Text */}
                                            <div className="p-12 lg:p-20 flex flex-col justify-center bg-background">
                                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl bg-primary/10 text-primary mb-10">
                                                    {item.icon}
                                                </div>
                                                <h3 className="text-4xl font-bold text-foreground mb-8">
                                                    {t(item.titleKey)}
                                                </h3>
                                                <p className="text-xl text-muted-foreground leading-relaxed mb-10">
                                                    {t(item.descKey)}
                                                </p>
                                                <Button
                                                    asChild
                                                    size="lg"
                                                    variant="outline"
                                                    className="w-fit text-lg px-8 py-6"
                                                >
                                                    <Link to="/a-propos">
                                                        {t(
                                                            "index.about.learnMore"
                                                        )}
                                                        <ArrowRight className="ml-2 h-5 w-5" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}

                        {/* Dots indicators */}
                        <div className="flex justify-center gap-3 mt-8">
                            {carouselItems.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-3 rounded-full transition-all duration-300 ${
                                        index === currentIndex
                                            ? "w-12 bg-primary"
                                            : "w-3 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
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
                className={`container mx-auto max-w-5xl text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
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
                className={`relative z-10 container mx-auto max-w-4xl px-6 py-20 text-center lg:py-20 transition-all duration-700 ${isVisible ? "opacity-100 scale-100" : "opacity-100 scale-95"}`}
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
        <AboutSection />
        <NewsEventsSection />
        <FeaturesSection />
        <PartnersLogoScroller />
        <PublicFooter />
    </div>
)

export default Index
