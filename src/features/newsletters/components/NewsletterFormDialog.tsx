import { useForm } from "react-hook-form"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
    useCreateNewsletter,
    useUpdateNewsletter,
} from "../hooks/useNewsletterMutations"
import type { Newsletter, NewsletterInput } from "../types"
import { useTranslation } from "react-i18next"
import type { Database } from "@/integrations/supabase/types"

type AppRole = Database["public"]["Enums"]["app_role"]

const ALL_ROLES: AppRole[] = ["point_focal", "country_admin", "super_admin"]

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    newsletter?: Newsletter | null
}

export function NewsletterFormDialog({
    open,
    onOpenChange,
    newsletter,
}: Props) {
    const { t } = useTranslation()
    const createMutation = useCreateNewsletter()
    const updateMutation = useUpdateNewsletter()
    const isEdit = !!newsletter

    const { register, handleSubmit, watch, setValue, reset } =
        useForm<NewsletterInput>({
            defaultValues: newsletter
                ? {
                      title: newsletter.title,
                      summary: newsletter.summary ?? "",
                      content: newsletter.content,
                      target_roles: newsletter.target_roles,
                  }
                : {
                      title: "",
                      summary: "",
                      content: "",
                      target_roles: [
                          "point_focal",
                          "country_admin",
                          "super_admin",
                      ],
                  },
        })

    const targetRoles = watch("target_roles") ?? []

    const toggleRole = (role: AppRole) => {
        const current = targetRoles
        if (current.includes(role)) {
            setValue(
                "target_roles",
                current.filter(r => r !== role)
            )
        } else {
            setValue("target_roles", [...current, role])
        }
    }

    const onSubmit = async (data: NewsletterInput) => {
        if (isEdit && newsletter) {
            await updateMutation.mutateAsync({ id: newsletter.id, input: data })
        } else {
            await createMutation.mutateAsync(data)
        }
        reset()
        onOpenChange(false)
    }

    const isPending = createMutation.isPending || updateMutation.isPending

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit
                            ? t("newsletters.formEditTitle")
                            : t("newsletters.formNewTitle")}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="nl-title">
                            {t("newsletters.formTitle")} *
                        </Label>
                        <Input
                            id="nl-title"
                            {...register("title", { required: true })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="nl-summary">
                            {t("newsletters.formSummary")}
                        </Label>
                        <Input
                            id="nl-summary"
                            {...register("summary")}
                            placeholder={t(
                                "newsletters.formSummaryPlaceholder"
                            )}
                        />
                    </div>
                    <div>
                        <Label htmlFor="nl-content">
                            {t("newsletters.formContent")} *
                        </Label>
                        <Textarea
                            id="nl-content"
                            {...register("content", { required: true })}
                            rows={8}
                        />
                    </div>
                    <div>
                        <Label>{t("newsletters.formTargetRoles")} *</Label>
                        <div className="flex flex-wrap gap-3 mt-2">
                            {ALL_ROLES.map(role => (
                                <label
                                    key={role}
                                    className="flex items-center gap-2 text-sm cursor-pointer"
                                >
                                    <Checkbox
                                        checked={targetRoles.includes(role)}
                                        onCheckedChange={() => toggleRole(role)}
                                    />
                                    {t(`invitations.roles.${role}`)}
                                </label>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending
                                ? t("newsletters.formSaving")
                                : isEdit
                                  ? t("newsletters.formUpdate")
                                  : t("newsletters.formCreate")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
