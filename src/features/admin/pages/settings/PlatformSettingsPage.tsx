import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useNavigate } from "react-router-dom"
import { Settings, Shield, Database, Bell, Mail, Globe, Users, ArrowLeft } from "lucide-react"
import { useSettings } from "../../hooks/useSettings"
import { useUpdateSetting } from "../../hooks/useUpdateSetting"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"
import type { PlatformSetting } from "../../types"

export default function PlatformSettingsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: settings, isLoading } = useSettings()
  const updateSetting = useUpdateSetting()
  const { toast } = useToast()

  const generalSettings = settings?.filter((s) => s.category === 'general') ?? []

  const handleToggle = (setting: PlatformSetting, value: boolean) => {
    updateSetting.mutate(
      { id: setting.id, value },
      {
        onSuccess: () => toast({
          title: t('admin.settingUpdated', { label: setting.label }),
        }),
      }
    )
  }

  const handleInputChange = (setting: PlatformSetting, value: string | number) => {
    updateSetting.mutate(
      { id: setting.id, value },
      {
        onSuccess: () => toast({
          title: t('admin.settingUpdated', { label: setting.label }),
        }),
      }
    )
  }

  const renderSetting = (setting: PlatformSetting) => {
    const value = setting.value

    if (typeof value === 'boolean') {
      return (
        <div key={setting.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-[#00833d]/5 transition-colors">
          <Label className="cursor-pointer text-sm flex-1">{setting.label}</Label>
          <Switch
            checked={value}
            onCheckedChange={(v) => handleToggle(setting, v as boolean)}
          />
        </div>
      )
    }

    if (typeof value === 'number') {
      return (
        <div key={setting.id} className="flex items-center gap-3 p-3 border rounded-lg">
          <Label className="min-w-48 text-sm flex-1">{setting.label}</Label>
          <Input
            type="number"
            defaultValue={value}
            onBlur={(e) => handleInputChange(setting, parseFloat(e.target.value) || 0)}
            className="w-24"
          />
        </div>
      )
    }

    if (typeof value === 'string') {
      if (value.length > 50) {
        return (
          <div key={setting.id} className="space-y-2">
            <Label className="text-sm">{setting.label}</Label>
            <Textarea
              defaultValue={value}
              onBlur={(e) => handleInputChange(setting, e.target.value)}
              rows={3}
              className="text-sm"
            />
          </div>
        )
      }
      return (
        <div key={setting.id} className="flex items-center gap-3 p-3 border rounded-lg">
          <Label className="min-w-48 text-sm flex-1">{setting.label}</Label>
          <Input
            defaultValue={value}
            onBlur={(e) => handleInputChange(setting, e.target.value)}
            className="flex-1"
          />
        </div>
      )
    }

    return null
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00833d] border-t-transparent" />
      </div>
    )
  }

  // Group settings by prefix
  const settingsByCategory = {
    general: generalSettings.filter(s => s.key.startsWith('general_')),
    security: generalSettings.filter(s => s.key.startsWith('security_')),
    database: generalSettings.filter(s => s.key.startsWith('database_')),
    notification: generalSettings.filter(s => s.key.startsWith('notification_')),
    email: generalSettings.filter(s => s.key.startsWith('email_')),
    system: generalSettings.filter(s => s.key.startsWith('system_')),
  }

  const categories = [
    { key: 'general', icon: Globe, title: t('admin.generalCategory', 'Général'), desc: t('admin.generalCategoryDesc', 'Paramètres généraux de la plateforme') },
    { key: 'security', icon: Shield, title: t('admin.securityCategory', 'Sécurité'), desc: t('admin.securityCategoryDesc', 'Contrôles d\'accès et sécurité'), hasLink: true, link: '/admin/settings/ip' },
    { key: 'database', icon: Database, title: t('admin.databaseCategory', 'Base de données'), desc: t('admin.databaseCategoryDesc', 'Configuration de la base de données'), hasLink: true, link: '/admin/settings/backups' },
    { key: 'notification', icon: Bell, title: t('admin.notificationCategory', 'Notifications'), desc: t('admin.notificationCategoryDesc', 'Alertes et notifications système') },
    { key: 'email', icon: Mail, title: t('admin.emailCategory', 'Email'), desc: t('admin.emailCategoryDesc', 'Configuration des emails sortants') },
    { key: 'system', icon: Settings, title: t('admin.systemCategory', 'Système'), desc: t('admin.systemCategoryDesc', 'Paramètres système et performance') },
  ]

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
            {t('admin.platformSettings', 'Configuration de la plateforme')}
          </h1>
          <p className="text-muted-foreground">
            {t('admin.platformSettingsDesc', 'Paramètres globaux de configuration')}
          </p>
        </div>
      </div>

      {/* System Status Card */}
      <Card className="border-[#00833d]/20 bg-gradient-to-br from-[#00833d]/5 to-transparent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00833d]/20">
                <Settings className="h-5 w-5 text-[#00833d]" />
              </div>
              <div>
                <CardTitle className="text-[#00833d]">
                  {t('admin.systemOperational', 'Système Opérationnel')}
                </CardTitle>
                <CardDescription>
                  {t('admin.version', 'Version')} 2.1.0
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="border-[#00833d]/50 text-[#00833d]">
              {t('admin.ok', 'OK')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">{t('admin.uptime', 'Temps de fonctionnement')}</p>
              <p className="text-2xl font-semibold text-[#ffe700]">99.9%</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">{t('admin.activeUsers', 'Utilisateurs actifs')}</p>
              <p className="text-2xl font-semibold text-[#00833d]">
                {settings?.filter(s => s.key === 'active_users')[0]?.value || 0}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">{t('admin.requests', 'Requêtes (24h)')}</p>
              <p className="text-2xl font-semibold text-[#00833d]">1.2K</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {categories.map((cat) => {
          const Icon = cat.icon
          const catSettings = settingsByCategory[cat.key as keyof typeof settingsByCategory] || []
          const count = catSettings.length

          return (
            <Card key={cat.key} className="hover:shadow-md transition-all hover:border-[#00833d]/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${cat.key === 'notification' ? 'bg-[#ffe700]/30' : 'bg-[#00833d]/20'}`}>
                    <Icon className={`h-4 w-4 text-[#00833d]`} />
                  </div>
                  {cat.title}
                  <Badge variant="secondary" className="ml-auto">{count}</Badge>
                </CardTitle>
                <CardDescription>{cat.desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {catSettings.map(renderSetting)}
                {cat.hasLink && (
                  <Button
                    variant="outline"
                    className="w-full border-[#00833d]/30 text-[#00833d] hover:bg-[#00833d]/10"
                    onClick={() => cat.link && navigate(cat.link)}
                  >
                    {t('admin.configure', 'Configurer')} →
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
