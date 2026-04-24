import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Flag, Globe } from "lucide-react"

export default function CountryAdminReportsPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 w-full">
            <div>
                <h1 className="text-2xl font-bold">{t("nav.reports")}</h1>
                <p className="text-muted-foreground">
                    {t("countryAdmin.reportsDesc", "Rapports et pilotage")}
                </p>
            </div>

            <Tabs defaultValue="generator" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="generator">{t("nav.reportGenerator")}</TabsTrigger>
                    <TabsTrigger value="kpis">{t("nav.kpis")}</TabsTrigger>
                    <TabsTrigger value="uat">{t("nav.reportingUat")}</TabsTrigger>
                </TabsList>

                <TabsContent value="generator">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground">{t("common.noData")}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="kpis">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground">{t("common.noData")}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="uat">
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