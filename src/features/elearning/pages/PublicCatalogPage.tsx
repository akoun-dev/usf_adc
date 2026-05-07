import { useState } from "react"
import { useTrainings } from "../hooks/useTrainings"
import { TrainingCard } from "../components/TrainingCard"
import { TrainingCalendar } from "../components/TrainingCalendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { 
    Search, 
    LayoutGrid, 
    Calendar as CalendarIcon, 
    GraduationCap,
    Filter,
    BookOpen,
    Video,
    Users
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Skeleton } from "@/components/ui/skeleton"
import { useNavigate } from "react-router-dom"
import { PublicLayout } from "@/features/public/components/PublicLayout"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import bgHeader from '@/assets/bg-header.jpg'

export default function PublicCatalogPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const { data: trainings, isLoading, error } = useTrainings('published')

    const filteredTrainings = trainings?.filter(training => {
        const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            training.description?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = typeFilter === "all" || training.type === typeFilter
        return matchesSearch && matchesType
    })

    const catalogBenefits = [
        {
            icon: BookOpen,
            titleKey: "elearning.benefits.resources.title",
            defaultTitle: "Ressources riches",
            descKey: "elearning.benefits.resources.desc",
            defaultDesc: "Accédez à une bibliothèque complète de supports pédagogiques."
        },
        {
            icon: Video,
            titleKey: "elearning.benefits.interactive.title",
            defaultTitle: "Sessions interactives",
            descKey: "elearning.benefits.interactive.desc",
            defaultDesc: "Participez à des webinaires et ateliers en direct."
        },
        {
            icon: Users,
            titleKey: "elearning.benefits.experts.title",
            defaultTitle: "Experts certifiés",
            descKey: "elearning.benefits.experts.desc",
            defaultDesc: "Apprenez auprès des meilleurs experts du domaine."
        }
    ]

    // Convert trainings to events for the calendar
    const events = trainings?.map(t => ({
        id: t.id,
        training_id: t.id,
        title: t.title,
        description: t.description,
        start_date: t.start_date || new Date().toISOString(),
        end_date: t.end_date || new Date().toISOString(),
        type: t.type,
        created_at: t.created_at
    })) || []

    return (
        <PublicLayout>
            <div className="space-y-12 relative bg-gray-50">
                {/* Hero */}
                <div
                    className="relative bg-cover bg-center bg-no-repeat pb-5 !m-0 border-b"
                    style={{ backgroundImage: `url(${bgHeader})` }}
                >
                    <div className="absolute inset-0" />
                    <div className="relative text-center max-w-4xl mx-auto space-y-6 h-56 flex flex-col items-center justify-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-primary">
                            {t('elearning.catalog')}
                        </h1>
                        <p className="text-xl text-base/80 leading-relaxed !mt-2">
                            {t('elearning.catalogDesc', 'Découvrez nos parcours de formation et webinaires pour renforcer vos compétences.')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full px-20 min-[1900px]:px-40 lg:px-12 md:px-10 sm:px-6 py-10">
                
                {/* Benefits Section */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {catalogBenefits.map((benefit, index) => (
                        <Card key={index} className="border-2 hover:border-primary/20 transition-colors">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <benefit.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">{t(benefit.titleKey, benefit.defaultTitle)}</h3>
                                        <p className="text-sm text-muted-foreground">{t(benefit.descKey, benefit.defaultDesc)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filters & Tabs */}
                <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder={t('common.search')}
                                className="pl-10 h-11"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-full md:w-48 h-11">
                                <SelectValue placeholder={t('elearning.filterByType', 'Filtrer par type')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('common.all', 'Tous les types')}</SelectItem>
                                <SelectItem value="online">{t('elearning.online', 'En ligne')}</SelectItem>
                                <SelectItem value="onsite">{t('elearning.onsite', 'Présentiel')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Tabs defaultValue="grid" className="w-full md:w-auto">
                        <TabsList className="grid w-full grid-cols-2 h-11 p-1">
                            <TabsTrigger value="grid" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                                <LayoutGrid className="h-4 w-4 mr-2" />
                                {t('common.grid', 'Grille')}
                            </TabsTrigger>
                            <TabsTrigger value="calendar" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                {t('elearning.calendar')}
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Content Section */}
                <Tabs defaultValue="grid" className="w-full">
                    <TabsContent value="grid" className="mt-0 outline-none">
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <div key={i} className="space-y-4">
                                        <Skeleton className="h-48 w-full rounded-xl" />
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-20 bg-destructive/5 rounded-xl border border-destructive/20">
                                <Filter className="h-12 w-12 mx-auto mb-4 text-destructive opacity-50" />
                                <h3 className="text-xl font-bold mb-2">{t('common.error')}</h3>
                                <p className="text-muted-foreground mb-4">{t('elearning.loadError', 'Erreur lors du chargement des formations')}</p>
                                <Button onClick={() => window.location.reload()}>{t('common.retry')}</Button>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">{t('elearning.availableTrainings', 'Formations disponibles')}</h2>
                                    <Badge variant="secondary" className="px-4 py-1">
                                        {filteredTrainings?.length} {t('elearning.trainings', 'formations')}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredTrainings?.map(training => (
                                        <TrainingCard 
                                            key={training.id} 
                                            training={training}
                                            onViewDetails={(id) => navigate(`/elearning/training/${id}`)}
                                        />
                                    ))}
                                    {filteredTrainings?.length === 0 && (
                                        <div className="col-span-full py-20 text-center text-muted-foreground bg-white border-2 border-dashed rounded-2xl">
                                            <Filter className="h-12 w-12 mx-auto mb-4 opacity-10" />
                                            <p className="text-lg font-medium">{t('elearning.noTrainings', 'Aucune formation ne correspond à vos critères.')}</p>
                                            <Button variant="link" onClick={() => { setSearchTerm(""); setTypeFilter("all"); }}>
                                                {t('common.resetFilters', 'Réinitialiser les filtres')}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="calendar" className="mt-0 outline-none">
                        <Card className="border-2 shadow-none overflow-hidden">
                            <CardContent className="p-0">
                                <TrainingCalendar 
                                    events={events as any} 
                                    onEventClick={(e) => navigate(`/elearning/training/${e.training_id}`)}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </PublicLayout>
    )
}
