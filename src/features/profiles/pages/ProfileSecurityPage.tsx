import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Key, Smartphone, Mail } from "lucide-react"
import PageHero from "@/components/PageHero"

export default function ProfileSecurityPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 animate-fade-in w-full">
            <PageHero
                title={t("profile.security", "Sécurité")}
                description={t("profile.securityDesc", "Gérez la sécurité de votre compte")}
                icon={<Shield className="h-6 w-6 text-secondary" />}
            />

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="h-5 w-5" />
                            {t("profile.password", "Mot de passe")}
                        </CardTitle>
                        <CardDescription>
                            {t("profile.passwordDesc", "Changez votre mot de passe")}
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
                            <Smartphone className="h-5 w-5" />
                            {t("profile.twoFactor", "Authentification 2FA")}
                        </CardTitle>
                        <CardDescription>
                            {t("profile.twoFactorDesc", "Sécurisez votre compte")}
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
                            <Mail className="h-5 w-5" />
                            {t("profile.devices", "Appareils")}
                        </CardTitle>
                        <CardDescription>
                            {t("profile.devicesDesc", "Gérez les appareils connectés")}
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