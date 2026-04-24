import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LifeBuoy, BookOpen } from "lucide-react"

export default function CountryAdminSupportPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 w-full">
            <div>
                <h1 className="text-2xl font-bold">{t("nav.supportTickets")}</h1>
                <p className="text-muted-foreground">
                    {t("countryAdmin.supportDesc", "Support et assistance")}
                </p>
            </div>

            <Tabs defaultValue="tickets" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="tickets">{t("nav.supportTickets")}</TabsTrigger>
                    <TabsTrigger value="faq">{t("nav.faq")}</TabsTrigger>
                </TabsList>

                <TabsContent value="tickets">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground">{t("common.noData")}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="faq">
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