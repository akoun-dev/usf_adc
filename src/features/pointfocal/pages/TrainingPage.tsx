import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, BookMarked, Globe, Users } from "lucide-react"

export default function TrainingPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">{t("nav.sectionTraining")}</h1>
                <p className="text-muted-foreground">
                    {t("training.desc", "Formation et ressources")}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = "/point-focal/training/webinars"}>
                    <CardHeader>
                        <Video className="h-8 w-8 mb-2 text-primary" />
                        <CardTitle>{t("nav.webinars")}</CardTitle>
                        <CardDescription>
                            {t("training.webinarsDesc", "Webinaires à venir et passés")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            {t("training.webinarsAvailable", "webinaires disponibles")}
                        </p>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = "/point-focal/training/elearning"}>
                    <CardHeader>
                        <BookMarked className="h-8 w-8 mb-2 text-primary" />
                        <CardTitle>{t("nav.elearning")}</CardTitle>
                        <CardDescription>
                            {t("training.elearningDesc", "Cours en ligne et ressources")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            {t("training.coursesAvailable", "cours disponibles")}
                        </p>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = "/feeds"}>
                    <CardHeader>
                        <Globe className="h-8 w-8 mb-2 text-primary" />
                        <CardTitle>{t("nav.strategicWatch")}</CardTitle>
                        <CardDescription>
                            {t("training.watchDesc", "Flux RSS et alertes personnalisées")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            {t("training.alertsActive", "alertes actives")}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t("nav.webinars")}</CardTitle>
                    <CardDescription>{t("training.upcomingWebinars", "Webinaires à venir")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                        <Video className="h-12 w-12 mb-4 opacity-50" />
                        <p>{t("common.noData")}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}