import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Shield } from "lucide-react"

export default function CountryAdminProfilePage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 w-full">
            <div>
                <h1 className="text-2xl font-bold">{t("nav.adminProfile")}</h1>
                <p className="text-muted-foreground">
                    {t("countryAdmin.profileDesc", "Profil administrateur")}
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="profile">{t("nav.adminProfile")}</TabsTrigger>
                    <TabsTrigger value="audit">{t("nav.auditLog")}</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground">{t("common.noData")}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="audit">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("nav.auditLog")}</CardTitle>
                            <CardDescription>{t("countryAdmin.auditDesc", "Historique des actions")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{t("common.noData")}</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}