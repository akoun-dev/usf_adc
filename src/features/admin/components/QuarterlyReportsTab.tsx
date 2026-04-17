import { useState } from "react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, CheckCircle2 } from "lucide-react"
import { useTranslation } from "react-i18next"

export function QuarterlyReportsTab() {
    const { t } = useTranslation()
    const [enabled, setEnabled] = useState(true)
    const [frequency, setFrequency] = useState("quarterly")
    const [recipients, setRecipients] = useState("super_admin")

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>
                        {t("admin.quarterlyReports", "Rapports automatiques")}
                    </CardTitle>
                    <CardDescription>
                        {t(
                            "admin.quarterlyReportsDesc",
                            "Programmez la génération automatique de rapports de synthèse"
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                            <p className="font-medium">
                                {t(
                                    "admin.autoReportsEnabled",
                                    "Génération automatique"
                                )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {t(
                                    "admin.autoReportsEnabledDesc",
                                    "Les rapports seront générés et envoyés automatiquement"
                                )}
                            </p>
                        </div>
                        <Switch
                            checked={enabled}
                            onCheckedChange={setEnabled}
                        />
                    </div>

                    <div className="space-y-3">
                        <div>
                            <Label>
                                {t("admin.reportFrequency", "Fréquence")}
                            </Label>
                            <Select
                                value={frequency}
                                onValueChange={setFrequency}
                            >
                                <SelectTrigger className="w-[200px] mt-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">
                                        {t("admin.monthly", "Mensuel")}
                                    </SelectItem>
                                    <SelectItem value="quarterly">
                                        {t("admin.quarterly", "Trimestriel")}
                                    </SelectItem>
                                    <SelectItem value="yearly">
                                        {t("admin.yearly", "Annuel")}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>
                                {t("admin.reportRecipients", "Destinataires")}
                            </Label>
                            <Select
                                value={recipients}
                                onValueChange={setRecipients}
                            >
                                <SelectTrigger className="w-[200px] mt-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="super_admin">
                                        {t(
                                            "admin_extra.quarterlyReports.recipientsGlobalAdmin"
                                        )}
                                    </SelectItem>
                                    <SelectItem value="all_admins">
                                        {t(
                                            "admin_extra.quarterlyReports.recipientsAllAdmins"
                                        )}
                                    </SelectItem>
                                    <SelectItem value="all_users">
                                        {t(
                                            "admin_extra.quarterlyReports.recipientsAllUsers"
                                        )}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        <div>
                            <p className="text-sm font-medium">
                                {t("admin.nextReport", "Prochain rapport")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {frequency === "monthly"
                                    ? "1er mai 2026"
                                    : frequency === "quarterly"
                                      ? "1er juillet 2026"
                                      : "1er janvier 2027"}
                            </p>
                        </div>
                        <Badge variant="outline" className="ml-auto">
                            <CalendarClock className="mr-1 h-3 w-3" />
                            {t("admin.scheduled", "Programmé")}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
