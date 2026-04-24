import { useState } from "react"
import { redirect } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useTranslation } from "react-i18next"
import { FileText, Clock, CheckCircle, TrendingUp, AlertCircle, Bell, Newspaper, Calendar, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const NEWS = [
    {
        id: "1",
        title: "CMDTT-25 : Date limite prolongée pour les soumissions",
        category: "institutionnel",
        date: "2026-04-24",
        urgent: true,
    },
    {
        id: "2",
        title: "Nouveau guide méthodologique disponible",
        category: "documentation",
        date: "2026-04-22",
        urgent: false,
    },
    {
        id: "3",
        title: "Webinaire sur le financement FSU - 28 avril",
        category: "formation",
        date: "2026-04-20",
        urgent: false,
    },
]

const ALERTS = [
    {
        id: "1",
        title: "Échéance rapport trimestriel",
        deadline: "2026-04-30",
        type: "echeance",
    },
    {
        id: "2",
        title: "Validation projet en attente",
        deadline: "",
        type: "validation",
    },
    {
        id: "3",
        title: "Nouvelle directive ANSUT/UAT",
        deadline: "2026-05-01",
        type: "directive",
    },
]

export default function PointFocalDashboard() {
    const { t } = useTranslation()
    const { profile } = useAuth()

    return (
        <div className="space-y-6 w-full">
            <div>
                <h1 className="text-2xl font-bold">{t("nav.home")}</h1>
                <p className="text-muted-foreground">
                    {t("dashboard.pfDesc", "Bienvenue sur votre espace Point Focal")}
                </p>
            </div>

            <Tabs defaultValue="alerts" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="alerts">
                        <Bell className="mr-2 h-4 w-4" />
                        {t("dashboard.alerts", "Alertes et Échéances")}
                    </TabsTrigger>
                    <TabsTrigger value="news">
                        <Newspaper className="mr-2 h-4 w-4" />
                        {t("dashboard.news", "Actualités")}
                    </TabsTrigger>
                    <TabsTrigger value="calendar">
                        <Calendar className="mr-2 h-4 w-4" />
                        {t("dashboard.events", "Événements")}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="alerts" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="border-l-4 border-l-destructive">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-destructive" />
                                    {t("dashboard.urgentAlerts", "Alertes Urgentes")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {ALERTS.filter(a => a.type === "echeance" || a.type === "directive").map(alert => (
                                    <div key={alert.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                        <div>
                                            <p className="font-medium">{alert.title}</p>
                                            {alert.deadline && (
                                                <p className="text-sm text-muted-foreground">
                                                    {t("dashboard.deadline", "Échéance")}: {alert.deadline}
                                                </p>
                                            )}
                                        </div>
                                        <Badge variant="destructive">{t("dashboard.urgent", "Urgent")}</Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-muted-foreground" />
                                    {t("dashboard.pendingTasks", "Tâches en Attente")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {ALERTS.filter(a => a.type === "validation").map(alert => (
                                    <div key={alert.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                        <div>
                                            <p className="font-medium">{alert.title}</p>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            {t("dashboard.view", "Voir")}
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="news" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Newspaper className="h-5 w-5 text-primary" />
                                {t("dashboard.fsuNews", "Actualités FSU")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {NEWS.map(item => (
                                <div key={item.id} className="flex items-start justify-between gap-4 p-3 rounded-lg bg-muted/50">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant={item.urgent ? "destructive" : "secondary"}>
                                                {item.category}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">{item.date}</span>
                                        </div>
                                        <p className="font-medium">{item.title}</p>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="calendar">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                {t("dashboard.upcomingEvents", "Événements à Venir")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center h-32 text-muted-foreground">
                                <div className="text-center">
                                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">{t("common.noData", "Aucun événement")}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("dashboard.totalEntries", "Saisies totales")}
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            {t("dashboard.noEntries", "Aucune saisie")}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("dashboard.pending", "En attente")}
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            {t("dashboard.pendingDesc", "En attente de validation")}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("dashboard.approved", "Approuvées")}
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            {t("dashboard.approvedDesc", "Validées")}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("nav.myTasks", "Mes tâches")}
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            {t("dashboard.tasksDesc", "Tâches en cours")}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}