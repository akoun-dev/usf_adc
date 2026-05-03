import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Bot, Save, ShieldCheck, Sparkles, Zap } from "lucide-react"
import { useSettings } from "../../hooks/useSettings"
import { useUpdateSetting } from "../../hooks/useUpdateSetting"
import { toast } from "sonner"

interface AISettings {
    provider: "openai" | "mistral" | "anthropic" | "other" | "libretranslate"
    model: string
    apiKey: string
    systemPrompt: string
    temperature: number
    enabled: boolean
    localUrl?: string
}

export default function AiSettingsPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { data: settings } = useSettings()
    const { mutate: updateSetting, isPending } = useUpdateSetting()

    const aiSettingEntry = settings?.find(s => s.key === "ai_settings")
    const currentSettings = (aiSettingEntry?.value as AISettings) || {
        provider: "openai",
        model: "gpt-4o",
        apiKey: "",
        systemPrompt: t("admin.defaultSystemPrompt", "You are the FSU Assistant, a telecommunications expert for USF-ADC."),
        temperature: 0.7,
        enabled: true,
        localUrl: "http://localhost:5001",
    }

    const [form, setForm] = useState<AISettings>(currentSettings)

    const handleSave = () => {
        updateSetting(
            {
                key: "ai_settings",
                value: form,
                label: t("admin.aiSettingsLabel", "Configuration de l'Assistant IA"),
                category: "ai",
            },
            {
                onSuccess: () => {
                    toast.success(t("common.saveSuccess", "Configuration enregistrée avec succès"))
                },
                onError: () => {
                    toast.error(t("common.saveError", "Erreur lors de l'enregistrement"))
                },
            }
        )
    }

    const providers = [
        { value: "openai", label: t("admin.providerOpenAI", "OpenAI"), icon: "🤖" },
        { value: "mistral", label: t("admin.providerMistral", "Mistral AI"), icon: "🌀" },
        { value: "anthropic", label: t("admin.providerAnthropic", "Anthropic (Claude)"), icon: "🧠" },
        { value: "libretranslate", label: t("admin.providerLibreTranslate", "LibreTranslate (Local)"), icon: "🌐" },
        { value: "other", label: t("admin.providerOther", "Other"), icon: "⚙️" },
    ]

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/admin/settings')}
                    className="hover:bg-[#00833d]/10 hover:text-[#00833d]"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-[#00833d]">
                        {t("admin.aiSettings", "Assistant IA")}
                    </h1>
                    <p className="text-muted-foreground">
                        {t("admin.aiSettingsDesc", "Configurez le modèle de langage pour l'assistant IA de la plateforme")}
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("admin.aiProvider", "Fournisseur")}
                        </CardTitle>
                        <Bot className="h-4 w-4 text-[#00833d]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {providers.find(p => p.value === form.provider)?.label || form.provider}
                        </div>
                        <p className="text-xs text-muted-foreground">{form.model}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("admin.aiStatus", "Statut")}
                        </CardTitle>
                        <Sparkles className="h-4 w-4 text-[#ffe700]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {form.enabled ? (
                                <span className="text-[#00833d]">{t("admin.enabled", "Activé")}</span>
                            ) : (
                                <span className="text-muted-foreground">{t("admin.disabled", "Désactivé")}</span>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">{t("admin.currentStatus", "État actuel")}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("admin.temperature", "Temperature")}
                        </CardTitle>
                        <Zap className="h-4 w-4 text-[#00833d]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{form.temperature}</div>
                        <p className="text-xs text-muted-foreground">{t("admin.creativity", "Créativité")}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Configuration Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00833d]/20">
                            <Bot className="h-5 w-5 text-[#00833d]" />
                        </div>
                        {t("admin.aiConfiguration", "Configuration de l'Assistant IA")}
                    </CardTitle>
                    <CardDescription>
                        {t("admin.aiConfigDesc", "Configurez le modèle de langage et la clé API pour l'Assistant FSU.")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Enable/Disable Toggle */}
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-[#00833d]/5">
                        <div className="space-y-1">
                            <Label className="text-base font-medium">
                                {t("admin.enableAssistant", "Activer l'Assistant IA")}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {t("admin.enableAssistantDesc", "Permet à l'assistant IA de répondre aux questions des utilisateurs")}
                            </p>
                        </div>
                        <Switch
                            checked={form.enabled}
                            onCheckedChange={(checked) => setForm(prev => ({ ...prev, enabled: checked }))}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Provider Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="provider">
                                {t("admin.aiProvider", "Fournisseur d'IA")}
                            </Label>
                            <Select
                                value={form.provider}
                                onValueChange={(val: any) => setForm(prev => ({ ...prev, provider: val }))}
                                disabled={!form.enabled}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {providers.map(provider => (
                                        <SelectItem key={provider.value} value={provider.value}>
                                            <span className="flex items-center gap-2">
                                                <span>{provider.icon}</span>
                                                {provider.label}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Model */}
                        <div className="space-y-2">
                            <Label htmlFor="model">
                                {t("admin.aiModel", "Modèle")}
                            </Label>
                            <Input
                                id="model"
                                value={form.model}
                                onChange={e => setForm(prev => ({ ...prev, model: e.target.value }))}
                                placeholder="ex: gpt-4o, mistral-large"
                                disabled={!form.enabled}
                            />
                        </div>
                    </div>

                    {/* API Key */}
                    <div className="space-y-2">
                        <Label htmlFor="apiKey" className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                            {t("admin.aiApiKey", "Clé API")}
                        </Label>
                        <Input
                            id="apiKey"
                            type="password"
                            value={form.apiKey}
                            onChange={e => setForm(prev => ({ ...prev, apiKey: e.target.value }))}
                            placeholder={form.provider === "libretranslate" ? "Facultatif (si configuré)" : "sk-..."}
                            disabled={!form.enabled}
                            className="font-mono"
                        />
                        <p className="text-xs text-muted-foreground">
                            {form.provider === "libretranslate" 
                                ? t("admin.apiKeyLibreTranslateDesc", "Clé API optionnelle pour votre instance LibreTranslate.")
                                : t("admin.apiKeyDesc", "Votre clé API est stockée de manière sécurisée et n'est jamais partagée.")}
                        </p>
                    </div>

                    {/* Local URL for LibreTranslate */}
                    {form.provider === "libretranslate" && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <Label htmlFor="localUrl">
                                {t("admin.aiLocalUrl", "URL de l'instance locale")}
                            </Label>
                            <Input
                                id="localUrl"
                                value={form.localUrl}
                                onChange={e => setForm(prev => ({ ...prev, localUrl: e.target.value }))}
                                placeholder="http://localhost:5001"
                                disabled={!form.enabled}
                            />
                            <p className="text-xs text-muted-foreground">
                                {t("admin.localUrlDesc", "L'URL de votre serveur LibreTranslate (ex: http://localhost:5001)")}
                            </p>
                        </div>
                    )}

                    {/* System Prompt */}
                    <div className="space-y-2">
                        <Label htmlFor="systemPrompt">
                            {t("admin.aiSystemPrompt", "Instruction Système (System Prompt)")}
                        </Label>
                        <Textarea
                            id="systemPrompt"
                            rows={5}
                            value={form.systemPrompt}
                            onChange={e => setForm(prev => ({ ...prev, systemPrompt: e.target.value }))}
                            placeholder="Définissez le rôle et la personnalité de l'assistant..."
                            disabled={!form.enabled}
                            className="font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                            {t("admin.systemPromptDesc", "Cette instruction définit le comportement et les capacités de l'assistant.")}
                        </p>
                    </div>

                    {/* Temperature */}
                    <div className="space-y-2">
                        <Label htmlFor="temperature">
                            {t("admin.aiTemperature", "Temperature ({value})", { value: form.temperature })}
                        </Label>
                        <Input
                            id="temperature"
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={form.temperature}
                            onChange={e => setForm(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                            disabled={!form.enabled}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{t("admin.precise", "Précis")}</span>
                            <span>{t("admin.creative", "Créatif")}</span>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSave}
                            disabled={isPending || !form.enabled}
                            className="gap-2 bg-[#00833d] hover:bg-[#00833d]/90"
                        >
                            <Save className="h-4 w-4" />
                            {isPending
                                ? t("common.saving", "Enregistrement...")
                                : t("common.save", "Enregistrer la configuration")
                            }
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="border-[#ffe700]/30 bg-[#ffe700]/5">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#00833d]" />
                        {t("admin.aiTips", "Conseils d'utilisation")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                    <p>• {t("admin.tip1", "Utilisez une température basse (0.1-0.3) pour des réponses plus factuelles")}</p>
                    <p>• {t("admin.tip2", "Utilisez une température élevée (0.7-1.0) pour des réponses plus créatives")}</p>
                    <p>• {t("admin.tip3", "Le systemPrompt doit être clair et précis pour de meilleurs résultats")}</p>
                </CardContent>
            </Card>
        </div>
    )
}
