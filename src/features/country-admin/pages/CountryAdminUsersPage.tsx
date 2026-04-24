import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus, Users, Key, Clock } from "lucide-react"

export default function CountryAdminUsersPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 w-full">
            <div>
                <h1 className="text-2xl font-bold">{t("nav.usersList")}</h1>
                <p className="text-muted-foreground">
                    {t("countryAdmin.usersDesc", "Gestion des utilisateurs")}
                </p>
            </div>

            <Tabs defaultValue="users" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="users">
                        <Users className="mr-2 h-4 w-4" />
                        {t("nav.usersList")}
                    </TabsTrigger>
                    <TabsTrigger value="invite">
                        <UserPlus className="mr-2 h-4 w-4" />
                        {t("nav.inviteUser")}
                    </TabsTrigger>
                    <TabsTrigger value="roles">
                        <Key className="mr-2 h-4 w-4" />
                        {t("nav.roles")}
                    </TabsTrigger>
                    <TabsTrigger value="activity">
                        <Clock className="mr-2 h-4 w-4" />
                        {t("nav.activity")}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="users">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground">{t("common.noData")}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="invite">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground">{t("common.noData")}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="roles">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground">{t("common.noData")}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="activity">
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