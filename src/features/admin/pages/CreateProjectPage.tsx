import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useCreateProject } from '../hooks/useContentManagement'
import { useCountries } from '../hooks/useCountries'
import { translateToFourLang } from '../services/translate.service'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Save, X, FileText, Target, Clock, MapPin, Users, Paperclip, PieChart, History, Languages } from 'lucide-react'
import { toast } from 'sonner'
import { ProjectDocumentsTab } from '../components/ProjectDocumentsTab'
import { ProjectActorsTab } from '../components/ProjectActorsTab'
import { ProjectMapTab } from '../components/ProjectMapTab'

interface ProjectFormData {
  title: Record<string, string>
  description: Record<string, string>
  country_id: string
  status: 'planned' | 'in_progress' | 'completed' | 'suspended'
  region: Record<string, string>
  beneficiaries: Record<string, string>
  thematic: Record<string, string>
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
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProjectFormData>({
    defaultValues: {
      title: { fr: '', en: '', pt: '', ar: '' },
      description: { fr: '', en: '', pt: '', ar: '' },
      region: { fr: '', en: '', pt: '', ar: '' },
      beneficiaries: { fr: '', en: '', pt: '', ar: '' },
      thematic: { fr: '', en: '', pt: '', ar: '' },
      status: 'planned'
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [currentLang, setCurrentLang] = useState('fr')
  const [activeTab, setActiveTab] = useState('basic')
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  useEffect(() => {
    const checkUserRoleAndCountry = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        setUserProfile(profile)

        // Fetch roles
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
        
        const superAdminStatus = roles?.some(r => r.role === 'super_admin') || false
        setIsSuperAdmin(superAdminStatus)

        if (!superAdminStatus && profile?.country_id) {
          setValue('country_id', profile.country_id)
        }
      }
    }
    checkUserRoleAndCountry()
  }, [setValue])

  const formData = watch()

  const handleTranslate = async () => {
    try {
      setIsTranslating(true)
      toast.info(t('admin.translating', 'Traduction en cours...'))

      if (formData.title?.[currentLang]) {
        const translatedTitle = await translateToFourLang(currentLang, formData.title[currentLang])
        setValue('title', translatedTitle)
      }
      if (formData.description?.[currentLang]) {
        const translatedDesc = await translateToFourLang(currentLang, formData.description[currentLang])
        setValue('description', translatedDesc)
      }
      if (formData.region?.[currentLang]) {
        const translatedRegion = await translateToFourLang(currentLang, formData.region[currentLang])
        setValue('region', translatedRegion)
      }
      if (formData.beneficiaries?.[currentLang]) {
        const translatedBenef = await translateToFourLang(currentLang, formData.beneficiaries[currentLang])
        setValue('beneficiaries', translatedBenef)
      }
      if (formData.thematic?.[currentLang]) {
        const translatedThem = await translateToFourLang(currentLang, formData.thematic[currentLang])
        setValue('thematic', translatedThem)
      }

      toast.success(t('admin.translationSuccess', 'Traduction terminée'))
    } catch (error) {
      console.error('Translation error:', error)
      toast.error(t('admin.translationError', 'Erreur lors de la traduction'))
    } finally {
      setIsTranslating(false)
    }
  }

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setIsSubmitting(true)
      const createdProject = await createProject.mutateAsync(data) as any
      toast.success(t('admin.projectCreated', 'Projet créé avec succès'))
      if (createdProject && createdProject.id) {
        navigate(`/admin/projects/${createdProject.id}`)
      } else {
        navigate('/admin/projects')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error(t('admin.errorCreatingProject', 'Erreur lors de la création du projet'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/admin/projects')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{t('admin.createProject', 'Nouveau Projet')}</h1>
            <p className="text-muted-foreground">{t('admin.createProjectDesc', 'Créer un nouveau projet USF')}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/admin/projects')}>{t('common.cancel', 'Annuler')}</Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t('common.saving', 'Enregistrement...')}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {t('common.save', 'Enregistrer')}
              </span>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t('admin.basicInfo', 'Informations')}
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            {t('admin.projectDetails', 'Détails')}
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {t('admin.location', 'Localisation')}
          </TabsTrigger>
          <TabsTrigger value="actors" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('admin.actors', 'Acteurs')}
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardContent className="pt-6">
            <TabsContent value="basic" className="space-y-6 mt-0">
              <div className="flex justify-between items-center bg-muted/30 p-2 rounded-md">
                <Tabs value={currentLang} onValueChange={setCurrentLang} className="w-auto">
                  <TabsList>
                    <TabsTrigger value="fr">Français</TabsTrigger>
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="pt">Português</TabsTrigger>
                    <TabsTrigger value="ar">العربية</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleTranslate} 
                  disabled={isTranslating}
                  className="flex items-center gap-2"
                >
                  <Languages className="h-4 w-4" />
                  {isTranslating ? t('admin.translating', 'Traduction...') : t('admin.autoTranslate', 'Traduire automatiquement')}
                </Button>
              </div>

              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">{t('admin.projectTitle', 'Titre du projet')} ({currentLang.toUpperCase()})</Label>
                  <Input 
                    id="title" 
                    placeholder={t('admin.projectTitlePlaceholder', 'Ex: Connectivité rurale phase II')} 
                    value={formData.title?.[currentLang] || ''}
                    onChange={(e) => setValue(`title.${currentLang}`, e.target.value)}
                  />
                  {!formData.title?.fr && currentLang === 'fr' && <p className="text-sm text-destructive">{t('common.required', 'Champ requis')}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="country_id">{t('admin.country', 'Pays')}</Label>
                    <Select 
                      onValueChange={(val) => setValue('country_id', val)} 
                      value={formData.country_id}
                      disabled={!isSuperAdmin}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('admin.selectCountry', 'Sélectionner un pays')} />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.id} value={country.id}>
                            {country.name_fr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region">{t('admin.region', 'Région / Bloc')} ({currentLang.toUpperCase()})</Label>
                    <Input 
                      id="region" 
                      placeholder={t('admin.selectRegion', 'Sélectionner une région')}
                      value={formData.region?.[currentLang] || ''}
                      onChange={(e) => setValue(`region.${currentLang}`, e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="status">{t('admin.status', 'Statut')}</Label>
                    <Select 
                      onValueChange={(val) => setValue('status', val as any)} 
                      value={formData.status}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('admin.selectStatus', 'Sélectionner un statut')} />
                      </SelectTrigger>
                      <SelectContent>
                        {PROJECT_STATUSES.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">{t('admin.budget', 'Budget (USD)')}</Label>
                    <Input 
                      id="budget" 
                      type="number" 
                      placeholder="0.00" 
                      {...register('budget', { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="beneficiaries">{t('admin.beneficiaries', 'Bénéficiaires')} ({currentLang.toUpperCase()})</Label>
                    <Input 
                      id="beneficiaries" 
                      placeholder={t('admin.beneficiariesPlaceholder', 'Ex: 5000 agriculteurs')} 
                      value={formData.beneficiaries?.[currentLang] || ''}
                      onChange={(e) => setValue(`beneficiaries.${currentLang}`, e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="thematic">{t('admin.thematic', 'Thématique')} ({currentLang.toUpperCase()})</Label>
                    <Input 
                      id="thematic" 
                      placeholder={t('admin.thematicPlaceholder', 'Ex: Inclusion Numérique')} 
                      value={formData.thematic?.[currentLang] || ''}
                      onChange={(e) => setValue(`thematic.${currentLang}`, e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t('admin.description', 'Description')} ({currentLang.toUpperCase()})</Label>
                  <Textarea 
                    id="description" 
                    rows={5} 
                    placeholder={t('admin.descriptionPlaceholder', 'Description détaillée du projet...')}
                    value={formData.description?.[currentLang] || ''}
                    onChange={(e) => setValue(`description.${currentLang}`, e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6 mt-0">
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">{t('admin.startDate', 'Date de début')}</Label>
                    <Input id="start_date" type="date" {...register('start_date')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">{t('admin.endDate', 'Date de fin')}</Label>
                    <Input id="end_date" type="date" {...register('end_date')} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objectives">{t('admin.objectives', 'Objectifs stratégiques')}</Label>
                  <Textarea 
                    id="objectives" 
                    rows={4} 
                    placeholder={t('admin.objectivesPlaceholder', 'Lister les objectifs principaux...')}
                    {...register('objectives')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="indicators">{t('admin.indicators', 'Indicateurs de succès')}</Label>
                  <Textarea 
                    id="indicators" 
                    rows={4} 
                    placeholder={t('admin.indicatorsPlaceholder', 'Lister les indicateurs clés de performance...')}
                    {...register('indicators')}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="location" className="space-y-6 mt-0">
               <ProjectMapTab 
                project={{ latitude: formData.latitude, longitude: formData.longitude }}
                onLocationChange={(lat, lng) => {
                  setValue('latitude', lat)
                  setValue('longitude', lng)
                }}
               />
            </TabsContent>

            <TabsContent value="actors" className="space-y-6 mt-0">
              <ProjectActorsTab />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}