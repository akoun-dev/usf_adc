import { useState } from "react"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { authService } from "@/features/auth/services/auth-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
    Save,
    User,
    Shield,
    ShieldCheck,
    Mail,
    Smartphone,
    KeyRound,
    Send,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import PageHero from "@/components/PageHero"
import PromotionHistory from "../components/PromotionHistory"

export default function ProfilePage() {
    const { user, profile, roles, refreshProfile } = useAuth()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const { t, i18n } = useTranslation()

    const [fullName, setFullName] = useState(profile?.full_name ?? "")
    const [phone, setPhone] = useState(profile?.phone ?? "")
    const [language, setLanguage] = useState(profile?.language ?? "fr")
    const [mfaMethod, setMfaMethod] = useState(profile?.mfa_method ?? "email")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [telegramChatId, setTelegramChatId] = useState(
        (profile as any)?.telegram_chat_id ?? ""
    )

    const isAdmin = roles.some(r =>
        ["super_admin", "country_admin"].includes(r)
    )

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        if (mfaMethod === "sms" && !phone?.trim()) {
            toast({
                title: t("common.error"),
                description: t("profile.phoneRequiredForSms"),
                variant: "destructive",
            })
            return
        }
        if (mfaMethod === "telegram" && !telegramChatId?.trim()) {
            toast({
                title: t("common.error"),
                description: t("profile.telegramChatIdRequired"),
                variant: "destructive",
            })
            return
        }

        setLoading(true)
        try {
            await authService.updateProfile(user.id, {
                full_name: fullName,
                phone,
                language,
                ...(isAdmin
                    ? { telegram_chat_id: telegramChatId || null }
                    : {}),
                ...(isAdmin ? { mfa_method: mfaMethod } : {}),
            })
            i18n.changeLanguage(language)
            await refreshProfile()
            toast({
                title: t("profile.saved"),
                description: t("profile.savedDesc"),
            })
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : t("common.error")
            toast({
                title: t("common.error"),
                description: message,
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 animate-fade-in w-full">
            <PageHero
                title={t("profile.title")}
                description={t("profile.desc")}
                icon={<User className="h-6 w-6 text-secondary" />}
            />

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {t("profile.personalInfo")}
                    </CardTitle>
                    <CardDescription>
                        {t("profile.role")} :{" "}
                        {roles.map(r => t(`roles.${r}`)).join(", ") ||
                            t("profile.noRole")}
                    </CardDescription>
                    {isAdmin && (
                        <div className="mt-2 flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            <span className="font-medium text-primary">
                                {t("profile.mfaActive")}
                            </span>
                            <span className="text-muted-foreground">—</span>
                            {(profile?.mfa_method ?? "email") === "sms" ? (
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <Smartphone className="h-3.5 w-3.5" /> SMS
                                </span>
                            ) : (profile?.mfa_method ?? "email") ===
                              "telegram" ? (
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <Send className="h-3.5 w-3.5" /> Telegram
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <Mail className="h-3.5 w-3.5" /> Email
                                </span>
                            )}
                        </div>
                    )}
                </CardHeader>
                <form onSubmit={handleSave}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">{t("profile.email")}</Label>
                            <Input
                                id="email"
                                value={user?.email ?? ""}
                                disabled
                                className="bg-muted"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fullName">
                                {t("profile.fullName")}
                            </Label>
                            <Input
                                id="fullName"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                placeholder={t("profile.fullNamePlaceholder")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">{t("profile.phone")}</Label>
                            <Input
                                id="phone"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                placeholder={t("profile.phonePlaceholder")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="language">
                                {t("profile.language")}
                            </Label>
                            <Select
                                value={language}
                                onValueChange={setLanguage}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fr">
                                        {t("languages.fr")}
                                    </SelectItem>
                                    <SelectItem value="en">
                                        {t("languages.en")}
                                    </SelectItem>
                                    <SelectItem value="pt">
                                        {t("languages.pt")}
                                    </SelectItem>
                                    <SelectItem value="ar">
                                        {t("languages.ar")}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {isAdmin && (
                            <div className="space-y-3 rounded-lg border border-border p-4">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Shield className="h-4 w-4 text-primary" />
                                    {t("profile.mfaMethod")}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {t("profile.mfaMethodDesc")}
                                </p>
                                <RadioGroup
                                    value={mfaMethod}
                                    onValueChange={setMfaMethod}
                                    className="flex gap-6"
                                >
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem
                                            value="email"
                                            id="mfa-email"
                                        />
                                        <Label
                                            htmlFor="mfa-email"
                                            className="cursor-pointer font-normal"
                                        >
                                            {t("profile.mfaEmail")}
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem
                                            value="sms"
                                            id="mfa-sms"
                                        />
                                        <Label
                                            htmlFor="mfa-sms"
                                            className="cursor-pointer font-normal"
                                        >
                                            {t("profile.mfaSms")}
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem
                                            value="telegram"
                                            id="mfa-telegram"
                                        />
                                        <Label
                                            htmlFor="mfa-telegram"
                                            className="cursor-pointer font-normal"
                                        >
                                            {t("profile.mfaTelegram")}
                                        </Label>
                                    </div>
                                </RadioGroup>
                                {mfaMethod === "sms" && !phone?.trim() && (
                                    <p className="text-xs text-destructive">
                                        {t("profile.phoneRequiredForSms")}
                                    </p>
                                )}
                                {mfaMethod === "telegram" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="telegramChatId">
                                            {t("profile.telegramChatId")}
                                        </Label>
                                        <Input
                                            id="telegramChatId"
                                            value={telegramChatId}
                                            onChange={e =>
                                                setTelegramChatId(
                                                    e.target.value
                                                )
                                            }
                                            placeholder={t(
                                                "profile.telegramChatIdPlaceholder"
                                            )}
                                        />
                                        {!telegramChatId?.trim() && (
                                            <p className="text-xs text-destructive">
                                                {t(
                                                    "profile.telegramChatIdRequired"
                                                )}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* US-010: TOTP Configuration (placeholder) */}
                        {isAdmin && (
                            <div className="space-y-3 rounded-lg border border-border p-4">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <KeyRound className="h-4 w-4 text-primary" />
                                    {t("profile.totp", "Authentification TOTP")}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {t(
                                        "profile.totpDesc",
                                        "Configurez une application d'authentification (Google Authenticator, Authy) pour une sécurité renforcée."
                                    )}
                                </p>
                                <div className="flex items-center gap-3 rounded-md bg-muted/50 p-4">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30">
                                        <KeyRound className="h-8 w-8 text-muted-foreground/50" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">
                                            {t(
                                                "profile.totpNotConfigured",
                                                "TOTP non configuré"
                                            )}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {t(
                                                "profile.totpSetupHint",
                                                "Scannez le QR code avec votre application d'authentification"
                                            )}
                                        </p>
                                        <Badge variant="outline">
                                            {t(
                                                "profile.totpComingSoon",
                                                "Bientôt disponible"
                                            )}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {loading
                                ? t("profile.saving")
                                : t("profile.saveChanges")}
                        </Button>
                    </CardContent>
                </form>
            </Card>

            {user && <PromotionHistory userId={user.id} />}
        </div>
    )
}
