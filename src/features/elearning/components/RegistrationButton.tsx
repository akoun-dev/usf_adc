import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useRegister, useUserRegistrations } from "../hooks/useRegistrations"
import { useTranslation } from "react-i18next"
import { Loader2, CheckCircle } from "lucide-react"

interface RegistrationButtonProps {
    trainingId: string;
    capacityFull?: boolean;
}

export function RegistrationButton({ trainingId, capacityFull }: RegistrationButtonProps) {
    const { user } = useAuth()
    const { t } = useTranslation()
    const { data: registrations, isLoading: isLoadingRegs } = useUserRegistrations(user?.id || '')
    const { mutate: register, isPending } = useRegister(trainingId, user?.id || '')

    const isRegistered = registrations?.some(r => r.training_id === trainingId)
    const registration = registrations?.find(r => r.training_id === trainingId)

    if (!user) return null

    if (isLoadingRegs) {
        return (
            <Button disabled variant="outline" className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('common.loading')}
            </Button>
        )
    }

    if (isRegistered) {
        return (
            <Button disabled variant="outline" className="w-full bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="mr-2 h-4 w-4" />
                {t(`elearning.${registration?.status || 'confirmed'}`)}
            </Button>
        )
    }

    return (
        <Button 
            className="w-full" 
            disabled={isPending || capacityFull}
            onClick={() => register()}
        >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {capacityFull ? t('elearning.capacityFull', 'Complet') : t('elearning.register')}
        </Button>
    )
}
