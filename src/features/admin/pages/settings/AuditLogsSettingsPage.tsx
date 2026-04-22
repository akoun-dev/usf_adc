import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ScrollText, Search, Filter, Download } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

interface AuditLog {
  id: string
  action: string
  entity: string
  user: string
  timestamp: string
  ip: string
  details: string
}

export default function AuditLogsSettingsPage() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')

  const logs: AuditLog[] = [
    {
      id: '1',
      action: 'UPDATE',
      entity: 'user',
      user: 'admin@test.local',
      timestamp: '2024-01-20T14:30:00',
      ip: '192.168.1.100',
      details: 'Updated role for user john@example.com',
    },
    {
      id: '2',
      action: 'DELETE',
      entity: 'document',
      user: 'admin@test.local',
      timestamp: '2024-01-20T14:25:00',
      ip: '192.168.1.100',
      details: 'Deleted document: "Report Q4 2023"',
    },
    {
      id: '3',
      action: 'CREATE',
      entity: 'invitation',
      user: 'admin@test.local',
      timestamp: '2024-01-20T14:20:00',
      ip: '192.168.1.100',
      details: 'Created invitation for jane@example.com',
    },
    {
      id: '4',
      action: 'LOGIN',
      entity: 'auth',
      user: 'admin@test.local',
      timestamp: '2024-01-20T14:15:00',
      ip: '192.168.1.100',
      details: 'User logged in successfully',
    },
  ]

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-[#00833d]/20 text-[#00833d] border-[#00833d]/50'
      case 'UPDATE':
        return 'bg-[#ffe700]/30 text-[#00833d] border-[#00833d]/50'
      case 'DELETE':
        return 'bg-red-500/20 text-red-500 border-red-500/50'
      case 'LOGIN':
        return 'bg-[#00833d]/20 text-[#00833d] border-[#00833d]/50'
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/50'
    }
  }

  const filteredLogs = logs.filter(log =>
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            {t('admin.auditLogs', 'Logs d\'audit')}
          </h1>
          <p className="text-muted-foreground">
            {t('admin.auditLogsDesc', 'Consultez l\'historique des actions effectuées sur la plateforme')}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('admin.totalEvents', 'Total des événements')}
            </CardTitle>
            <ScrollText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">{t('admin.last24h', 'Dernières 24h')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('admin.activeUsers', 'Utilisateurs actifs')}
            </CardTitle>
            <Badge variant="outline">{t('admin.unique', 'Uniques')}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">{t('admin.performedActions', 'Ont effectué des actions')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('admin.failedAttempts', 'Tentatives échouées')}
            </CardTitle>
            <Badge variant="destructive">{t('admin.alert', 'Alerte')}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">3</div>
            <p className="text-xs text-muted-foreground">{t('admin.needAttention', 'Nécessitent attention')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('admin.retentionDays', 'Rétention')}
            </CardTitle>
            <Badge variant="outline">{t('admin.days', 'jours')}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">90</div>
            <p className="text-xs text-muted-foreground">{t('admin.logRetention', 'Rétention des logs')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('admin.searchLogsPlaceholder', 'Rechercher dans les logs...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          {t('admin.filter', 'Filtrer')}
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          {t('admin.export', 'Exporter')}
        </Button>
      </div>

      {/* Logs List */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.recentActivity', 'Activité récente')}</CardTitle>
          <CardDescription>
            {t('admin.recentActivityDesc', 'Dernières actions effectuées sur la plateforme')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col items-center gap-1">
                  <Badge variant="outline" className={getActionBadgeColor(log.action)}>
                    {log.action}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{log.details}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{log.user}</span>
                    <span>•</span>
                    <span>{log.entity}</span>
                    <span>•</span>
                    <span>{log.ip}</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
