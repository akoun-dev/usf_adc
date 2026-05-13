import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Edit, Trash2, MapPin, Calendar, DollarSign, Users, FileText, Target, Clock, Download, Share2, History, PieChart, User, Building, Globe, Paperclip, Languages } from 'lucide-react'
import { useProjectById, useUpdateProject, useDeleteProject } from '../hooks/useContentManagement'
import { useCountries } from '../hooks/useCountries'
import { toast } from 'sonner'
import { translateToFourLang } from '../services/translate.service'
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '../../projects-map/types'
import { ProjectDocumentsTab } from '../components/ProjectDocumentsTab'
import { ProjectDashboardTab } from '../components/ProjectDashboardTab'
import { ProjectActorsTab } from '../components/ProjectActorsTab'
import { ProjectMapTab } from '../components/ProjectMapTab'
import { ProjectHistoryTab } from '../components/ProjectHistoryTab'

interface ProjectDetailProps {
  id?: string
}

export default function ProjectDetailPage({ id: propId }: ProjectDetailProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { id: urlId } = useParams<{ id: string }>()
  const projectId = propId || urlId
  
  const { data: project, isLoading, refetch } = useProjectById(projectId || '')
  const { data: countries = [] } = useCountries()
  const updateProject = useUpdateProject()
  const deleteProject = useDeleteProject()
  
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<any>({})
  const [activeTab, setActiveTab] = useState('overview')
  const [currentEditLang, setCurrentEditLang] = useState('fr')
  const [isTranslating, setIsTranslating] = useState(false)

  // Helper to extract localized value from a JSONB field
  const getLocalized = (field: any, lang?: string): string => {
    const l = lang || i18n.language || 'fr'
    if (!field) return ''
    if (typeof field === 'string') {
      try { const parsed = JSON.parse(field); return parsed[l] || parsed['fr'] || '' } catch { return field }
    }
    if (typeof field === 'object') return field[l] || field['fr'] || ''
    return ''
  }

  useEffect(() => {
    if (project) {
      const toJsonbObj = (field: any) => {
        if (!field) return { fr: '', en: '', pt: '', ar: '' }
        if (typeof field === 'object' && !Array.isArray(field)) return { fr: '', en: '', pt: '', ar: '', ...field }
        if (typeof field === 'string') {
          try { return { fr: '', en: '', pt: '', ar: '', ...JSON.parse(field) } } catch { return { fr: field, en: '', pt: '', ar: '' } }
        }
        return { fr: '', en: '', pt: '', ar: '' }
      }
      setEditData({
        title: toJsonbObj(project.title),
        description: toJsonbObj(project.description),
        country_id: project.country_id || '',
        status: project.status || 'planned',
        region: toJsonbObj(project.region),
        beneficiaries: toJsonbObj((project as any).beneficiaries),
        thematic: toJsonbObj((project as any).thematic),
        budget: project.budget || 0,
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        objectives: project.objectives || '',
        indicators: project.indicators || '',
        latitude: project.latitude || null,
        longitude: project.longitude || null
      })
    }
  }, [project])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (project) {
      const toJsonbObj = (field: any) => {
        if (!field) return { fr: '', en: '', pt: '', ar: '' }
        if (typeof field === 'object' && !Array.isArray(field)) return { fr: '', en: '', pt: '', ar: '', ...field }
        if (typeof field === 'string') {
          try { return { fr: '', en: '', pt: '', ar: '', ...JSON.parse(field) } } catch { return { fr: field, en: '', pt: '', ar: '' } }
        }
        return { fr: '', en: '', pt: '', ar: '' }
      }
      setEditData({
        title: toJsonbObj(project.title),
        description: toJsonbObj(project.description),
        country_id: project.country_id || '',
        status: project.status || 'planned',
        region: toJsonbObj(project.region),
        beneficiaries: toJsonbObj((project as any).beneficiaries),
        thematic: toJsonbObj((project as any).thematic),
        budget: project.budget || 0,
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        objectives: project.objectives || '',
        indicators: project.indicators || '',
        latitude: project.latitude || null,
        longitude: project.longitude || null
      })
    }
  }

  const handleSave = async () => {
    try {
      if (!projectId) return
      await updateProject.mutateAsync({ id: projectId, ...editData })
      await refetch()
      setIsEditing(false)
      toast.success(t('admin.projectUpdated', 'Projet mis à jour avec succès'))
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error(t('admin.errorUpdatingProject', 'Erreur lors de la mise à jour'))
    }
  }

  const handleTranslate = async () => {
    try {
      setIsTranslating(true)
      toast.info(t('admin.translating', 'Traduction en cours...'))
      const fields = ['title', 'description', 'region', 'beneficiaries', 'thematic']
      const updates: any = { ...editData }
      for (const field of fields) {
        const val = editData[field]?.[currentEditLang]
        if (val) {
          updates[field] = await translateToFourLang(currentEditLang, val)
        }
      }
      setEditData(updates)
      toast.success(t('admin.translationSuccess', 'Traduction terminée'))
    } catch (error) {
      console.error('Translation error:', error)
      toast.error(t('admin.translationError', 'Erreur lors de la traduction'))
    } finally {
      setIsTranslating(false)
    }
  }

  const handleDelete = async () => {
    if (!projectId) return
    if (confirm(t('admin.confirmDelete', 'Êtes-vous sûr de vouloir supprimer ce projet ?'))) {
      try {
        await deleteProject.mutateAsync(projectId)
        navigate('/admin/projects')
      } catch (error) {
        console.error('Error deleting project:', error)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    // For JSONB fields, update the specific language key
    if (['title', 'description', 'region', 'beneficiaries', 'thematic'].includes(name)) {
      setEditData((prev: any) => ({ ...prev, [name]: { ...prev[name], [currentEditLang]: value } }))
    } else {
      setEditData((prev: any) => ({ ...prev, [name]: value }))
    }
  }

  const handleExportPDF = () => {
    window.print()
  }

  const handleShare = () => {
    if (projectId) {
      const shareUrl = `${window.location.origin}/admin/projects/${projectId}`
      navigator.clipboard.writeText(shareUrl)
      alert(t('project.linkCopied', 'Lien copié dans le presse-papiers'))
    }
  }

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <Card>
          <CardContent className="p-6 text-center">
            <p>{t('common.loading', 'Chargement...')}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="animate-fade-in">
        <Card>
          <CardContent className="p-6 text-center">
            <p>{t('admin.projectNotFound', 'Projet non trouvé')}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const country = countries.find(c => c.id === project.country_id)

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/projects')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back', 'Retour')}
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF} className="gap-2">
            <Download className="h-4 w-4" />
            {t('project.exportPDF', 'Exporter PDF')}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
            <Share2 className="h-4 w-4" />
            {t('project.share', 'Partager')}
          </Button>
          {!isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={handleEdit} className="gap-2">
                <Edit className="h-4 w-4" />
                {t('common.edit', 'Modifier')}
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete} className="gap-2">
                <Trash2 className="h-4 w-4" />
                {t('common.delete', 'Supprimer')}
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 border rounded-md p-1 bg-background">
                <Tabs value={currentEditLang} onValueChange={setCurrentEditLang}>
                  <TabsList className="h-7">
                    <TabsTrigger value="fr" className="h-6 text-xs px-2">FR</TabsTrigger>
                    <TabsTrigger value="en" className="h-6 text-xs px-2">EN</TabsTrigger>
                    <TabsTrigger value="pt" className="h-6 text-xs px-2">PT</TabsTrigger>
                    <TabsTrigger value="ar" className="h-6 text-xs px-2">AR</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={handleTranslate}
                  disabled={isTranslating}
                >
                  <Languages className="h-3 w-3" />
                  {isTranslating ? t('admin.translating', '...') : t('admin.autoTranslate', 'Traduire')}
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                {t('common.cancel', 'Annuler')}
              </Button>
              <Button size="sm" onClick={handleSave} disabled={updateProject.isPending}>
                {t('common.save', 'Enregistrer')}
              </Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              {isEditing ? (
                <Input
                  name="title"
                  value={editData.title?.[currentEditLang] || ''}
                  onChange={handleChange}
                  className="text-2xl font-bold mb-2"
                  placeholder={`Titre (${currentEditLang.toUpperCase()})`}
                />
              ) : (
                <CardTitle className="text-2xl">{getLocalized(project.title)}</CardTitle>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  style={{ backgroundColor: PROJECT_STATUS_COLORS[project.status as keyof typeof PROJECT_STATUS_COLORS] || '#666' }}
                  className="text-white"
                >
                  {t(`fsu.projectStatus.${project.status}`, PROJECT_STATUS_LABELS[project.status as keyof typeof PROJECT_STATUS_LABELS] || project.status)}
                </Badge>
                {country && (
                  <div className="flex items-center gap-1">
                    {country.flag_url && (
                      <img src={country.flag_url} alt={t('common.flag', 'Drapeau')} className="w-5 h-3" />
                    )}
                    <span className="text-sm text-muted-foreground">
                      {i18n.language === 'fr' ? country.name_fr : (country.name_en || country.name_fr)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <CardDescription>{getLocalized(project.region)}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7">
              <TabsTrigger value="overview">{t('project.overview', 'Aperçu')}</TabsTrigger>
              <TabsTrigger value="dashboard">{t('project.dashboard', 'Tableau de bord')}</TabsTrigger>
              <TabsTrigger value="documents">{t('project.documents', 'Documents')}</TabsTrigger>
              <TabsTrigger value="actors">{t('project.actors', 'Acteurs')}</TabsTrigger>
              <TabsTrigger value="map">{t('project.map', 'Carte')}</TabsTrigger>
              <TabsTrigger value="history">{t('project.history', 'Historique')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8 pt-4">
              {/* Statistiques Rapides */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-primary/5 border-none shadow-none">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">{t('project.budget', 'Budget')}</p>
                      {isEditing ? (
                        <Input
                          name="budget"
                          type="number"
                          value={editData.budget}
                          onChange={handleChange}
                          className="h-8 mt-1"
                        />
                      ) : (
                        <p className="text-lg font-bold">{project.budget ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(project.budget) : t('common.noData', 'Non spécifié')}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-500/5 border-none shadow-none">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-2 bg-blue-500/10 rounded-full text-blue-600">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">{t('project.beneficiaries', 'Bénéficiaires')}</p>
                      {isEditing ? (
                        <Input
                          name="beneficiaries"
                          value={editData.beneficiaries?.[currentEditLang] || ''}
                          onChange={handleChange}
                          className="h-8 mt-1 text-sm"
                          placeholder={`Bénéficiaires (${currentEditLang.toUpperCase()})`}
                        />
                      ) : (
                        <p className="text-lg font-bold">{getLocalized(project.beneficiaries) || t('common.noData', 'Non spécifié')}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-orange-500/5 border-none shadow-none">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-2 bg-orange-500/10 rounded-full text-orange-600">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">{t('project.duration', 'Période')}</p>
                      <p className="text-sm font-bold">
                        {project.start_date ? new Date(project.start_date).toLocaleDateString() : '—'} 
                        <span className="mx-1 text-muted-foreground font-normal">{t('project.to', 'au')}</span> 
                        {project.end_date ? new Date(project.end_date).toLocaleDateString() : '—'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-green-500/5 border-none shadow-none">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-2 bg-green-500/10 rounded-full text-green-600">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">{t('project.location', 'Localisation')}</p>
                      <p className="text-sm font-bold truncate max-w-[150px]">
                        {project.latitude ? `${Number(project.latitude).toFixed(4)}, ${Number(project.longitude).toFixed(4)}` : t('common.noData', 'Non spécifié')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Colonne de Gauche : Description et Objectifs */}
                <div className="lg:col-span-2 space-y-8">
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-8 w-1 bg-primary rounded-full" />
                      <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        {t('project.description', 'Description du Projet')}
                      </h3>
                    </div>
                    <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                      {isEditing ? (
                        <Textarea
                          name="description"
                          value={editData.description?.[currentEditLang] || ''}
                          onChange={handleChange}
                          rows={8}
                          className="w-full text-base leading-relaxed p-4"
                          placeholder={`Description (${currentEditLang.toUpperCase()})`}
                        />
                      ) : (
                        <p className="whitespace-pre-line text-base bg-muted/30 p-6 rounded-xl border border-border/50">
                          {getLocalized(project.description) || t('common.noDescription', 'Aucune description fournie pour ce projet.')}
                        </p>
                      )}
                    </div>
                  </section>

                  <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-bold flex items-center gap-2 text-foreground">
                        <Target className="h-4 w-4 text-primary" />
                        {t('project.objectives', 'Objectifs Stratégiques')}
                      </h4>
                      {isEditing ? (
                        <Textarea
                          name="objectives"
                          value={editData.objectives}
                          onChange={handleChange}
                          rows={5}
                          className="w-full text-sm"
                        />
                      ) : (
                        <div className="bg-background border rounded-lg p-4 text-sm leading-relaxed text-muted-foreground min-h-[120px]">
                          {project.objectives || t('common.noData', 'Aucun objectif défini')}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold flex items-center gap-2 text-foreground">
                        <PieChart className="h-4 w-4 text-primary" />
                        {t('project.indicators', 'Indicateurs de Performance')}
                      </h4>
                      {isEditing ? (
                        <Textarea
                          name="indicators"
                          value={editData.indicators}
                          onChange={handleChange}
                          rows={5}
                          className="w-full text-sm"
                        />
                      ) : (
                        <div className="bg-background border rounded-lg p-4 text-sm leading-relaxed text-muted-foreground min-h-[120px]">
                          {project.indicators || t('common.noData', 'Aucun indicateur défini')}
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                {/* Colonne de Droite : Détails Techniques et Dates */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        {t('project.technicalDetails', 'Détails Techniques')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">{t('project.status', 'Statut actuel')}</span>
                        <Badge variant="outline" className="font-bold">
                          {t(`fsu.projectStatus.${project.status}`, PROJECT_STATUS_LABELS[project.status as keyof typeof PROJECT_STATUS_LABELS] || project.status)}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">{t('project.region', 'Région')}</span>
                        {isEditing ? (
                          <Input
                            name="region"
                            value={editData.region?.[currentEditLang] || ''}
                            onChange={handleChange}
                            className="h-7 w-40 text-sm text-right"
                            placeholder={`Région (${currentEditLang.toUpperCase()})`}
                          />
                        ) : (
                          <span className="text-sm font-bold">{getLocalized(project.region) || '—'}</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">{t('project.startDate', 'Date de lancement')}</span>
                        <span className="text-sm font-bold">{project.start_date || '—'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-muted-foreground">{t('project.endDate', 'Date de fin prévue')}</span>
                        <span className="text-sm font-bold">{project.end_date || '—'}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        {t('project.geoInfo', 'Géolocalisation')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase">{t('project.coordinates', 'Coordonnées')}</p>
                          <p className="text-sm font-mono font-bold">
                            {project.latitude ? `${Number(project.latitude).toFixed(6)}, ${Number(project.longitude).toFixed(6)}` : t('common.noData', 'Non spécifié')}
                          </p>
                        </div>
                      </div>
                      {isEditing && (
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-muted-foreground">Lat</Label>
                            <Input name="latitude" type="number" step="0.000001" value={editData.latitude || ''} onChange={handleChange} className="h-8 text-xs" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-muted-foreground">Lng</Label>
                            <Input name="longitude" type="number" step="0.000001" value={editData.longitude || ''} onChange={handleChange} className="h-8 text-xs" />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="dashboard">
              <ProjectDashboardTab project={project} />
            </TabsContent>

            <TabsContent value="documents">
              <ProjectDocumentsTab projectId={projectId || ''} />
            </TabsContent>

            <TabsContent value="actors">
              <ProjectActorsTab projectId={projectId || ''} />
            </TabsContent>

            <TabsContent value="map">
              <ProjectMapTab 
                project={project} 
                onLocationChange={(lat, lng) => {
                  setEditData(prev => ({ ...prev, latitude: lat, longitude: lng }))
                }}
              />
            </TabsContent>

            <TabsContent value="history">
              <ProjectHistoryTab projectId={projectId || ''} />
            </TabsContent>
          </Tabs>

          {/* Additional Actions */}
          {!isEditing && (
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                {t('common.edit', 'Modifier')}
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                {t('common.delete', 'Supprimer')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}