import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Bell, Globe, Palette } from "lucide-react"
import PageHero from "@/components/PageHero"

export default function ProfilePreferencesPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 animate-fade-in w-full">
            <PageHero
                title={t("profile.preferences", "Préférences")}
                description={t("profile.preferencesDesc", "Gérez vos préférences")}
                icon={<Settings className="h-6 w-6 text-secondary" />}
            />

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            {t("profile.notifications", "Notifications")}
                        </CardTitle>
                        <CardDescription>
                            {t("profile.notificationsDesc", "Configurez vos alertes")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            {t("common.noData", "Aucune donnée")}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            {t("profile.language", "Langue")}
                        </CardTitle>
                        <CardDescription>
                            {t("profile.languageDesc", "Choisissez votre langue")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            {t("common.noData", "Aucune donnée")}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            {t("profile.appearance", "Apparence")}
                        </CardTitle>
                        <CardDescription>
                            {t("profile.appearanceDesc", "Personnalisez l'interface")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            {t("common.noData", "Aucune donnée")}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}