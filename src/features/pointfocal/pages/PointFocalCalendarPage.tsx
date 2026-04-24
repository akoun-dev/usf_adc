import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Calendar, CalendarClock, Bell, Clock, MapPin, Users, ExternalLink } from "lucide-react"

function useEvents(status?: string) {
    return useQuery({
        queryKey: ["events", status],
        queryFn: async () => {
            let query = supabase
                .from("events")
                .select(`
                    *,
                    country:countries(name_fr)
                `)
                .order("start_date", { ascending: true })
            
            if (status) {
                query = query.eq("status", status)
            } else {
                query = query.eq("status", "upcoming")
            }
            
            const { data, error } = await query
            if (error) throw error
            return data
        },
    })
}

function useUserEventRegistrations() {
    return useQuery({
        queryKey: ["user-event-registrations"],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return []
            
            const { data, error } = await supabase
                .from("event_registrations")
                .select(`
                    *,
                    event:events(*)
                `)
                .eq("user_id", user.id)
            if (error) throw error
            return data
        },
    })
}

export default function PointFocalCalendarPage() {
    const { t } = useTranslation()
    const { data: upcomingEvents = [], isLoading: upcomingLoading } = useEvents("upcoming")
    const { data: pastEvents = [], isLoading: pastLoading } = useEvents("completed")
    const { data: registrations = [], isLoading: regLoading } = useUserEventRegistrations()

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
                        {t("nav.calendarUpcoming", "Evenements a Venir")}
                    </TabsTrigger>
                    <TabsTrigger value="my-events">
                        <Calendar className="mr-2 h-4 w-4" />
                        {t("nav.calendarMyEvents", "Mes Evenements")}
                    </TabsTrigger>
                    <TabsTrigger value="subscriptions">
                        <Bell className="mr-2 h-4 w-4" />
                        {t("nav.calendarSubscriptions", "Abonnements")}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                    <div className="grid gap-4 md:grid-cols-2">
                        {(upcomingLoading ? [] : upcomingEvents || []).map(event => (
                            <Card key={event.id} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="text-base">{event.title}</CardTitle>
                                            <CardDescription>
                                                {event.country?.name_fr || event.organizer || ""}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="secondary">
                                            {event.event_type}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            {new Date(event.start_date).toLocaleDateString("fr-FR", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </span>
                                    </div>
                                    {event.location && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            <span>{event.location}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Users className="h-4 w-4" />
                                        <span>{event.max_participants || "Illimite"} participants</span>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button variant="outline" size="sm">
                                            <ExternalLink className="mr-1 h-4 w-4" />
                                            Details
                                        </Button>
                                        {event.registration_url && (
                                            <Button size="sm">
                                                S'inscrire
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {upcomingEvents?.length === 0 && (
                            <Card className="col-span-2">
                                <CardContent className="py-12 text-center text-muted-foreground">
                                    <CalendarClock className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                    <p>{t("common.noData")}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="my-events">
                    <div className="grid gap-4 md:grid-cols-2">
                        {(regLoading ? [] : registrations || []).map(reg => (
                            <Card key={reg.id} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="text-base">{reg.event?.title}</CardTitle>
                                            <CardDescription>
                                                {new Date(reg.event?.start_date).toLocaleDateString()}
                                            </CardDescription>
                                        </div>
                                        <Badge variant={reg.status === "registered" ? "default" : "secondary"}>
                                            {reg.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {reg.event?.location && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            <span>{reg.event.location}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                        {registrations?.length === 0 && (
                            <Card className="col-span-2">
                                <CardContent className="py-12 text-center text-muted-foreground">
                                    <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                    <p>{t("common.noData")}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
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
                            <p className="text-muted-foreground">
                                Configurez vos abonnements pour recevoir des notifications lors de nouveaux evenements.
                            </p>
                            <Button className="mt-4">
                                <Bell className="mr-2 h-4 w-4" />
                                Gerer mes abonnements
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}