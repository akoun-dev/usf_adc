import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Clock, User, Edit, Calendar, FileText } from 'lucide-react'
import { useProjectHistory } from '../hooks/useContentManagement'

interface ProjectHistoryTabProps {
  projectId: string
}

export function ProjectHistoryTab({ projectId }: ProjectHistoryTabProps) {
  const { t } = useTranslation()
  const { data: history = [], isLoading } = useProjectHistory(projectId)

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created':
        return <FileText className="h-4 w-4" />
      case 'updated':
        return <Edit className="h-4 w-4" />
      case 'document_added':
        return <FileText className="h-4 w-4" />
      case 'actor_added':
        return <User className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      'created': t('project.historyCreated', 'Création du projet'),
      'updated': t('project.historyUpdated', 'Mise à jour du projet'),
      'document_added': t('project.historyDocumentAdded', 'Document ajouté'),
      'actor_added': t('project.historyActorAdded', 'Acteur ajouté'),
      'status_changed': t('project.historyStatusChanged', 'Statut modifié')
    }
    return labels[action] || action
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('project.history', 'Historique du projet')}</CardTitle>
        <CardDescription>{t('project.historyDesc', 'Suivi des modifications et activités')}</CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <p>{t('common.loading', 'Chargement...')}</p>
        ) : history.length === 0 ? (
          <p className="text-muted-foreground">{t('project.noHistory', 'Aucun historique disponible')}</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common.date', 'Date')}</TableHead>
                  <TableHead>{t('common.action', 'Action')}</TableHead>
                  <TableHead>{t('common.user', 'Utilisateur')}</TableHead>
                  <TableHead>{t('common.details', 'Détails')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {new Date(item.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActionIcon(item.action)}
                        <span>{getActionLabel(item.action)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.user_name || t('common.unknown', 'Inconnu')}</TableCell>
                    <TableCell>{item.details || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}