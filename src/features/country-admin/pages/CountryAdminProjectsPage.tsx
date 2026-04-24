import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, Clock, FileText } from "lucide-react"

export default function CountryAdminProjectsPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 w-full">
            <div>
                <h1 className="text-2xl font-bold">{t("nav.allProjects")}</h1>
                <p className="text-muted-foreground">
                    {t("countryAdmin.projectsDesc", "Tous les projets du pays")}
                </p>
            </div>

            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">{t("nav.allProjects")}</TabsTrigger>
                    <TabsTrigger value="pending">{t("nav.validateProjects")}</TabsTrigger>
                    <TabsTrigger value="reports">{t("nav.projectReports")}</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground">{t("common.noData")}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pending">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground">{t("common.noData")}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="reports">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground">{t("common.noData")}</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}