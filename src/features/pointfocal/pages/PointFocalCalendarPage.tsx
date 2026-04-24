import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CalendarClock, Bell, Clock } from "lucide-react"

export default function PointFocalCalendarPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 w-full">
            <div>
                <h1 className="text-2xl font-bold">{t("nav.calendar")}</h1>
                <p className="text-muted-foreground">
                    {t("pointfocal.calendarDesc", "Gestion des événements et rappels")}
                </p>
            </div>

            <Tabs defaultValue="upcoming" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="upcoming">
                        <CalendarClock className="mr-2 h-4 w-4" />
                        {t("nav.calendarUpcoming", "Événements à Venir")}
                    </TabsTrigger>
                    <TabsTrigger value="my-events">
                        <Calendar className="mr-2 h-4 w-4" />
                        {t("nav.calendarMyEvents", "Mes Événements")}
                    </TabsTrigger>
                    <TabsTrigger value="subscriptions">
                        <Bell className="mr-2 h-4 w-4" />
                        {t("nav.calendarSubscriptions", "Abonnements")}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CalendarClock className="h-5 w-5" />
                                {t("nav.calendarUpcoming")}
                            </CardTitle>
                            <CardDescription>
                                {t("pointfocal.upcomingEventsDesc", "Réunions, webinaires et échéances")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{t("common.noData")}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="my-events">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                {t("nav.calendarMyEvents")}
                            </CardTitle>
                            <CardDescription>
                                {t("pointfocal.myEventsDesc", "Événements auxquels vous êtes inscrit")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{t("common.noData")}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="subscriptions">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                {t("nav.calendarSubscriptions")}
                            </CardTitle>
                            <CardDescription>
                                {t("pointfocal.subscriptionsDesc", "Gestion des rappels et notifications")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{t("common.noData")}</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}