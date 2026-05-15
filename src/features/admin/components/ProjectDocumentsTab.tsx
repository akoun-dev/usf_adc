import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { File, Upload, Trash2, Download, Eye, Clock, AlertCircle } from 'lucide-react'
import { useProjectDocuments, useCreateProjectDocument, useDeleteProjectDocument } from '../hooks/useContentManagement'
import * as adminService from '../services/admin-service'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface ProjectDocumentsTabProps {
  projectId: string
  onDocumentsChange?: (documents: any[]) => void
}

export function ProjectDocumentsTab({ projectId, onDocumentsChange }: ProjectDocumentsTabProps) {
  const { t } = useTranslation()
  const { data: documents = [], isLoading: isLoadingDocs } = useProjectDocuments(projectId)
  const createDocumentMutation = useCreateProjectDocument()
  const deleteDocumentMutation = useDeleteProjectDocument(projectId)
  
  const [file, setFile] = useState<File | null>(null)
  const [validityEndDate, setValidityEndDate] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file || !projectId) return
    
    try {
      setIsUploading(true)
      
      // 1. Upload file to storage
      const uploadResult = await adminService.uploadDocumentFile(file)
      
      // 2. Create record in project_documents table
      await createDocumentMutation.mutateAsync({
        project_id: projectId,
        file_name: file.name,
        file_path: uploadResult.filePath,
        file_size: file.size,
        mime_type: file.type,
        file_url: uploadResult.url,
        validity_end_date: validityEndDate || null
      })
      
      setFile(null)
      setValidityEndDate('')
      toast.success(t('admin.documentUploaded', 'Document mis en ligne avec succès'))
      
      if (onDocumentsChange) {
        onDocumentsChange([...documents])
      }
    } catch (error) {
      console.error('Error uploading document:', error)
      toast.error(t('admin.errorUploading', 'Erreur lors du téléchargement'))
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (documentId: string) => {
    if (confirm(t('admin.confirmDelete', 'Êtes-vous sûr de vouloir supprimer ce document ?'))) {
      try {
        await deleteDocumentMutation.mutateAsync(documentId)
        toast.success(t('admin.documentDeleted', 'Document supprimé'))
      } catch (error) {
        console.error('Error deleting document:', error)
        toast.error(t('admin.errorDeleting', 'Erreur lors de la suppression'))
      }
    }
  }

  const handleDownload = (url: string) => {
    window.open(url, '_blank')
  }

  const isArchived = (date: string | null) => {
    if (!date) return false
    return new Date(date) < new Date()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('project.documents', 'Documents du projet')}</CardTitle>
        <CardDescription>{t('project.documentsDesc', 'Gérer les documents associés au projet')}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div className="border rounded-lg p-4 bg-muted/30">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Upload className="h-4 w-4" />
            {t('project.uploadDocument', 'Ajouter un document')}
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <Label htmlFor="document-upload">{t('project.selectFile', 'Sélectionner un fichier')}</Label>
                <Input
                  id="document-upload"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  className="bg-background"
                />
              </div>
              <div className="md:col-span-1">
                <Label htmlFor="validity-date">{t('document.validityEndDate', 'Date de fin de validité')}</Label>
                <Input
                  id="validity-date"
                  type="date"
                  value={validityEndDate}
                  onChange={(e) => setValidityEndDate(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      {t('common.uploading', 'Envoi...')}
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      {t('common.upload', 'Télécharger')}
                    </>
                  )}
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic">
              {t('project.supportedFormats', 'Formats supportés: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (Max 50MB)')}
            </p>
          </div>
        </div>

        {/* Documents List */}
        <div>
          <h3 className="font-semibold mb-4">{t('project.documentList', 'Liste des documents')}</h3>
          {isLoadingDocs ? (
            <div className="space-y-2">
              <div className="h-10 bg-muted animate-pulse rounded" />
              <div className="h-10 bg-muted animate-pulse rounded" />
            </div>
          ) : documents.length === 0 ? (
            <p className="text-muted-foreground text-center py-8 border rounded-md border-dashed">
              {t('project.noDocuments', 'Aucun document pour ce projet')}
            </p>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>{t('common.name', 'Nom')}</TableHead>
                    <TableHead>{t('common.type', 'Type')}</TableHead>
                    <TableHead>{t('common.validity', 'Validité')}</TableHead>
                    <TableHead>{t('common.status', 'Statut')}</TableHead>
                    <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc: any) => (
                    <TableRow key={doc.id} className={isArchived(doc.validity_end_date) ? "bg-red-50/30" : ""}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4 text-primary" />
                          <span className="truncate max-w-[200px]">{doc.file_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {doc.mime_type?.split('/')[1]?.toUpperCase() || 'FILE'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {doc.validity_end_date ? (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {format(new Date(doc.validity_end_date), 'dd/MM/yyyy')}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {isArchived(doc.validity_end_date) ? (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {t('document.archived', 'Archivé')}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                            {t('document.active', 'Actif')}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleDownload(doc.file_url)}
                            title={t('common.view', 'Voir')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleDownload(doc.file_url)}
                            title={t('common.download', 'Télécharger')}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(doc.id)}
                            title={t('common.delete', 'Supprimer')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}