import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ScrollText, Search, Download, Loader2 } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuditLogs } from "../../hooks/useAuditLogs"
import type { AuditLogEntry } from "../../types"

export default function AuditLogsSettingsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: logs = [], isLoading } = useAuditLogs()
  const [searchQuery, setSearchQuery] = useState('')

  const getActionBadgeColor = (action: string) => {
    const upperAction = action.toUpperCase()
    switch (upperAction) {
      case 'CREATE':
      case 'INSERT':
        return 'bg-[#00833d]/20 text-[#00833d] border-[#00833d]/50'
      case 'UPDATE':
        return 'bg-[#ffe700]/30 text-[#00833d] border-[#00833d]/50'
      case 'DELETE':
        return 'bg-red-500/20 text-red-500 border-red-500/50'
      case 'LOGIN':
      case 'AUTHENTICATE':
        return 'bg-[#00833d]/20 text-[#00833d] border-[#00833d]/50'
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/50'
    }
  }

  const formatLogDetails = (log: AuditLogEntry): string => {
    if (!log.metadata) return `${log.action} ${log.target_table || ''}`
    const target = log.target_table ? `${log.target_table}` : ''
    const id = log.target_id ? ` (${log.target_id.slice(0, 8)}...)` : ''
    return `${log.action} ${target}${id}`
  }

  const filteredLogs = logs.filter(log => {
    const searchLower = searchQuery.toLowerCase()
    return (
      log.action.toLowerCase().includes(searchLower) ||
      (log.target_table && log.target_table.toLowerCase().includes(searchLower)) ||
      (log.metadata && JSON.stringify(log.metadata).toLowerCase().includes(searchLower))
    )
  })

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Action', 'Entity', 'Details'].join(','),
      ...filteredLogs.map(log => [
        log.created_at,
        log.action,
        log.target_table || 'N/A',
        formatLogDetails(log),
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#00833d]" />
      </div>
    )
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
            {t('admin.auditLogs', 'Logs d\'audit')}
          </h1>
          <p className="text-muted-foreground">
            {t('admin.auditLogsDesc', 'Consultez l\'historique des actions effectuées')}
          </p>
        </div>
      </div>

      {/* Search and Export */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('admin.searchLogsPlaceholder', 'Rechercher dans les logs...')}
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={exportLogs}
          className="border-[#00833d]/30 text-[#00833d] hover:bg-[#00833d]/10"
        >
          <Download className="h-4 w-4 mr-2" />
          {t('admin.export', 'Exporter')}
        </Button>
      </div>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-[#00833d]" />
            {t('admin.recentActivity', 'Activité Récente')}
            <Badge variant="secondary" className="ml-auto">
              {filteredLogs.length} {t('admin.entries', 'entrées')}
            </Badge>
          </CardTitle>
          <CardDescription>
            {t('admin.logsDescription', 'Journal des actions système et des modifications')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ScrollText className="mx-auto h-12 w-12 mb-4 opacity-30" />
              <p>{searchQuery ? t('admin.noLogsFound', 'Aucun log trouvé') : t('admin.noLogs', 'Aucun log disponible')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLogs.slice(0, 100).map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getActionBadgeColor(log.action)}>
                        {log.action}
                      </Badge>
                      {log.target_table && (
                        <span className="text-sm text-muted-foreground">
                          {log.target_table}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatLogDetails(log)}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString('fr-FR')}
                  </div>
                </div>
              ))}
              {filteredLogs.length > 100 && (
                <div className="text-center text-sm text-muted-foreground pt-2">
                  {t('admin.showingFirst', 'Affichage des 100 premiers résultats sur {{count}}', { count: filteredLogs.length })}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
