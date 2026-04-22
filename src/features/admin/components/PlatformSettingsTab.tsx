import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Save, Search } from "lucide-react"
import { useSettings } from "../hooks/useSettings"
import { useUpdateSetting } from "../hooks/useUpdateSetting"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"
import type { PlatformSetting } from "../types"

export function PlatformSettingsTab() {
    const { data: settings, isLoading } = useSettings()
    const updateSetting = useUpdateSetting()
    const { toast } = useToast()
    const { t } = useTranslation()
    const [localValues, setLocalValues] = useState<Record<string, unknown>>({})
    const [searchQuery, setSearchQuery] = useState("")

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        )
    }

    const generalSettings =
        settings?.filter(
            s =>
                s.category === "general" &&
                (s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.key.toLowerCase().includes(searchQuery.toLowerCase()))
        ) ?? []

    const getValue = (setting: PlatformSetting) =>
        localValues[setting.id] !== undefined
            ? localValues[setting.id]
            : setting.value

    const handleChange = (id: string, value: unknown) => {
        setLocalValues(prev => ({ ...prev, [id]: value }))
    }

    const handleSave = (setting: PlatformSetting) => {
        const value = getValue(setting)
        updateSetting.mutate(
            {
                id: setting.id,
                value: value as import("@/integrations/supabase/types").Json,
            },
            {
                onSuccess: () => {
                    setLocalValues(prev => {
                        const next = { ...prev }
                        delete next[setting.id]
                        return next
                    })
                    toast({
                        title: t("admin.settingUpdated", {
                            label: setting.label,
                        }),
                    })
                },
                onError: () =>
                    toast({
                        title: t("admin.saveError"),
                        variant: "destructive",
                    }),
            }
        )
    }

    const renderField = (setting: PlatformSetting) => {
        const val = getValue(setting)
        const isDirty = localValues[setting.id] !== undefined

        if (typeof setting.value === "boolean") {
            return (
                <div
                    className="flex items-center justify-between"
                    key={setting.id}
                >
                    <Label>{setting.label}</Label>
                    <Switch
                        checked={val as boolean}
                        onCheckedChange={checked => {
                            updateSetting.mutate(
                                { id: setting.id, value: checked },
                                {
                                    onSuccess: () =>
                                        toast({
                                            title: t("admin.settingUpdated", {
                                                label: setting.label,
                                            }),
                                        }),
                                    onError: () =>
                                        toast({
                                            title: t("common.error"),
                                            variant: "destructive",
                                        }),
                                }
                            )
                        }}
                    />
                </div>
            )
        }

        const isLongText = typeof val === "string" && val.length > 60

        return (
            <div className="space-y-2" key={setting.id}>
                <Label>{setting.label}</Label>
                <div className="flex gap-2">
                    {isLongText ? (
                        <Textarea
                            value={val as string}
                            onChange={e =>
                                handleChange(setting.id, e.target.value)
                            }
                            className="flex-1"
                        />
                    ) : (
                        <Input
                            value={
                                typeof val === "number"
                                    ? val
                                    : String(val ?? "")
                            }
                            type={
                                typeof setting.value === "number"
                                    ? "number"
                                    : "text"
                            }
                            onChange={e =>
                                handleChange(
                                    setting.id,
                                    typeof setting.value === "number"
                                        ? Number(e.target.value)
                                        : e.target.value
                                )
                            }
                            className="flex-1"
                        />
                    )}
                    {isDirty && (
                        <Button
                            size="icon"
                            onClick={() => handleSave(setting)}
                            disabled={updateSetting.isPending}
                        >
                            <Save className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("admin.generalSettings")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {generalSettings.map(renderField)}
            </CardContent>
        </Card>
    )
}
