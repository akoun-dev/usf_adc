import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useCreateProject } from '../hooks/useContentManagement'
import { useCountries } from '../hooks/useCountries'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Save, X, FileText, Target, Clock, MapPin, Users, Paperclip, PieChart, History } from 'lucide-react'
import { toast } from 'sonner'
import { ProjectDocumentsTab } from '../components/ProjectDocumentsTab'
import { ProjectActorsTab } from '../components/ProjectActorsTab'
import { ProjectMapTab } from '../components/ProjectMapTab'

interface ProjectFormData {
  title: string
  description: string
  country_id: string
  status: string
  region: string
  budget?: number
  start_date?: string
  end_date?: string
  objectives?: string
  indicators?: string
  latitude?: number
  longitude?: number
}

const PROJECT_STATUSES = [
  { value: 'planned', label: 'Planifié' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'completed', label: 'Terminé' },
  { value: 'suspended', label: 'Suspendu' }
]

const REGIONS = ['CEDEAO', 'SADC', 'EAC', 'CEEAC', 'UMA', 'COMESA', 'CEMAC', 'IGAD']

export default function CreateProjectPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: countries = [] } = useCountries()
  const createProject = useCreateProject()
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProjectFormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  const formData = watch()

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setIsSubmitting(true)
      const createdProject = await createProject.mutateAsync(data)
      toast.success(t('admin.projectCreated', 'Projet créé avec succès'))
      navigate(`/admin/projects/${createdProject.id}`)
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error(t('admin.errorCreatingProject', 'Erreur lors de la création du projet'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (confirm(t('admin.confirmCancel', 'Êtes-vous sûr de vouloir annuler ?'))) {
      navigate('/admin/projects')
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/projects')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back', 'Retour')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.createProject', 'Créer un nouveau projet')}</CardTitle>
          <CardDescription>{t('admin.createProjectDesc', 'Remplissez toutes les informations du projet')}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                <TabsTrigger value="basic">{t('project.basicInfo', 'Informations de base')}</TabsTrigger>
                <TabsTrigger value="details">{t('project.details', 'Détails')}</TabsTrigger>
                <TabsTrigger value="documents">{t('project.documents', 'Documents')}</TabsTrigger>
                <TabsTrigger value="actors">{t('project.actors', 'Acteurs')}</TabsTrigger>
                <TabsTrigger value="map">{t('project.map', 'Carte')}</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">{t('project.title', 'Titre du projet')}</Label>
                    <Input
                      id="title"
                      {...register('title', { required: t('common.requiredField', 'Champ obligatoire') })}
                      placeholder={t('project.titlePlaceholder', 'Titre du projet')}
                    />
                    {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country_id">{t('project.country', 'Pays')}</Label>
                    <Select onValueChange={(v) => setValue('country_id', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('project.selectCountry', 'Sélectionner un pays')} />
                      </SelectTrigger>
                      <SelectContent>
                        {countries?.map((c: any) => (
                          <SelectItem key={c.id} value={c.id}>{c.name_fr}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 mt-6">
                  <Label htmlFor="description">{t('project.description', 'Description')}</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    rows={5}
                    placeholder={t('project.descriptionPlaceholder', 'Description détaillée du projet')}
                  />
                </div>
              </TabsContent>

              <TabsContent value="details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="status">{t('project.status', 'Statut')}</Label>
                    <Select onValueChange={(v) => setValue('status', v)} defaultValue="planned">
                      <SelectTrigger>
                        <SelectValue placeholder={t('project.selectStatus', 'Sélectionner un statut')} />
                      </SelectTrigger>
                      <SelectContent>
                        {PROJECT_STATUSES.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region">{t('project.region', 'Région')}</Label>
                    <Select onValueChange={(v) => setValue('region', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('project.selectRegion', 'Sélectionner une région')} />
                      </SelectTrigger>
                      <SelectContent>
                        {REGIONS.map(r => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="budget">{t('project.budget', 'Budget')}</Label>
                    <Input
                      id="budget"
                      type="number"
                      {...register('budget')}
                      placeholder={t('project.budgetPlaceholder', 'Montant du budget')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="start_date">{t('project.startDate', 'Date de début')}</Label>
                    <Input
                      id="start_date"
                      type="date"
                      {...register('start_date')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end_date">{t('project.endDate', 'Date de fin')}</Label>
                    <Input
                      id="end_date"
                      type="date"
                      {...register('end_date')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="objectives">{t('project.objectives', 'Objectifs')}</Label>
                    <Textarea
                      id="objectives"
                      {...register('objectives')}
                      rows={4}
                      placeholder={t('project.objectivesPlaceholder', 'Objectifs du projet')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="indicators">{t('project.indicators', 'Indicateurs')}</Label>
                    <Textarea
                      id="indicators"
                      {...register('indicators')}
                      rows={4}
                      placeholder={t('project.indicatorsPlaceholder', 'Indicateurs de performance')}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents">
                <ProjectDocumentsTab projectId="" />
              </TabsContent>

              <TabsContent value="actors">
                <ProjectActorsTab projectId="" />
              </TabsContent>

              <TabsContent value="map">
                <ProjectMapTab
                  project={formData}
                  onLocationChange={(lat, lng) => {
                    setValue('latitude', lat)
                    setValue('longitude', lng)
                  }}
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                {t('common.cancel', 'Annuler')}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || createProject.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? t('common.saving', 'Enregistrement...') : t('common.save', 'Enregistrer')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}