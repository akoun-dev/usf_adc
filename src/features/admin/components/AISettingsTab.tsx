import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useSettings } from "../hooks/useSettings"
import { useUpdateSetting } from "../hooks/useUpdateSetting"
import { Bot, Save, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

interface AISettings {
    provider: "openai" | "mistral" | "anthropic" | "other" | "libretranslate"
    model: string
    apiKey: string
    systemPrompt: string
    temperature: number
    localUrl?: string
}

export function AISettingsTab() {
    const { t } = useTranslation()
    const { data: settings } = useSettings()
    const { mutate: updateSetting, isPending } = useUpdateSetting()

    const aiSettingEntry = settings?.find(s => s.key === "ai_settings")
    const currentSettings = (aiSettingEntry?.value as AISettings) || {
        provider: "openai",
        model: "gpt-4o",
        apiKey: "",
        systemPrompt:
            "Vous êtes l'Assistant FSU, un expert en télécommunications et en gestion de contenu pour la plateforme USF-ADC.",
        temperature: 0.7,
        localUrl: "http://localhost:5000",
    }

    const [form, setForm] = useState<AISettings>(currentSettings)

    const handleSave = () => {
        updateSetting(
            {
                key: "ai_settings",
                value: form,
                label: t(
                    "admin.aiSettingsLabel",
                    "Configuration de l'Assistant IA"
                ),
                category: "ai",
            },
            {
                onSuccess: () => {
                    toast.success(
                        t(
                            "common.saveSuccess",
                            "Configuration enregistrée avec succès"
                        )
                    )
                },
                onError: () => {
                    toast.error(
                        t("common.saveError", "Erreur lors de l'enregistrement")
                    )
                },
            }
        )
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-primary" />
                        {t(
                            "admin.aiConfiguration",
                            "Configuration de l'Assistant IA"
                        )}
                    </CardTitle>
                    <CardDescription>
                        {t(
                            "admin.aiConfigDesc",
                            "Configurez le modèle de langage et la clé API pour l'Assistant FSU."
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="provider">
                                {t("admin.aiProvider", "Fournisseur d'IA")}
                            </Label>
                            <Select
                                value={form.provider}
                                onValueChange={(val: any) =>
                                    setForm(prev => ({
                                        ...prev,
                                        provider: val,
                                    }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez un fournisseur" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="openai">
                                        OpenAI
                                    </SelectItem>
                                    <SelectItem value="mistral">
                                        Mistral AI
                                    </SelectItem>
                                    <SelectItem value="anthropic">
                                        Anthropic (Claude)
                                    </SelectItem>
                                    <SelectItem value="libretranslate">
                                        LibreTranslate (Local)
                                    </SelectItem>
                                    <SelectItem value="other">Autre</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="model">
                                {t("admin.aiModel", "Modèle")}
                            </Label>
                            <Input
                                id="model"
                                value={form.model}
                                onChange={e =>
                                    setForm(prev => ({
                                        ...prev,
                                        model: e.target.value,
                                    }))
                                }
                                placeholder="ex: gpt-4o, mistral-large"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="apiKey"
                            className="flex items-center gap-2"
                        >
                            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                            {t("admin.aiApiKey", "Clé API")}
                        </Label>
                        <Input
                            id="apiKey"
                            type="password"
                            value={form.apiKey}
                            onChange={e =>
                                setForm(prev => ({
                                    ...prev,
                                    apiKey: e.target.value,
                                }))
                            }
                            placeholder={form.provider === "libretranslate" ? "Facultatif" : "sk-..."}
                        />
                    </div>

                    {form.provider === "libretranslate" && (
                        <div className="space-y-2">
                            <Label htmlFor="localUrl">
                                {t("admin.aiLocalUrl", "URL de l'instance locale")}
                            </Label>
                            <Input
                                id="localUrl"
                                value={form.localUrl}
                                onChange={e => setForm(prev => ({ ...prev, localUrl: e.target.value }))}
                                placeholder="http://localhost:5001"
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="systemPrompt">
                            {t(
                                "admin.aiSystemPrompt",
                                "Instruction Système (System Prompt)"
                            )}
                        </Label>
                        <Textarea
                            id="systemPrompt"
                            rows={4}
                            value={form.systemPrompt}
                            onChange={e =>
                                setForm(prev => ({
                                    ...prev,
                                    systemPrompt: e.target.value,
                                }))
                            }
                            placeholder="Définissez le rôle et la personnalité de l'assistant..."
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button
                            onClick={handleSave}
                            disabled={isPending}
                            className="gap-2"
                        >
                            <Save className="h-4 w-4" />
                            {isPending
                                ? t("common.saving", "Enregistrement...")
                                : t(
                                    "common.save",
                                    "Enregistrer la configuration"
                                )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
