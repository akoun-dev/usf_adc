import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Database, Download, Trash2, RefreshCw, Calendar, HardDrive } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"

interface Backup {
  id: string
  name: string
  size: string
  created_at: string
  status: 'completed' | 'pending' | 'failed'
}

export default function BackupsSettingsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toast } = useToast()

  const backups: Backup[] = [
    {
      id: '1',
      name: 'backup_2024_01_20_00_00.sql',
      size: '245 MB',
      created_at: '2024-01-20T00:00:00',
      status: 'completed',
    },
    {
      id: '2',
      name: 'backup_2024_01_19_00_00.sql',
      size: '243 MB',
      created_at: '2024-01-19T00:00:00',
      status: 'completed',
    },
    {
      id: '3',
      name: 'backup_2024_01_18_00_00.sql',
      size: '241 MB',
      created_at: '2024-01-18T00:00:00',
      status: 'completed',
    },
  ]

  const createBackup = () => {
    toast({ title: t('admin.backupCreating', 'Création de la sauvegarde en cours...') })
  }

  const restoreBackup = (id: string) => {
    if (!confirm(t('admin.restoreConfirm', 'Êtes-vous sûr de vouloir restaurer cette sauvegarde ?'))) return
    toast({ title: t('admin.backupRestoring', 'Restauration de la sauvegarde en cours...') })
  }

  const deleteBackup = (id: string) => {
    if (!confirm(t('admin.deleteBackupConfirm', 'Êtes-vous sûr de vouloir supprimer cette sauvegarde ?'))) return
    toast({ title: t('admin.backupDeleted', 'Sauvegarde supprimée') })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/settings')}
          className="hover:bg-[#00833d]/10 hover:text-[#00833d]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-[#00833d]">
            {t('admin.backups', 'Sauvegardes')}
          </h1>
          <p className="text-muted-foreground">
            {t('admin.backupsDesc', 'Gérez les sauvegardes de votre base de données')}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('admin.totalBackups', 'Total des sauvegardes')}
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{backups.length}</div>
            <p className="text-xs text-muted-foreground">{t('admin.last7days', 'Derniers 7 jours')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('admin.totalSize', 'Taille totale')}
            </CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">729 MB</div>
            <p className="text-xs text-muted-foreground">{t('admin.avgSize', '~243 MB par sauvegarde')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('admin.lastBackup', 'Dernière sauvegarde')}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {new Date(backups[0].created_at).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">{t('admin.autoBackup', 'Sauvegarde automatique')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('admin.retention', 'Rétention')}
            </CardTitle>
            <Badge variant="outline">{t('admin.days', 'jours')}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30</div>
            <p className="text-xs text-muted-foreground">{t('admin.autoDelete', 'Suppression automatique')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={createBackup}>
          <Database className="h-4 w-4 mr-2" />
          {t('admin.createBackup', 'Créer une sauvegarde')}
        </Button>
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('admin.configureSchedule', 'Configurer la planification')}
        </Button>
      </div>

      {/* Backups List */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.backupHistory', 'Historique des sauvegardes')}</CardTitle>
          <CardDescription>
            {t('admin.backupHistoryDesc', 'Liste de toutes les sauvegardes de la base de données')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {backups.map((backup) => (
              <div
                key={backup.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                    <Database className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">{backup.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(backup.created_at).toLocaleString()} • {backup.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={backup.status === 'completed' ? 'default' : 'secondary'}>
                    {backup.status === 'completed' ? t('admin.completed', 'Terminé') : t('admin.pending', 'En cours')}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => restoreBackup(backup.id)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t('admin.restore', 'Restaurer')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteBackup(backup.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
