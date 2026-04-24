import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { UserCog, Shield, Settings, Bell } from "lucide-react"
import { Link } from "react-router-dom"

export default function AccountPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">{t("nav.sectionAccount")}</h1>
                <p className="text-muted-foreground">
                    {t("account.desc", "Gérez votre compte")}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                        <UserCog className="h-8 w-8 mb-2 text-primary" />
                        <CardTitle>{t("nav.profile")}</CardTitle>
                        <CardDescription>
                            {t("account.profileDesc", "Modifier vos informations personnelles")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" asChild>
                            <Link to="/point-focal/profile">{t("common.edit")}</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                        <Bell className="h-8 w-8 mb-2 text-primary" />
                        <CardTitle>{t("nav.preferences")}</CardTitle>
                        <CardDescription>
                            {t("account.preferencesDesc", "Gérer les notifications et paramètres")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" asChild>
                            <Link to="/point-focal/profile/preferences">{t("common.edit")}</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                        <Shield className="h-8 w-8 mb-2 text-primary" />
                        <CardTitle>{t("nav.security")}</CardTitle>
                        <CardDescription>
                            {t("account.securityDesc", "Mot de passe et 2FA")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" asChild>
                            <Link to="/point-focal/profile/security">{t("common.edit")}</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t("nav.profile")}</CardTitle>
                    <CardDescription>{t("account.profileDetails", "Détails de votre profil")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                        <UserCog className="h-12 w-12 mb-4 opacity-50" />
                        <p>{t("common.noData")}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}