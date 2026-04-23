import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, ShieldAlert, Plus, Trash2, Globe } from "lucide-react"
import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"
import {
    useIpRestrictions,
    useCreateIpRule,
    useDeleteIpRule,
    useToggleIpFiltering,
    IpRule,
} from "../../hooks/useIpRestrictions"

export default function IpRestrictionsSettingsPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { toast } = useToast()

    const { data: rules = [], isLoading } = useIpRestrictions()
    const createRuleMutation = useCreateIpRule()
    const deleteRuleMutation = useDeleteIpRule()
    const toggleFilteringMutation = useToggleIpFiltering()

    const [enabled, setEnabled] = useState(true)
    const [newRule, setNewRule] = useState({
        name: "",
        ip_range: "",
        type: "allow" as "allow" | "deny",
    })

    const addRule = () => {
        if (!newRule.name || !newRule.ip_range) return

        createRuleMutation.mutate(newRule, {
            onSuccess: () => {
                setNewRule({ name: "", ip_range: "", type: "allow" })
                toast({ title: t("admin.ruleAdded", "Règle ajoutée") })
            },
            onError: () => {
                toast({
                    title: t("admin.error", "Erreur lors de l'ajout"),
                    variant: "destructive",
                })
            },
        })
    }

    const deleteRule = (id: string) => {
        deleteRuleMutation.mutate(id, {
            onSuccess: () => {
                toast({ title: t("admin.ruleDeleted", "Règle supprimée") })
            },
            onError: () => {
                toast({
                    title: t("admin.error", "Erreur lors de la suppression"),
                    variant: "destructive",
                })
            },
        })
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/admin/settings")}
                    className="hover:bg-[#00833d]/10 hover:text-[#00833d]"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-[#00833d]">
                        {t("admin.ipRestrictions", "Restrictions IP")}
                    </h1>
                    <p className="text-muted-foreground">
                        {t(
                            "admin.ipRestrictionsDesc",
                            "Configurez les règles d'accès par adresse IP"
                        )}
                    </p>
                </div>
            </div>

            {/* Status Card */}
            <Card
                className={
                    enabled ? "border-[#00833d]/20" : "border-[#ffe700]/30"
                }
            >
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full ${enabled ? "bg-[#00833d]/20" : "bg-[#ffe700]/30"}`}
                            >
                                <ShieldAlert
                                    className={`h-5 w-5 ${enabled ? "text-[#00833d]" : "text-[#00833d]"}`}
                                />
                            </div>
                            <div>
                                <CardTitle
                                    className={
                                        enabled
                                            ? "text-[#00833d]"
                                            : "text-[#ffe700]"
                                    }
                                >
                                    {enabled
                                        ? t(
                                              "admin.ipFilteringEnabled",
                                              "Filtrage IP activé"
                                          )
                                        : t(
                                              "admin.ipFilteringDisabled",
                                              "Filtrage IP désactivé"
                                          )}
                                </CardTitle>
                                <CardDescription>
                                    {enabled
                                        ? t(
                                              "admin.ipFilteringEnabledDesc",
                                              "Les règles IP sont actuellement appliquées"
                                          )
                                        : t(
                                              "admin.ipFilteringDisabledDesc",
                                              "Toutes les adresses IP sont autorisées"
                                          )}
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="ip-toggle">
                                {t("admin.enable", "Activer")}
                            </Label>
                            <Switch
                                id="ip-toggle"
                                checked={enabled}
                                onCheckedChange={setEnabled}
                            />
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("admin.totalRules", "Total des règles")}
                        </CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{rules.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {rules.filter(r => r.type === "allow").length}{" "}
                            {t("admin.allow", "autorisent")} /{" "}
                            {rules.filter(r => r.type === "deny").length}{" "}
                            {t("admin.deny", "refusent")}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("admin.blockedAttempts", "Tentatives bloquées")}
                        </CardTitle>
                        <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-500">
                            24
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {t("admin.last24h", "Dernières 24h")}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t(
                                "admin.currentConnections",
                                "Connexions actives"
                            )}
                        </CardTitle>
                        <Badge
                            variant="outline"
                            className="bg-green-500/20 text-green-500 border-green-500/50"
                        >
                            {t("admin.secure", "Sécurisées")}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">
                            8
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {t("admin.fromAllowedIps", "IPs autorisées")}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Add New Rule */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {t("admin.addIpRule", "Ajouter une règle IP")}
                    </CardTitle>
                    <CardDescription>
                        {t(
                            "admin.addIpRuleDesc",
                            "Ajoutez une nouvelle règle de filtrage IP"
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                            <Label>
                                {t("admin.ruleName", "Nom de la règle")}
                            </Label>
                            <Input
                                placeholder={t(
                                    "admin.ruleNamePlaceholder",
                                    "Ex: Bureau Paris"
                                )}
                                value={newRule.name}
                                onChange={e =>
                                    setNewRule({
                                        ...newRule,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t("admin.ipRange", "Plage IP")}</Label>
                            <Input
                                placeholder="192.168.1.0/24"
                                value={newRule.ip_range}
                                onChange={e =>
                                    setNewRule({
                                        ...newRule,
                                        ip_range: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>
                                {t("admin.ruleType", "Type de règle")}
                            </Label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={
                                        newRule.type === "allow"
                                            ? "default"
                                            : "outline"
                                    }
                                    className="flex-1"
                                    onClick={() =>
                                        setNewRule({
                                            ...newRule,
                                            type: "allow",
                                        })
                                    }
                                >
                                    {t("admin.allow", "Autoriser")}
                                </Button>
                                <Button
                                    type="button"
                                    variant={
                                        newRule.type === "deny"
                                            ? "destructive"
                                            : "outline"
                                    }
                                    className="flex-1"
                                    onClick={() =>
                                        setNewRule({ ...newRule, type: "deny" })
                                    }
                                >
                                    {t("admin.deny", "Refuser")}
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-end">
                            <Button
                                className="w-full"
                                onClick={addRule}
                                disabled={!newRule.name || !newRule.ip_range}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {t("admin.add", "Ajouter")}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Rules List */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {t("admin.activeRules", "Règles actives")}
                    </CardTitle>
                    <CardDescription>
                        {t(
                            "admin.activeRulesDesc",
                            "Liste des règles de filtrage IP actuellement appliquées"
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {rules.map(rule => (
                            <div
                                key={rule.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full ${rule.type === "allow" ? "bg-green-500/20" : "bg-red-500/20"}`}
                                    >
                                        <Globe
                                            className={`h-5 w-5 ${rule.type === "allow" ? "text-green-500" : "text-red-500"}`}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {rule.name}
                                        </p>
                                        <code className="text-sm bg-muted px-2 py-1 rounded">
                                            {rule.ip_range}
                                        </code>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant={
                                            rule.type === "allow"
                                                ? "default"
                                                : "destructive"
                                        }
                                    >
                                        {rule.type === "allow"
                                            ? t("admin.allow", "Autoriser")
                                            : t("admin.deny", "Refuser")}
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deleteRule(rule.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
