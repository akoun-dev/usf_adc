import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import { Newspaper, ArrowRight, Calendar, Bell, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { usePublicNews } from "@/features/public/hooks/usePublicNews"
import { usePublicEvents } from "@/features/public/hooks/usePublicEvents"
import { MiniCalendar } from "./MiniCalendar"

/* ------------------------------------------------------------------ */
/*  NEWS CAROUSEL                                                      */
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
                    watchDrag: (_emblaApi, event) => {
                        const target = event.target as HTMLElement
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
                <CarouselContent className="-ml-6">
                    {news.map(article => (
                        <CarouselItem
                            key={article.id}
                            className="pl-6 md:basis-1/3 sm:basis-1/2 xs:basis-1/1 lg:basis-1/4"
                        >
                            <Link
                                to={`/actualites/${article.id}`}
                                className="block h-full group hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
                            >
                                <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden h-full">
                                    {article.image_url && (
                                        <div className="relative h-40 sm:h-48 md:h-56 lg:h-60 overflow-hidden">
                                            <img
                                                src={article.image_url}
                                                alt={article.title}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                                            {article.source && (
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
                                                        {formatDateBadge(article.published_at).day}
                                                    </span>
                                                    <span className="text-[9px] uppercase font-medium leading-tight mt-0.5">
                                                        {formatDateBadge(article.published_at).month}
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
                                        <h3 className="font-semibold text-base sm:text-md lg:text-xl mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-sm sm:text-base text-muted-foreground line-clamp-2">
                                            {article.content?.substring(0, 150)}
                                            ...
                                        </p>
                                        <span className="inline-flex items-center gap-1 text-md text-primary opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 mt-2">
                                            {t("index.newsEvents.readMore")}
                                            <ArrowRight className="h-3 w-3" />
                                        </span>
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

/* ------------------------------------------------------------------ */
/*  EVENTS CAROUSEL                                                    */
/* ------------------------------------------------------------------ */

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
        <div className="relative h-full">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                    dragFree: false,
                    watchDrag: (_emblaApi, event) => {
                        const target = event.target as HTMLElement
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
                className="w-full h-full"
            >
                <CarouselContent className="-ml-6 h-full">
                    {events.map(event => (
                        <CarouselItem
                            key={event.id}
                            className="pl-6 md:basis-1/2 lg:basis-1/3 h-full"
                        >
                            <Link
                                to={`/calendrier/${event.id}`}
                                className="block h-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
                            >
                                <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden h-full">
                                    {event.image_url && (
                                        <div className="relative h-32 sm:h-36 md:h-40 lg:h-60 overflow-hidden">
                                            <img
                                                src={event.image_url}
                                                alt={event.title}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                                            {event.event_type && (
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
                                                        {formatDateBadge(event.start_date).day}
                                                    </span>
                                                    <span className="text-[9px] uppercase font-medium leading-tight mt-0.5">
                                                        {formatDateBadge(event.start_date).month}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <h3 className="font-semibold text-base sm:text-lg lg:text-xl mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                            {event.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                            {/*event.start_date && (
                                                <span className="flex items-center gap-1 pointer-events-none">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(event.start_date).toLocaleDateString(
                                                        i18n.language,
                                                        { day: "numeric", month: "short" }
                                                    )}
                                                </span>
                                            )*/}
                                            {event.location && (
                                                <span className="flex items-center gap-1 pointer-events-none">
                                                    <MapPin className="h-3 w-3" />
                                                    <span className="truncate">
                                                        {event.location}
                                                    </span>
                                                </span>
                                            )}
                                        </div>
                                        <span className="inline-flex items-center gap-1 text-md text-primary opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
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

/* ------------------------------------------------------------------ */
/*  NEWS & EVENTS SECTION                                              */
/* ------------------------------------------------------------------ */

export function NewsEventsSection() {
    const { ref, isVisible } = useScrollAnimation()
    const { t } = useTranslation()

    return (
        <section
            id="news"
            className="relative overflow-hidden bg-gradient-to-b from-muted/30 to-background px-20 min-[1900px]:px-40 lg:px-12 md:px-10 sm:px-6 xs:px-0 py-10"
        >
            <div
                ref={ref}
                className="w-full px-4 sm:px-6 lg:px-10 py-10 lg:py-10"
            >
                {/* Header */}
                <div
                    className={`text-center mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                >
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                        <Newspaper className="h-4 w-4" />
                        {t("index.newsEvents.badge")}
                    </div>
                    <h2 className="text-3xl font-bold text-foreground lg:text-4xl text-primary mb-4">
                        {t("index.newsEvents.title")}
                    </h2>
                    <p className="mt-2 sm:mt-3 text-sm xs:text-base sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t("index.newsEvents.description")}
                    </p>
                </div>

            </div>

            {/* Content */}

            <div className="w-full">
            <div
                className={`transition-all duration-700 delay-200 px-4 sm:px-6 lg:px-8 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
                {/* News Carousel */}
                <div className="mb-8 sm:mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                <Newspaper className="h-4 w-4 text-primary" />
                            </div>
                            {t("index.newsEvents.latestNews")}
                        </h3>
                        <Button variant="ghost" size="sm" asChild className="viewMoreClass text-white bg-primary">
                            <Link to="/actualites">
                                {t("index.newsEvents.viewAll")}
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    <div className="relative">
                        <NewsCarousel />
                    </div>
                </div>

                {/* Events Carousel + Calendar */}
                <div className="mb-8 sm:mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/20">
                                <Calendar className="h-4 w-4 text-secondary" />
                            </div>
                            {t("index.newsEvents.upcomingEvents")}
                        </h3>
                        <Button variant="ghost" size="sm" asChild className="viewMoreClass text-white bg-primary">
                            <Link to="/calendrier">
                                {t("index.newsEvents.viewAll")}
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-4 sm:gap-6">
                        <div className="lg:col-span-2 h-[320px] sm:h-[380px] lg:h-[420px]">
                            <EventsCarousel />
                        </div>
                        <div className="h-[320px] sm:h-[380px] lg:h-[420px] overflow-hidden">
                            <MiniCalendar />
                        </div>
                    </div>
                </div>

                {/* CTA Enhanced */}
                <div>
                    <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border-primary/20 overflow-hidden">
                        <div className="absolute bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIwLjAzIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
                        <CardContent className="relative p-4 sm:p-6 lg:p-8 text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                                <Bell className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-3xl sm:text-lg lg:text-4xl font-bold mb-2">
                                {t("index.newsEvents.joinCommunity")}
                            </h3>
                            <p className="text-md text-muted-foreground mb-6 max-w-md mx-auto">
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
</div>

        </section>
    )
}
