import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, CalendarPlus, Plus, Trash2, FileText, Clock } from "lucide-react"
import { useSubmissionPeriods } from "../../hooks/useSubmissionPeriods"
import {
    useCreateSubmissionPeriod,
    useUpdateSubmissionPeriod,
    useDeleteSubmissionPeriod,
} from "../../hooks/useSubmissionPeriodMutations"
import { useSettings } from "../../hooks/useSettings"
import { useUpdateSetting } from "../../hooks/useUpdateSetting"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"

export default function FsuSettingsPage() {
    const navigate = useNavigate()
    const { data: periods, isLoading } = useSubmissionPeriods()
    const { data: settings } = useSettings()
    const { hasRole } = useAuth()
    const isGlobalAdmin = hasRole("super_admin")
    const createPeriod = useCreateSubmissionPeriod()
    const updatePeriod = useUpdateSubmissionPeriod()
    const deletePeriod = useDeleteSubmissionPeriod()
    const updateSetting = useUpdateSetting()
    const { toast } = useToast()
    const { t, i18n } = useTranslation()
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({
        label: "",
        start_date: "",
        end_date: "",
        reminder_days_before: 7,
    })

    const locale =
        i18n.language === "pt"
            ? "pt-PT"
            : i18n.language === "en"
              ? "en-US"
              : "fr-FR"
    const fsuSettings = settings?.filter(s => s.category === "fsu") ?? []

    const handleCreatePeriod = () => {
        createPeriod.mutate(
            {
                ...form,
                is_active: true,
                reminder_days_before: form.reminder_days_before,
            },
            {
                onSuccess: () => {
                    setOpen(false)
                    toast({ title: t("admin.periodCreated") })
                },
                onError: () =>
                    toast({ title: t("common.error"), variant: "destructive" }),
            }
        )
    }

    const toggleActive = (id: string, isActive: boolean) => {
        updatePeriod.mutate(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            { id, is_active: isActive } as any,
            {
                onSuccess: () =>
                    toast({
                        title: isActive
                            ? t("admin.periodActivated")
                            : t("admin.periodDeactivated"),
                    }),
                onError: () =>
                    toast({ title: t("common.error"), variant: "destructive" }),
            }
        )
    }

    const handleDeletePeriod = (id: string) => {
        if (!confirm(t("admin.deletePeriodConfirm"))) return
        deletePeriod.mutate(id, {
            onSuccess: () => toast({ title: t("admin.periodDeleted") }),
            onError: () =>
                toast({ title: t("common.error"), variant: "destructive" }),
        })
    }

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00833d] border-t-transparent" />
            </div>
        )
    }

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
                        {t("admin.fsuSettings", "Paramètres FSU")}
                    </h1>
                    <p className="text-muted-foreground">
                        {t("admin.fsuSettingsDesc", "Configurez les périodes de soumission et les paramètres FSU")}
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("admin.totalPeriods", "Total des périodes")}
                        </CardTitle>
                        <CalendarPlus className="h-4 w-4 text-[#00833d]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{periods?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {periods?.filter(p => p.is_active).length || 0} {t("admin.active", "actives")}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("admin.currentPeriod", "Période en cours")}
                        </CardTitle>
                        <FileText className="h-4 w-4 text-[#ffe700]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {periods?.find(p => p.is_active)?.label || "-"}
                        </div>
                        <p className="text-xs text-muted-foreground">{t("admin.active", "Active")}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("admin.reminderDays", "Jours de rappel")}
                        </CardTitle>
                        <Clock className="h-4 w-4 text-[#00833d]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {periods?.find(p => p.is_active)?.reminder_days_before || 7}
                        </div>
                        <p className="text-xs text-muted-foreground">{t("admin.beforeDeadline", "avant deadline")}</p>
                    </CardContent>
                </Card>
            </div>

            {/* FSU Settings */}
            {isGlobalAdmin && fsuSettings.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00833d]/20">
                                <FileText className="h-4 w-4 text-[#00833d]" />
                            </div>
                            {t("admin.fsuConfiguration", "Configuration FSU")}
                        </CardTitle>
                        <CardDescription>
                            {t("admin.fsuConfigurationDesc", "Paramètres globaux pour les soumissions FSU")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {fsuSettings.map(s => {
                            if (typeof s.value === "boolean") {
                                return (
                                    <div
                                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-[#00833d]/5 transition-colors"
                                        key={s.id}
                                    >
                                        <Label className="cursor-pointer">{s.label}</Label>
                                        <Switch
                                            checked={s.value}
                                            onCheckedChange={checked =>
                                                updateSetting.mutate(
                                                    {
                                                        id: s.id,
                                                        value: checked,
                                                    },
                                                    {
                                                        onSuccess: () =>
                                                            toast({
                                                                title: t(
                                                                    "admin.settingUpdated",
                                                                    {
                                                                        label: s.label,
                                                                    }
                                                                ),
                                                            }),
                                                    }
                                                )
                                            }
                                        />
                                    </div>
                                )
                            }
                            return (
                                <div
                                    className="flex items-center gap-4 p-3 border rounded-lg"
                                    key={s.id}
                                >
                                    <Label className="min-w-48 cursor-pointer">
                                        {s.label}
                                    </Label>
                                    <Input
                                        type="number"
                                        defaultValue={s.value as number}
                                        className="w-24"
                                        onBlur={e =>
                                            updateSetting.mutate(
                                                {
                                                    id: s.id,
                                                    value: Number(
                                                        e.target.value
                                                    ),
                                                },
                                                {
                                                    onSuccess: () =>
                                                        toast({
                                                            title: t(
                                                                "admin.settingUpdated",
                                                                {
                                                                    label: s.label,
                                                                }
                                                            ),
                                                        }),
                                                }
                                            )
                                        }
                                    />
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
            )}

            {/* Submission Periods */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarPlus className="h-5 w-5 text-[#00833d]" />
                            {t("admin.submissionPeriods", "Périodes de soumission")}
                        </CardTitle>
                        <CardDescription>
                            {t("admin.submissionPeriodsDesc", "Gérez les périodes de soumission FSU")}
                        </CardDescription>
                    </div>
                    {isGlobalAdmin && (
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#00833d] hover:bg-[#00833d]/90">
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t("admin.newPeriod")}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {t("admin.createPeriod")}
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 pt-2">
                                    <div className="space-y-1">
                                        <Label>{t("admin.periodLabel")}</Label>
                                        <Input
                                            value={form.label}
                                            onChange={e =>
                                                setForm({
                                                    ...form,
                                                    label: e.target.value,
                                                })
                                            }
                                            placeholder={t(
                                                "admin.periodLabelPlaceholder"
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label>
                                                {t("admin.startDate")}
                                            </Label>
                                            <Input
                                                type="date"
                                                value={form.start_date}
                                                onChange={e =>
                                                    setForm({
                                                        ...form,
                                                        start_date:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>{t("admin.endDate")}</Label>
                                            <Input
                                                type="date"
                                                value={form.end_date}
                                                onChange={e =>
                                                    setForm({
                                                        ...form,
                                                        end_date:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>{t("admin.reminderDays")}</Label>
                                        <Input
                                            type="number"
                                            value={form.reminder_days_before}
                                            onChange={e =>
                                                setForm({
                                                    ...form,
                                                    reminder_days_before:
                                                        Number(e.target.value),
                                                })
                                            }
                                        />
                                    </div>
                                    <Button
                                        className="w-full bg-[#00833d] hover:bg-[#00833d]/90"
                                        onClick={handleCreatePeriod}
                                        disabled={
                                            !form.label ||
                                            !form.start_date ||
                                            !form.end_date
                                        }
                                    >
                                        {t("common.create")}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </CardHeader>
                <CardContent>
                    {!periods || periods.length === 0 ? (
                        <div className="text-center py-8">
                            <CalendarPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-sm text-muted-foreground">
                                {t("admin.noPeriods")}
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t("admin.label")}</TableHead>
                                    <TableHead>{t("admin.start")}</TableHead>
                                    <TableHead>{t("admin.end")}</TableHead>
                                    <TableHead>{t("admin.reminder")}</TableHead>
                                    <TableHead>{t("users.status")}</TableHead>
                                    {isGlobalAdmin && (
                                        <TableHead className="w-20">
                                            {t("common.actions")}
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {periods.map(p => (
                                    <TableRow key={p.id} className="hover:bg-[#00833d]/5">
                                        <TableCell className="font-medium">
                                            {p.label}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                p.start_date
                                            ).toLocaleDateString(locale)}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                p.end_date
                                            ).toLocaleDateString(locale)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-[#00833d]/50 text-[#00833d]">
                                                {p.reminder_days_before} {t("admin.days", "jours")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {isGlobalAdmin ? (
                                                <Switch
                                                    checked={p.is_active}
                                                    onCheckedChange={v =>
                                                        toggleActive(p.id, v)
                                                    }
                                                />
                                            ) : (
                                                <Badge
                                                    variant={
                                                        p.is_active
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                    className={
                                                        p.is_active
                                                            ? "bg-[#00833d] text-white"
                                                            : ""
                                                    }
                                                >
                                                    {p.is_active
                                                        ? t("admin.active")
                                                        : t("admin.inactive")}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        {isGlobalAdmin && (
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleDeletePeriod(p.id)
                                                    }
                                                    className="hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
