import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, BarChart3 } from "lucide-react"

export default function CountryAdminForumPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 w-full">
            <div>
                <h1 className="text-2xl font-bold">{t("nav.forum")}</h1>
                <p className="text-muted-foreground">
                    {t("countryAdmin.forumDesc", "Modération et statistiques")}
                </p>
            </div>

            <Tabs defaultValue="moderation" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="moderation">{t("nav.moderation")}</TabsTrigger>
                    <TabsTrigger value="stats">{t("nav.forumStats")}</TabsTrigger>
                </TabsList>

                <TabsContent value="moderation">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground">{t("common.noData")}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="stats">
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