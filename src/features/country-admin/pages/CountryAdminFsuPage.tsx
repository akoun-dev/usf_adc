import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, XCircle, Download } from "lucide-react"

export default function CountryAdminFsuPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 w-full">
            <div>
                <h1 className="text-2xl font-bold">{t("nav.fsuDataEntry")}</h1>
                <p className="text-muted-foreground">
                    {t("countryAdmin.fsuDesc", "Gestion des saisies FSU")}
                </p>
            </div>

            <Tabs defaultValue="pending" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="pending">
                        <Clock className="mr-2 h-4 w-4" />
                        {t("nav.pendingEntries")}
                    </TabsTrigger>
                    <TabsTrigger value="history">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {t("nav.fsuHistory")}
                    </TabsTrigger>
                    <TabsTrigger value="export">
                        <Download className="mr-2 h-4 w-4" />
                        {t("nav.exportData")}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground">{t("common.noData")}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground">{t("common.noData")}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="export">
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