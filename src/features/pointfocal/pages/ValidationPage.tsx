import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Clock, CheckCircle, XCircle } from "lucide-react"

export default function ValidationPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">{t("nav.sectionValidation")}</h1>
                <p className="text-muted-foreground">
                    {t("validation.desc", "Validation et soumission des données")}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
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
                        <CardTitle className="text-sm font-medium">{t("dashboard.rejected")}</CardTitle>
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t("nav.pendingSubmissions")}</CardTitle>
                    <CardDescription>{t("validation.pendingDesc", "Soumissions en attente de validation")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                        <Clock className="h-12 w-12 mb-4 opacity-50" />
                        <p>{t("common.noData")}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}