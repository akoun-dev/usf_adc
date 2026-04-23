import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useNavigate } from "react-router-dom"
import { Settings, Shield, Database, Bell, Mail, Globe, ArrowLeft, FileText } from "lucide-react"
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

  // Group settings by category from database
  const settingsByCategory: Record<string, PlatformSetting[]> = {}
  generalSettings.forEach(setting => {
    if (!settingsByCategory[setting.category]) {
      settingsByCategory[setting.category] = []
    }
    settingsByCategory[setting.category].push(setting)
  })

  // Get unique categories
  const categoryKeys = Object.keys(settingsByCategory).sort()

  // Category metadata
  const categoryMeta: Record<string, { icon: any; title: string; desc: string; link?: string }> = {
    general: { icon: Globe, title: t('admin.generalCategory', 'Général'), desc: t('admin.generalCategoryDesc', 'Paramètres généraux de la plateforme') },
    fsu: { icon: FileText, title: t('admin.fsuCategory', 'FSU'), desc: t('admin.fsuCategoryDesc', 'Paramètres des soumissions FSU'), link: '/admin/settings/fsu' },
    security: { icon: Shield, title: t('admin.securityCategory', 'Sécurité'), desc: t('admin.securityCategoryDesc', 'Contrôles d\'accès et sécurité'), link: '/admin/settings/ip' },
    database: { icon: Database, title: t('admin.databaseCategory', 'Base de données'), desc: t('admin.databaseCategoryDesc', 'Configuration de la base de données'), link: '/admin/settings/backups' },
    notification: { icon: Bell, title: t('admin.notificationCategory', 'Notifications'), desc: t('admin.notificationCategoryDesc', 'Alertes et notifications système') },
    email: { icon: Mail, title: t('admin.emailCategory', 'Email'), desc: t('admin.emailCategoryDesc', 'Configuration des emails sortants') },
    system: { icon: Settings, title: t('admin.systemCategory', 'Système'), desc: t('admin.systemCategoryDesc', 'Paramètres système et performance') },
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
            {t('admin.platformSettings', 'Configuration de la plateforme')}
          </h1>
          <p className="text-muted-foreground">
            {t('admin.platformSettingsDesc', 'Paramètres globaux de configuration')}
          </p>
        </div>
      </div>

      {/* System Status Card - Removed hardcoded values, can be re-added with real data */}
      <Card className="border-[#00833d]/20 bg-gradient-to-br from-[#00833d]/5 to-transparent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00833d]/20">
                <Settings className="h-5 w-5 text-[#00833d]" />
              </div>
              <div>
                <CardTitle className="text-[#00833d]">
                  {t('admin.systemStatus', 'État du Système')}
                </CardTitle>
                <CardDescription>
                  {t('admin.settingsCount', '{{count}} paramètres configurés', { count: generalSettings.length })}
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="border-[#00833d]/50 text-[#00833d]">
              {t('admin.active', 'Actif')}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Configuration Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {categoryKeys.map((categoryKey) => {
          const catSettings = settingsByCategory[categoryKey] || []
          const meta = categoryMeta[categoryKey] || { icon: Settings, title: categoryKey, desc: '' }
          const Icon = meta.icon
          const count = catSettings.length

          return (
            <Card key={categoryKey} className="hover:shadow-md transition-all hover:border-[#00833d]/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00833d]/20">
                    <Icon className="h-4 w-4 text-[#00833d]" />
                  </div>
                  {meta.title}
                  <Badge variant="secondary" className="ml-auto">{count}</Badge>
                </CardTitle>
                <CardDescription>{meta.desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {catSettings.map(renderSetting)}
                {meta.link && (
                  <Button
                    variant="outline"
                    className="w-full border-[#00833d]/30 text-[#00833d] hover:bg-[#00833d]/10"
                    onClick={() => navigate(meta.link!)}
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
