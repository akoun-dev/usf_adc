import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { UserPlus } from "lucide-react"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useCreateInvitation } from "../hooks/useCreateInvitation"
import { useCountries } from "@/features/admin/hooks/useCountries"
import type { AppRole } from "@/core/constants/roles"
import { useTranslation } from "react-i18next"

export function InviteUserForm() {
    const { t } = useTranslation()
    const { user, hasRole } = useAuth()
    const { mutate, isPending } = useCreateInvitation()
    const { data: countries } = useCountries()
    const [open, setOpen] = useState(false)
    const [email, setEmail] = useState("")
    const [role, setRole] = useState<AppRole>("point_focal")
    const [countryId, setCountryId] = useState<string>("")

    const isGlobalAdmin = hasRole("global_admin")
    const allowedRoles: AppRole[] = isGlobalAdmin
        ? ["point_focal", "country_admin", "global_admin"]
        : ["point_focal"]

    const roleLabels: Record<AppRole, string> = {
        point_focal: t("invitations.roles.point_focal", "Point focal"),
        country_admin: t("invitations.roles.country_admin", "Admin pays"),
        global_admin: t("invitations.roles.global_admin", "Admin global"),
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return
        mutate(
            { email, role, country_id: countryId || null, invited_by: user.id },
            {
                onSuccess: () => {
                    setOpen(false)
                    setEmail("")
                    setRole("point_focal")
                    setCountryId("")
                },
            }
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    {t("invitations.invite")}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("invitations.inviteUser")}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>{t("auth.email")}</Label>
                        <Input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="user@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>{t("invitations.role")}</Label>
                        <Select
                            value={role}
                            onValueChange={v => setRole(v as AppRole)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {allowedRoles.map(r => (
                                    <SelectItem key={r} value={r}>
                                        {roleLabels[r]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>{t("users.country")}</Label>
                        <Select value={countryId} onValueChange={setCountryId}>
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={t("invitations.selectCountry")}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {(countries || []).map(c => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.code_iso} — {c.name_fr}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending
                            ? t("common.loading")
                            : t("invitations.sendInvitation")}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
