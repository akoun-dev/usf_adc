import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Database, ExternalLink, Info, Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"

export default function BackupsSettingsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toast } = useToast()

  const openSupabaseDashboard = () => {
    // Open Supabase dashboard in a new tab
    window.open('https://supabase.com/dashboard', '_blank')
    toast({
      title: t('admin.redirectingToDashboard', 'Redirection vers le tableau de bord Supabase...'),
    })
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

      {/* Info Card */}
      <Card className="border-[#00833d]/20 bg-gradient-to-br from-[#00833d]/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00833d]/20">
              <Info className="h-6 w-6 text-[#00833d]" />
            </div>
            <div>
              <CardTitle className="text-[#00833d]">
                {t('admin.backupInfoTitle', 'Sauvegardes gérées par l\'infrastructure')}
              </CardTitle>
              <CardDescription>
                {t('admin.backupInfoDesc', 'Les sauvegardes automatiques sont configurées au niveau de la base de données')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('admin.backupInfoText', 'La base de données est configurée pour effectuer des sauvegardes automatiques quotidiennes. Ces sauvegardes sont gérées par Supabase et peuvent être restaurées depuis le tableau de bord.')}
            </p>
            <Button
              onClick={openSupabaseDashboard}
              className="bg-[#00833d] hover:bg-[#00833d]/90"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {t('admin.openDashboard', 'Ouvrir le tableau de bord Supabase')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Backup Features */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-md transition-all hover:border-[#00833d]/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00833d]/20">
                <Database className="h-5 w-5 text-[#00833d]" />
              </div>
              <div>
                <CardTitle className="text-base">
                  {t('admin.automaticBackups', 'Sauvegardes automatiques')}
                </CardTitle>
                <CardDescription className="text-xs">
                  {t('admin.dailyBackups', 'Sauvegardes quotidiennes')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('admin.frequency', 'Fréquence')}</span>
                <Badge variant="outline" className="border-[#00833d]/50 text-[#00833d]">
                  {t('admin.daily', 'Quotidienne')}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('admin.retention', 'Rétention')}</span>
                <span className="font-medium">{t('admin.days30', '30 jours')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('admin.status', 'État')}</span>
                <Badge variant="default" className="bg-[#00833d]/20 text-[#00833d]">
                  {t('admin.active', 'Actif')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all hover:border-[#00833d]/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffe700]/30">
                <Shield className="h-5 w-5 text-[#00833d]" />
              </div>
              <div>
                <CardTitle className="text-base">
                  {t('admin.disasterRecovery', 'Reprise après sinistre')}
                </CardTitle>
                <CardDescription className="text-xs">
                  {t('admin.pointInTimeRecovery', 'Restauration à un instant donné')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('admin.recoveryType', 'Type de récupération')}</span>
                <span className="font-medium">{t('admin.pitr', 'PITR')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('admin.recoveryWindow', 'Fenêtre de récupération')}</span>
                <span className="font-medium">{t('admin.days30', '30 jours')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('admin.location', 'Emplacement')}</span>
                <span className="font-medium">{t('admin.multiRegion', 'Multi-régional')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t('admin.additionalInfo', 'Informations supplémentaires')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-[#00833d] mt-2" />
            <p>
              {t('admin.backupInfo1', 'Les sauvegardes sont chiffrées au repos et en transit')}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-[#00833d] mt-2" />
            <p>
              {t('admin.backupInfo2', 'Les sauvegardes sont stockées dans plusieurs zones de disponibilité pour une redondance maximale')}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-[#00833d] mt-2" />
            <p>
              {t('admin.backupInfo3', 'La restauration peut être effectuée à n\'importe quel moment dans les 30 derniers jours')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
