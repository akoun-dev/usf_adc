import { useParams, useNavigate } from "react-router-dom"
import { useTraining } from "../hooks/useTrainings"
import { useTranslation } from "react-i18next"
import {
    Calendar,
    MapPin,
    Video,
    Users,
    ChevronLeft,
    Download,
    FileText,
    CheckCircle2,
    Clock,
    User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { RegistrationButton } from "../components/RegistrationButton"
import { format } from "date-fns"
import { fr, enUS } from "date-fns/locale"
import { PublicLayout } from "@/features/public/components/PublicLayout"

export default function TrainingDetailsPage() {
    const { id } = useParams<{ id: string }>()
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const { data: training, isLoading } = useTraining(id || '')
    const locale = i18n.language === 'fr' ? fr : enUS

    if (isLoading) {
        return (
            <PublicLayout>
                <div className="w-full px-20 min-[1900px]:px-40 lg:px-12 md:px-10 sm:px-6 py-12">
                    <div className="max-w-7xl mx-auto space-y-6">
                        <Skeleton className="h-10 w-1/4" />
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-4">
                                <Skeleton className="h-64 w-full rounded-2xl" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                            <div className="space-y-4">
                                <Skeleton className="h-80 w-full rounded-xl" />
                                <Skeleton className="h-40 w-full rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </PublicLayout>
        )
    }

    if (!training) {
        return (
            <PublicLayout>
                <div className="text-center py-40">
                    <GraduationCap className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                    <p className="text-xl text-muted-foreground mb-4">{t('elearning.trainingNotFound', 'Formation introuvable')}</p>
                    <Button onClick={() => navigate(-1)}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        {t('common.back')}
                    </Button>
                </div>
            </PublicLayout>
        )
    }

    return (
        <PublicLayout>
            <div className="w-full px-20 min-[1900px]:px-40 lg:px-12 md:px-10 sm:px-6 py-12">
                <div className="mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    {/* Header */}
                    <div className="flex flex-col gap-4">
                        <Button
                            variant="ghost"
                            className="w-fit -ml-4"
                            onClick={() => navigate(-1)}
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            {t('common.back')}
                        </Button>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <Badge variant={training.type === 'online' ? "secondary" : "default"}>
                                        {training.type === 'online' ? <Video className="w-3 h-3 mr-1" /> : <MapPin className="w-3 h-3 mr-1" />}
                                        {t(`elearning.${training.type}`)}
                                    </Badge>
                                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                        {training.capacity} {t('elearning.places', 'places')}
                                    </Badge>
                                </div>
                                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
                                    {training.title}
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {training.image_url && (
                                <div className="rounded-2xl overflow-hidden shadow-xl border aspect-video">
                                    <img
                                        src={training.image_url}
                                        alt={training.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold border-b pb-2">{t('common.description')}</h2>
                                <div className="prose prose-slate dark:prose-invert max-w-none">
                                    {training.description}
                                </div>
                            </section>

                            {/* Associated Documents */}
                            <section className="space-y-4">
                                <h2 className="text-2xl font-bold border-b pb-2">{t('nav.documents')}</h2>
                                <div className="grid gap-3">
                                    {training.training_documents?.map((td: any) => (
                                        <Card key={td.document_id} className="hover:bg-muted/50 transition-colors">
                                            <CardContent className="flex items-center justify-between p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-primary/10 rounded">
                                                        <FileText className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{td.documents.title}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {td.documents.type?.toUpperCase()} • {td.documents.file_size}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    {(!training.training_documents || training.training_documents.length === 0) && (
                                        <p className="text-sm text-muted-foreground italic">
                                            {t('elearning.noDocuments', 'Aucun document associé')}
                                        </p>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            <Card className="sticky top-24 shadow-lg border-2 border-primary/10 overflow-hidden">
                                <CardHeader className="bg-primary/5 border-b">
                                    <CardTitle className="text-lg">{t('elearning.infoPratiques', 'Informations Pratiques')}</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-muted rounded">
                                                <Calendar className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">{t('elearning.startDate')}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {training.start_date ? format(new Date(training.start_date), 'PPP', { locale }) : 'TBD'}
                                                </p>
                                                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                                    <Clock className="w-3 h-3" />
                                                    {training.start_date ? format(new Date(training.start_date), 'p', { locale }) : ''}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-muted rounded">
                                                <User className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">{t('elearning.trainer')}</p>
                                                <p className="text-sm text-muted-foreground">{training.trainer || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-muted rounded">
                                                <MapPin className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">{t('elearning.location')}</p>
                                                <p className="text-sm text-muted-foreground">{training.location || t('elearning.online')}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <RegistrationButton
                                            trainingId={training.id}
                                            capacityFull={false}
                                        />
                                        <p className="text-[10px] text-center mt-3 text-muted-foreground uppercase tracking-widest font-semibold">
                                            {t('elearning.guaranteedSecure', 'Certification Incluse')}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Benefits/Outcomes */}
                            <Card className="bg-secondary/20 border-none">
                                <CardContent className="p-6 space-y-4">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        {t('elearning.outcomes', 'Objectifs')}
                                    </h3>
                                    <ul className="text-sm space-y-3 text-muted-foreground">
                                        <li className="flex gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                            {t('elearning.outcome1', 'Maîtrise des outils USF-ADC')}
                                        </li>
                                        <li className="flex gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                            {t('elearning.outcome2', 'Certification de fin de formation')}
                                        </li>
                                        <li className="flex gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                            {t('elearning.outcome3', 'Accès aux ressources exclusives')}
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
}
