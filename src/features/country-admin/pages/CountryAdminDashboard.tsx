import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Clock, CheckCircle, AlertTriangle, Users, FileText } from "lucide-react"

export default function CountryAdminDashboard() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 w-full">
            <div>
                <h1 className="text-2xl font-bold">{t("nav.overview")}</h1>
                <p className="text-muted-foreground">
                    {t("countryAdmin.overviewDesc", "Statistiques globales du pays")}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("fsu.totalEntries")}</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("dashboard.pending")}</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("dashboard.approved")}</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("nav.alerts")}</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{t("nav.activity")}</CardTitle>
                        <CardDescription>{t("countryAdmin.activityDesc", "Activité récente")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{t("common.noData")}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t("nav.alerts")}</CardTitle>
                        <CardDescription>{t("countryAdmin.alertsDesc", "Notifications et alertes")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{t("common.noData")}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}