import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CalendarClock, Plus, Download, FileText, Edit, Trash2, Eye } from "lucide-react"
import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"

interface QuarterlyReport {
  id: string
  title: string
  quarter: string
  year: number
  summary: string
  file_url: string | null
  created_at: string
  is_published: boolean
}

const quarters = ['Q1', 'Q2', 'Q3', 'Q4']

export default function QuarterlyReportsSettingsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const initialReports = useMemo(() => [
    {
      id: '1',
      title: t('admin.sampleReportTitle', 'Q4 2023 Activity Report'),
      quarter: 'Q4',
      year: 2023,
      summary: t('admin.sampleReportSummary', 'Summary of activities for the fourth quarter of 2023...'),
      file_url: '/reports/q4-2023.pdf',
      created_at: '2024-01-15',
      is_published: true,
    },
  ], [t])
  const [reports, setReports] = useState<QuarterlyReport[]>(initialReports)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<QuarterlyReport, 'id' | 'created_at'>>({
    title: '',
    quarter: 'Q1',
    year: new Date().getFullYear(),
    summary: '',
    file_url: null,
    is_published: true,
  })

  const startEdit = (report: QuarterlyReport) => {
    setEditingId(report.id)
    setForm(report)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({ title: '', quarter: 'Q1', year: new Date().getFullYear(), summary: '', file_url: null, is_published: true })
  }

  const saveReport = () => {
    if (editingId) {
      setReports(reports.map(r => r.id === editingId ? { ...form, id: editingId } : r))
      toast({ title: t('admin.reportUpdated', 'Rapport mis à jour') })
    } else {
      setReports([...reports, { ...form, id: Date.now().toString(), created_at: new Date().toISOString().split('T')[0] }])
      toast({ title: t('admin.reportCreated', 'Rapport créé') })
    }
    cancelEdit()
  }

  const deleteReport = (id: string) => {
    if (!confirm(t('admin.deleteReportConfirm', 'Êtes-vous sûr de vouloir supprimer ce rapport ?'))) return
    setReports(reports.filter(r => r.id !== id))
    toast({ title: t('admin.reportDeleted', 'Rapport supprimé') })
  }

  const downloadReport = (report: QuarterlyReport) => {
    if (!report.file_url) {
      toast({ title: t('admin.noFile', 'Aucun fichier associé'), variant: 'destructive' })
      return
    }
    window.open(report.file_url, '_blank')
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
            {t('admin.quarterlyReports', 'Rapports trimestriels')}
          </h1>
          <p className="text-muted-foreground">
            {t('admin.quarterlyReportsDesc', 'Gérez les rapports d\'activité trimestriels de l\'organisation')}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('admin.totalReports', 'Total des rapports')}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">
              {reports.filter(r => r.is_published).length} {t('admin.published', 'publiés')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('admin.currentYear', 'Année en cours')}
            </CardTitle>
            <Badge variant="outline">{new Date().getFullYear()}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.year === new Date().getFullYear()).length}
            </div>
            <p className="text-xs text-muted-foreground">{t('admin.thisYear', 'Cette année')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('admin.lastReport', 'Dernier rapport')}
            </CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.length > 0 ? reports[0].quarter : '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              {reports.length > 0 ? reports[0].year : '-'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('admin.downloads', 'Téléchargements')}
            </CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">{t('admin.allTime', 'Tous le temps')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingId ? t('admin.editReport', 'Modifier le rapport') : t('admin.createReport', 'Créer un rapport')}
          </CardTitle>
          <CardDescription>
            {editingId
              ? t('admin.editReportDesc', 'Modifiez les détails du rapport trimestriel')
              : t('admin.createReportDesc', 'Créez un nouveau rapport trimestriel')
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>{t('admin.title', 'Titre')}</Label>
              <Input
                placeholder={t('admin.reportTitlePlaceholder', 'Ex: Rapport Q1 2024')}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('admin.quarter', 'Trimestre')}</Label>
              <div className="flex gap-2">
                {quarters.map(q => (
                  <Button
                    key={q}
                    type="button"
                    variant={form.quarter === q ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setForm({ ...form, quarter: q })}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('admin.year', 'Année')}</Label>
              <Input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t('admin.summary', 'Résumé')}</Label>
            <Textarea
              placeholder={t('admin.reportSummaryPlaceholder', 'Résumé des activités du trimestre...')}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              rows={3}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                className="h-4 w-4"
              />
              {t('admin.publishReport', 'Publier le rapport')}
            </Label>
            <div className="flex gap-2">
              {editingId && (
                <Button variant="outline" onClick={cancelEdit}>
                  {t('admin.cancel', 'Annuler')}
                </Button>
              )}
              <Button onClick={saveReport} disabled={!form.title || !form.summary}>
                {editingId ? (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    {t('admin.update', 'Mettre à jour')}
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('admin.create', 'Créer')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.reportsList', 'Liste des rapports')}</CardTitle>
          <CardDescription>
            {t('admin.reportsListDesc', 'Historique de tous les rapports trimestriels')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20">
                    <FileText className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{report.title}</h3>
                      <Badge variant="outline">{report.quarter} {report.year}</Badge>
                      {report.is_published ? (
                        <Badge variant="default" className="bg-green-500/20 text-green-500 border-green-500/50">
                          <Eye className="h-3 w-3 mr-1" />
                          {t('admin.published', 'Publié')}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">{t('admin.draft', 'Brouillon')}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{report.summary}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('admin.created', 'Created')} {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {report.file_url && (
                    <Button variant="outline" size="sm" onClick={() => downloadReport(report)}>
                      <Download className="h-4 w-4 mr-2" />
                      {t('admin.download', 'Télécharger')}
                    </Button>
                  )}
                  <Button variant="outline" size="icon" onClick={() => startEdit(report)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteReport(report.id)}>
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
