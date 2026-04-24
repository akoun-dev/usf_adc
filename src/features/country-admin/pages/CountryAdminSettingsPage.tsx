import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Bell, Flag, CheckSquare, Download, UserPlus, Users, Key, Shield } from "lucide-react"

export default function CountryAdminSettingsPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 w-full">
            <div>
                <h1 className="text-2xl font-bold">{t("nav.settings")}</h1>
                <p className="text-muted-foreground">
                    {t("countryAdmin.settingsDesc", "Configuration et paramètres")}
                </p>
            </div>

            <Tabs defaultValue="country" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                    <TabsTrigger value="country">{t("nav.countrySettings", "Paramètres Pays")}</TabsTrigger>
                    <TabsTrigger value="notifications">{t("profile.notifications", "Notifications")}</TabsTrigger>
                    <TabsTrigger value="indicators">{t("nav.kpis", "Indicateurs")}</TabsTrigger>
                    <TabsTrigger value="workflow">{t("countryAdmin.workflow", "Workflow")}</TabsTrigger>
                    <TabsTrigger value="users">{t("nav.users", "Utilisateurs")}</TabsTrigger>
                    <TabsTrigger value="audit">{t("nav.auditLog", "Audit")}</TabsTrigger>
                </TabsList>

                <TabsContent value="country">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                {t("nav.countrySettings")}
                            </CardTitle>
                            <CardDescription>{t("countryAdmin.countrySettingsDesc", "Configuration générale du pays")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{t("common.noData")}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                {t("profile.notifications")}
                            </CardTitle>
                            <CardDescription>{t("countryAdmin.notificationsDesc", "Canaux et fréquences des notifications")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{t("common.noData")}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="indicators">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Flag className="h-5 w-5" />
                                {t("countryAdmin.indicators", "Indicateurs Prioritaires")}
                            </CardTitle>
                            <CardDescription>{t("countryAdmin.indicatorsDesc", "Sélectionner les indicateurs du tableau de bord")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{t("common.noData")}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="workflow">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckSquare className="h-5 w-5" />
                                {t("countryAdmin.workflow", "Workflow de Validation")}
                            </CardTitle>
                            <CardDescription>{t("countryAdmin.workflowDesc", "Niveaux d'approbation (1 ou 2 niveaux)")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{t("common.noData")}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users">
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserPlus className="h-5 w-5" />
                                    {t("nav.inviteUser")}
                                </CardTitle>
                                <CardDescription>{t("countryAdmin.inviteUserDesc", "Inviter un nouveau Point Focal")}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{t("common.noData")}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    {t("nav.usersList", "Liste des Utilisateurs")}
                                </CardTitle>
                                <CardDescription>{t("countryAdmin.usersDesc", "Équipe nationale")}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{t("common.noData")}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Key className="h-5 w-5" />
                                    {t("nav.roles")}
                                </CardTitle>
                                <CardDescription>{t("countryAdmin.rolesDesc", "Gérer les rôles")}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{t("common.noData")}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Download className="h-5 w-5" />
                                    {t("nav.exportData")}
                                </CardTitle>
                                <CardDescription>{t("countryAdmin.exportDesc", "Exporter les données en Excel/PDF")}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{t("common.noData")}</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="audit">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                {t("nav.auditLog")}
                            </CardTitle>
                            <CardDescription>{t("countryAdmin.auditDesc", "Historique des actions administratives")}</CardDescription>
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