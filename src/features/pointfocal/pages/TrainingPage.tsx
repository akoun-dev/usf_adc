import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Video, BookMarked, Award, Calendar, Clock, Users, ExternalLink } from "lucide-react"

function useWebinars() {
    return useQuery({
        queryKey: ["webinars"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("events")
                .select(`
                    *,
                    country:countries(name_fr)
                `)
                .eq("event_type", "webinar")
                .eq("status", "upcoming")
                .order("start_date", { ascending: true })
            if (error) throw error
            return data
        },
    })
}

function useTrainings() {
    return useQuery({
        queryKey: ["trainings"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("events")
                .select(`
                    *,
                    country:countries(name_fr)
                `)
                .eq("event_type", "training")
                .order("start_date", { ascending: true })
            if (error) throw error
            return data
        },
    })
}

function useUserCertifications() {
    return useQuery({
        queryKey: ["user-certifications"],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return []
            
            const { data, error } = await supabase
                .from("event_registrations")
                .select(`
                    *,
                    event:events(id, title, event_type)
                `)
                .eq("user_id", user.id)
                .eq("status", "completed")
            if (error) throw error
            return data
        },
    })
}

export default function TrainingPage() {
    const { t } = useTranslation()
    const { data: webinars = [], isLoading: webinarsLoading } = useWebinars()
    const { data: trainings = [], isLoading: trainingsLoading } = useTrainings()
    const { data: certifications = [], isLoading: certsLoading } = useUserCertifications()

    return (
        <div className="space-y-6 w-full">
            <div>
                <h1 className="text-2xl font-bold">{t("nav.sectionTraining")}</h1>
                <p className="text-muted-foreground">
                    {t("training.desc", "Formation et ressources")}
                </p>
            </div>

            <Tabs defaultValue="webinars" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="webinars">
                        <Video className="mr-2 h-4 w-4" />
                        {t("nav.webinars", "Webinaires")}
                    </TabsTrigger>
                    <TabsTrigger value="elearning">
                        <BookMarked className="mr-2 h-4 w-4" />
                        {t("nav.elearning", "E-Learning")}
                    </TabsTrigger>
                    <TabsTrigger value="certifications">
                        <Award className="mr-2 h-4 w-4" />
                        {t("nav.myCertifications", "Mes Certifications")}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="webinars">
                    <div className="grid gap-4 md:grid-cols-2">
                        {(webinarsLoading ? [] : webinars || []).map(event => (
                            <Card key={event.id} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-base">{event.title}</CardTitle>
                                        <Badge variant="secondary">{event.event_type}</Badge>
                                    </div>
                                    <CardDescription>
                                        {event.country?.name_fr || event.organizer || ""}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            {new Date(event.start_date).toLocaleDateString("fr-FR", {
                                                day: "numeric",
                                                month: "short",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </span>
                                    </div>
                                    {event.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {event.description}
                                        </p>
                                    )}
                                    <div className="flex gap-2 pt-2">
                                        {event.registration_url ? (
                                            <Button size="sm">
                                                <ExternalLink className="mr-1 h-4 w-4" />
                                                S'inscrire
                                            </Button>
                                        ) : (
                                            <Button variant="outline" size="sm" disabled>
                                                Complet
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {webinars?.length === 0 && (
                            <Card className="col-span-2">
                                <CardContent className="py-12 text-center text-muted-foreground">
                                    <Video className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                    <p>{t("common.noData")}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="elearning">
                    <div className="grid gap-4 md:grid-cols-2">
                        {(trainingsLoading ? [] : trainings || []).map(event => (
                            <Card key={event.id} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-base">{event.title}</CardTitle>
                                        <Badge>{event.event_type}</Badge>
                                    </div>
                                    <CardDescription>
                                        {event.country?.name_fr || ""}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {event.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {event.description}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>{new Date(event.start_date).toLocaleDateString()}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {trainings?.length === 0 && (
                            <Card className="col-span-2">
                                <CardContent className="py-12 text-center text-muted-foreground">
                                    <BookMarked className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                    <p>{t("common.noData")}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="certifications">
                    <div className="grid gap-4 md:grid-cols-2">
                        {(certsLoading ? [] : certifications || []).map(cert => (
                            <Card key={cert.id}>
                                <CardHeader>
                                    <CardTitle className="text-base">{cert.event?.title}</CardTitle>
                                    <CardDescription>
                                        Eventicle le {new Date(cert.updated_at).toLocaleDateString()}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Badge variant="default" className="flex items-center gap-1 w-fit">
                                        <Award className="h-3 w-3" />
                                        Certifie
                                    </Badge>
                                </CardContent>
                            </Card>
                        ))}
                        {certifications?.length === 0 && (
                            <Card className="col-span-2">
                                <CardContent className="py-12 text-center text-muted-foreground">
                                    <Award className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                    <p>{t("common.noData")}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}