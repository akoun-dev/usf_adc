import { redirect } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useTranslation } from "react-i18next"
import { FileText, Clock, CheckCircle, TrendingUp, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function PointFocalDashboard() {
    const { t } = useTranslation()
    const { profile } = useAuth()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">{t("nav.home")}</h1>
                <p className="text-muted-foreground">
                    {t("dashboard.pfDesc", "Bienvenue sur votre espace Point Focal")}
                </p>
            </div>

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

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{t("nav.myProjects", "Mes Projets")}</CardTitle>
                        <CardDescription>
                            {t("dashboard.recentProjects", "Projets récents")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-32 text-muted-foreground">
                            <div className="text-center">
                                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">{t("common.noData", "Aucune donnée")}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t("nav.pendingSubmissions", "Soumissions en Attente")}</CardTitle>
                        <CardDescription>
                            {t("dashboard.pendingSubmissions", "Statut des soumissions")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-32 text-muted-foreground">
                            <div className="text-center">
                                <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">{t("common.noData", "Aucune donnée")}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}