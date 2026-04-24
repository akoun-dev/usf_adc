import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, Users, User, Building, Globe } from 'lucide-react'
import { useProjectActors, useAddProjectActor, useRemoveProjectActor } from '../hooks/useContentManagement'

interface ProjectActorsTabProps {
  projectId?: string
  onActorsChange?: (actors: any[]) => void
}

const ACTOR_TYPES = [
  { value: 'carrier', label: 'Porteur' },
  { value: 'partner', label: 'Partenaire' },
  { value: 'beneficiary', label: 'Bénéficiaire' },
  { value: 'stakeholder', label: 'Partie prenante' }
]

export function ProjectActorsTab({ projectId, onActorsChange }: ProjectActorsTabProps) {
  const { t } = useTranslation()
  
  // Use local state for creation context
  const [localActors, setLocalActors] = useState<any[]>([])
  
  // Use API hooks when projectId is available
  const { data: apiActors = [], isLoading, refetch } = useProjectActors(projectId || '')
  const addActor = useAddProjectActor()
  const removeActor = useRemoveProjectActor()
  
  // Combine local and API actors
  const actors = projectId ? apiActors : localActors
  
  const isLoadingState = projectId ? isLoading : false
  
  const [newActor, setNewActor] = useState({
    name: '',
    type: 'carrier' as const,
    role: '',
    organization: '',
    contact: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewActor(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewActor(prev => ({ ...prev, [name]: value }))
  }

  const handleAddActor = async () => {
    if (!newActor.name) return
    
    try {
      if (projectId) {
        // Use API for existing projects
        await addActor.mutateAsync({
          projectId,
          actor: newActor
        })
        await refetch()
      } else {
        // Use local state for creation context
        const newActorWithId = {
          id: Date.now().toString(),
          ...newActor
        }
        const updatedActors = [...localActors, newActorWithId]
        setLocalActors(updatedActors)
        if (onActorsChange) {
          onActorsChange(updatedActors)
        }
      }
      
      setNewActor({
        name: '',
        type: 'carrier',
        role: '',
        organization: '',
        contact: ''
      })
    } catch (error) {
      console.error('Error adding actor:', error)
    }
  }

  const handleRemoveActor = async (actorId: string) => {
    if (confirm(t('admin.confirmDelete', 'Êtes-vous sûr de vouloir supprimer cet acteur ?'))) {
      try {
        if (projectId) {
          // Use API for existing projects
          await removeActor.mutateAsync(actorId)
          await refetch()
        } else {
          // Use local state for creation context
          const updatedActors = localActors.filter(actor => actor.id !== actorId)
          setLocalActors(updatedActors)
          if (onActorsChange) {
            onActorsChange(updatedActors)
          }
        }
      } catch (error) {
        console.error('Error removing actor:', error)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('project.actors', 'Acteurs du projet')}</CardTitle>
        <CardDescription>{t('project.actorsDesc', 'Gérer les acteurs impliqués dans le projet')}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Add Actor Form */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-4">{t('project.addActor', 'Ajouter un acteur')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="actor-name">{t('project.actorName', 'Nom')}</Label>
              <Input
                id="actor-name"
                name="name"
                value={newActor.name}
                onChange={handleInputChange}
                placeholder={t('project.actorNamePlaceholder', 'Nom de l\'acteur')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actor-type">{t('project.actorType', 'Type')}</Label>
              <Select
                value={newActor.type}
                onValueChange={(v) => handleSelectChange('type', v as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('project.selectActorType', 'Sélectionner un type')} />
                </SelectTrigger>
                <SelectContent>
                  {ACTOR_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="actor-role">{t('project.actorRole', 'Rôle')}</Label>
              <Input
                id="actor-role"
                name="role"
                value={newActor.role}
                onChange={handleInputChange}
                placeholder={t('project.actorRolePlaceholder', 'Rôle dans le projet')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actor-organization">{t('project.actorOrganization', 'Organisation')}</Label>
              <Input
                id="actor-organization"
                name="organization"
                value={newActor.organization}
                onChange={handleInputChange}
                placeholder={t('project.actorOrganizationPlaceholder', 'Organisation')}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="actor-contact">{t('project.actorContact', 'Contact')}</Label>
              <Input
                id="actor-contact"
                name="contact"
                value={newActor.contact}
                onChange={handleInputChange}
                placeholder={t('project.actorContactPlaceholder', 'Email ou téléphone')}
              />
            </div>

            <div className="md:col-span-2">
              <Button
                onClick={handleAddActor}
                disabled={!newActor.name || addActor.isPending}
                className="w-full md:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('project.addActorButton', 'Ajouter l\'acteur')}
              </Button>
            </div>
          </div>
        </div>

        {/* Actors List */}
        <div>
          <h3 className="font-semibold mb-4">{t('project.actorsList', 'Liste des acteurs')}</h3>
          {isLoadingState ? (
            <p>{t('common.loading', 'Chargement...')}</p>
          ) : actors.length === 0 ? (
            <p className="text-muted-foreground">{t('project.noActors', 'Aucun acteur pour ce projet')}</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('common.name', 'Nom')}</TableHead>
                    <TableHead>{t('common.type', 'Type')}</TableHead>
                    <TableHead>{t('common.role', 'Rôle')}</TableHead>
                    <TableHead>{t('common.organization', 'Organisation')}</TableHead>
                    <TableHead>{t('common.contact', 'Contact')}</TableHead>
                    <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actors.map((actor: any) => (
                    <TableRow key={actor.id}>
                      <TableCell className="font-medium">{actor.name}</TableCell>
                      <TableCell>
                        <span className="capitalize">{actor.type}</span>
                      </TableCell>
                      <TableCell>{actor.role || '-'}</TableCell>
                      <TableCell>{actor.organization || '-'}</TableCell>
                      <TableCell>{actor.contact || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveActor(actor.id)}
                          title={t('common.delete', 'Supprimer')}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-4">{t('project.actorsSummary', 'Résumé des acteurs')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">{t('project.carriers', 'Porteurs')}</p>
                <p className="font-medium">{actors.filter((a: any) => a.type === 'carrier').length}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">{t('project.partners', 'Partenaires')}</p>
                <p className="font-medium">{actors.filter((a: any) => a.type === 'partner').length}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">{t('project.beneficiaries', 'Bénéficiaires')}</p>
                <p className="font-medium">{actors.filter((a: any) => a.type === 'beneficiary').length}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">{t('project.stakeholders', 'Parties prenantes')}</p>
                <p className="font-medium">{actors.filter((a: any) => a.type === 'stakeholder').length}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}