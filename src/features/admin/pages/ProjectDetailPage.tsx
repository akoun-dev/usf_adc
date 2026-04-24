import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Edit, Trash2, MapPin, Calendar, DollarSign, Users, FileText, Target, Clock, Download, Share2, History, PieChart, User, Building, Globe, Paperclip } from 'lucide-react'
import { useProjectById, useUpdateProject, useDeleteProject } from '../hooks/useContentManagement'
import { useCountries } from '../hooks/useCountries'
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
  const { t } = useTranslation()
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

  useEffect(() => {
    if (project) {
      setEditData({
        title: project.title || '',
        description: project.description || '',
        country_id: project.country_id || '',
        status: project.status || 'planned',
        region: project.region || '',
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
      setEditData({
        title: project.title || '',
        description: project.description || '',
        country_id: project.country_id || '',
        status: project.status || 'planned',
        region: project.region || '',
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
    } catch (error) {
      console.error('Error updating project:', error)
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
    setEditData(prev => ({ ...prev, [name]: value }))
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
                  value={editData.title}
                  onChange={handleChange}
                  className="text-2xl font-bold mb-2"
                />
              ) : (
                <CardTitle className="text-2xl">{project.title}</CardTitle>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  style={{ backgroundColor: PROJECT_STATUS_COLORS[project.status as keyof typeof PROJECT_STATUS_COLORS] || '#666' }}
                  className="text-white"
                >
                  {PROJECT_STATUS_LABELS[project.status as keyof typeof PROJECT_STATUS_LABELS] || project.status}
                </Badge>
                {country && (
                  <div className="flex items-center gap-1">
                    {country.flag_url && (
                      <img src={country.flag_url} alt={country.name_fr} className="w-5 h-3" />
                    )}
                    <span className="text-sm text-muted-foreground">{country.name_fr}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <CardDescription>{project.region}</CardDescription>
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

            <TabsContent value="overview">
              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {t('project.description', 'Description')}
                </h3>
                {isEditing ? (
                  <Textarea
                    name="description"
                    value={editData.description}
                    onChange={handleChange}
                    rows={6}
                    className="w-full"
                  />
                ) : (
                  <p className="text-muted-foreground whitespace-pre-line">{project.description || t('common.noDescription', 'Aucune description')}</p>
                )}
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    {t('project.objectives', 'Objectifs')}
                  </h3>
                  {isEditing ? (
                    <Textarea
                      name="objectives"
                      value={editData.objectives}
                      onChange={handleChange}
                      rows={4}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-muted-foreground whitespace-pre-line">{project.objectives || t('common.noData', 'Aucun objectif défini')}</p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t('project.indicators', 'Indicateurs')}
                  </h3>
                  {isEditing ? (
                    <Textarea
                      name="indicators"
                      value={editData.indicators}
                      onChange={handleChange}
                      rows={4}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-muted-foreground whitespace-pre-line">{project.indicators || t('common.noData', 'Aucun indicateur défini')}</p>
                  )}
                </div>
              </div>

              {/* Project Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('project.budget', 'Budget')}</p>
                    {isEditing ? (
                      <Input
                        name="budget"
                        type="number"
                        value={editData.budget}
                        onChange={handleChange}
                        className="w-full mt-1"
                      />
                    ) : (
                      <p className="font-medium">{project.budget ? `${project.budget} €` : t('common.noData', 'Non spécifié')}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('project.startDate', 'Date de début')}</p>
                    {isEditing ? (
                      <Input
                        name="start_date"
                        type="date"
                        value={editData.start_date}
                        onChange={handleChange}
                        className="w-full mt-1"
                      />
                    ) : (
                      <p className="font-medium">{project.start_date || t('common.noData', 'Non spécifié')}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('project.endDate', 'Date de fin')}</p>
                    {isEditing ? (
                      <Input
                        name="end_date"
                        type="date"
                        value={editData.end_date}
                        onChange={handleChange}
                        className="w-full mt-1"
                      />
                    ) : (
                      <p className="font-medium">{project.end_date || t('common.noData', 'Non spécifié')}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('project.location', 'Localisation')}</p>
                    {isEditing ? (
                      <div className="flex gap-2 mt-1">
                        <Input
                          name="latitude"
                          type="number"
                          step="0.000001"
                          value={editData.latitude || ''}
                          onChange={handleChange}
                          placeholder="Latitude"
                          className="w-full"
                        />
                        <Input
                          name="longitude"
                          type="number"
                          step="0.000001"
                          value={editData.longitude || ''}
                          onChange={handleChange}
                          placeholder="Longitude"
                          className="w-full"
                        />
                      </div>
                    ) : (
                      <p className="font-medium">
                        {project.latitude && project.longitude 
                          ? `${project.latitude}, ${project.longitude}`
                          : t('common.noData', 'Non spécifié')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('project.beneficiaries', 'Bénéficiaires')}</p>
                    <p className="font-medium">{project.beneficiaire || t('common.noData', 'Non spécifié')}</p>
                  </div>
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