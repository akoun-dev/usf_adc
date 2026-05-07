import { useAuth } from "@/features/auth/hooks/useAuth"
import { useUserRegistrations } from "../hooks/useRegistrations"
import { useTranslation } from "react-i18next"
import PageHero from "@/components/PageHero"
import { GraduationCap, BookOpen, CheckCircle, Clock } from "lucide-react"
import { TrainingCard } from "../components/TrainingCard"
import { Skeleton } from "@/components/ui/skeleton"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ParticipantDashboard() {
    const { user } = useAuth()
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { data: registrations, isLoading } = useUserRegistrations(user?.id || '')

    const myTrainings = registrations?.map(r => r.trainings) || []

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <PageHero 
                title={t('elearning.myTrainings')}
                description={t('elearning.participantDashboardDesc', 'Gérez vos inscriptions et accédez à vos contenus de formation.')}
                icon={<BookOpen className="h-8 w-8 text-primary" />}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Formations</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{myTrainings.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">En cours</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {registrations?.filter(r => r.status === 'confirmed').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Terminées</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {registrations?.filter(r => r.status === 'attended').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold">{t('elearning.myTrainings')}</h2>
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full rounded-xl" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myTrainings.map(training => (
                            <TrainingCard 
                                key={training.id} 
                                training={training}
                                onViewDetails={(id) => navigate(`/elearning/training/${id}`)}
                            />
                        ))}
                        {myTrainings.length === 0 && (
                            <div className="col-span-full py-20 text-center border rounded-xl bg-muted/20">
                                <p className="text-muted-foreground">{t('elearning.noRegistrations', 'Vous n\'êtes inscrit à aucune formation.')}</p>
                                <Button 
                                    variant="link" 
                                    onClick={() => navigate('/elearning')}
                                    className="mt-2"
                                >
                                    {t('elearning.exploreCatalog', 'Explorer le catalogue')}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
