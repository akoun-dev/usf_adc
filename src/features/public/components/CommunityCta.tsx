import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { Bell, Newspaper, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"

export function CommunityCta() {
    const { t } = useTranslation()
    const { ref, isVisible } = useScrollAnimation(0.05)

    return (
        <section
            ref={ref}
            className={`w-full py-12 px-4 sm:px-6 lg:px-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
        >
            <div className="max-w-7xl mx-auto">
                <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border-primary/20 overflow-hidden shadow-xl">
                    <div className="absolute bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIwLjAzIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
                    <CardContent className="relative p-8 sm:p-12 text-center">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 ring-8 ring-primary/5">
                            <Bell className="h-8 w-8 text-primary animate-pulse" />
                        </div>
                        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                            {t("index.newsEvents.joinCommunity")}
                        </h3>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                            {t("index.newsEvents.joinCommunityDesc")}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="h-14 px-8 text-lg font-semibold" asChild>
                                <Link to="/actualites">
                                    <Newspaper className="mr-2 h-5 w-5" />
                                    {t("index.newsEvents.viewNews")}
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold bg-white/50 backdrop-blur-sm" asChild>
                                <Link to="/calendrier">
                                    <Calendar className="mr-2 h-5 w-5" />
                                    {t("index.newsEvents.calendar")}
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
