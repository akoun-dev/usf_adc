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
import {
    ArrowLeft,
    Key,
    Plus,
    Copy,
    Trash2,
    Eye,
    EyeOff,
    RefreshCw,
} from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"
import {
    useApiKeys,
    useCreateApiKey,
    useUpdateApiKey,
    useDeleteApiKey,
} from "../../hooks/useApiKeys"
import type { ApiKey } from "../../types"

export default function ApiKeysSettingsPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { toast } = useToast()
    const { data: keys = [], isLoading } = useApiKeys()
    const createMutation = useCreateApiKey()
    const updateMutation = useUpdateApiKey()
    const deleteMutation = useDeleteApiKey()
    const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
    const [newKeyName, setNewKeyName] = useState("")

    const copyToClipboard = (key: string) => {
        navigator.clipboard.writeText(key)
        toast({ title: t("admin.keyCopied", "Clé copiée") })
    }

    const toggleShowKey = (id: string) => {
        setShowKeys(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const createNewKey = () => {
        if (!newKeyName.trim()) return

        const generatedKey = `pk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

        createMutation.mutate(
            { name: newKeyName, key: generatedKey },
            {
                onSuccess: () => {
                    setNewKeyName("")
                    toast({
                        title: t("admin.keyCreated", "Clé créée avec succès"),
                    })
                },
                onError: () => {
                    toast({
                        title: t("admin.error", "Erreur lors de la création"),
                        variant: "destructive",
                    })
                },
            }
        )
    }

    const deleteKey = (id: string) => {
        if (
            !confirm(
                t(
                    "admin.deleteKeyConfirm",
                    "Êtes-vous sûr de vouloir supprimer cette clé ?"
                )
            )
        )
            return
        deleteMutation.mutate(id, {
            onSuccess: () => {
                toast({ title: t("admin.keyDeleted", "Clé supprimée") })
            },
            onError: () => {
                toast({
                    title: t("admin.error", "Erreur lors de la suppression"),
                    variant: "destructive",
                })
            },
        })
    }

    const revokeKey = (id: string) => {
        updateMutation.mutate(
            { id, updates: { is_active: false } },
            {
                onSuccess: () => {
                    toast({ title: t("admin.keyRevoked", "Clé révoquée") })
                },
                onError: () => {
                    toast({
                        title: t("admin.error", "Erreur lors de la révocation"),
                        variant: "destructive",
                    })
                },
            }
        )
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
                        {t("admin.apiKeys", "Clés API")}
                    </h1>
                    <p className="text-muted-foreground">
                        {t(
                            "admin.apiKeysDesc",
                            "Gérez les clés API pour accéder à la plateforme"
                        )}
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("admin.totalKeys", "Total des clés")}
                        </CardTitle>
                        <Key className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{keys.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {keys.filter(k => k.is_active).length}{" "}
                            {t("admin.active", "actives")}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("admin.usage24h", "Utilisation 24h")}
                        </CardTitle>
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1.2K</div>
                        <p className="text-xs text-muted-foreground">
                            +12% {t("admin.vsYesterday", "vs hier")}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("admin.quotaLimit", "Limite de quota")}
                        </CardTitle>
                        <Badge variant="outline">{t("admin.pro", "Pro")}</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">10K</div>
                        <p className="text-xs text-muted-foreground">
                            {t("admin.perDay", "par jour")}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Create New Key */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {t("admin.createNewKey", "Créer une nouvelle clé")}
                    </CardTitle>
                    <CardDescription>
                        {t(
                            "admin.createNewKeyDesc",
                            "Créez une nouvelle clé API pour votre application"
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input
                            placeholder={t(
                                "admin.keyNamePlaceholder",
                                "Nom de la clé (ex: Application mobile)"
                            )}
                            value={newKeyName}
                            onChange={e => setNewKeyName(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && createNewKey()}
                        />
                        <Button
                            onClick={createNewKey}
                            disabled={!newKeyName.trim()}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {t("admin.create", "Créer")}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* API Keys List */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("admin.yourKeys", "Vos clés API")}</CardTitle>
                    <CardDescription>
                        {t(
                            "admin.yourKeysDesc",
                            "Gérez et révoquez vos clés API"
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {keys.map(key => (
                            <div
                                key={key.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium">
                                            {key.name}
                                        </p>
                                        <Badge
                                            variant={
                                                key.is_active
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {key.is_active
                                                ? t("admin.active", "Actif")
                                                : t("admin.revoked", "Révoqué")}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                                            {showKeys[key.id]
                                                ? key.key
                                                : "•".repeat(24)}
                                        </code>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() =>
                                                toggleShowKey(key.id)
                                            }
                                        >
                                            {showKeys[key.id] ? (
                                                <EyeOff className="h-3 w-3" />
                                            ) : (
                                                <Eye className="h-3 w-3" />
                                            )}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() =>
                                                copyToClipboard(key.key)
                                            }
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {t("admin.created", "Created")}{" "}
                                        {new Date(
                                            key.created_at
                                        ).toLocaleDateString()}
                                        {key.last_used &&
                                            ` • ${t("admin.lastUsed", "Last used")}: ${new Date(key.last_used).toLocaleDateString()}`}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {key.is_active && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => revokeKey(key.id)}
                                        >
                                            {t("admin.revoke", "Révoquer")}
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deleteKey(key.id)}
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
