import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { File, Upload, Trash2, Download, Eye } from 'lucide-react'

interface ProjectDocumentsTabProps {
  projectId?: string
  onDocumentsChange?: (documents: any[]) => void
}

export function ProjectDocumentsTab({ projectId, onDocumentsChange }: ProjectDocumentsTabProps) {
  const { t } = useTranslation()
  const [documents, setDocuments] = useState<any[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return
    
    try {
      setIsUploading(true)
      // Simuler l'upload pour la démo
      const newDoc = {
        id: Date.now().toString(),
        file_name: file.name,
        mime_type: file.type,
        file_size: file.size,
        created_at: new Date().toISOString(),
        url: URL.createObjectURL(file)
      }
      
      const newDocuments = [...documents, newDoc]
      setDocuments(newDocuments)
      setFile(null)
      
      if (onDocumentsChange) {
        onDocumentsChange(newDocuments)
      }
    } catch (error) {
      console.error('Error uploading document:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (documentId: string) => {
    if (confirm(t('admin.confirmDelete', 'Êtes-vous sûr de vouloir supprimer ce document ?'))) {
      try {
        const updatedDocs = documents.filter(doc => doc.id !== documentId)
        setDocuments(updatedDocs)
        if (onDocumentsChange) {
          onDocumentsChange(updatedDocs)
        }
      } catch (error) {
        console.error('Error deleting document:', error)
      }
    }
  }

  const handleDownload = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('project.documents', 'Documents du projet')}</CardTitle>
        <CardDescription>{t('project.documentsDesc', 'Gérer les documents associés au projet')}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-4">{t('project.uploadDocument', 'Ajouter un document')}</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="document-upload">{t('project.selectFile', 'Sélectionner un fichier')}</Label>
                <Input
                  id="document-upload"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? t('common.uploading', 'Téléchargement...') : t('common.upload', 'Télécharger')}
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('project.supportedFormats', 'Formats supportés: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX')}
            </p>
          </div>
        </div>

        {/* Documents List */}
        <div>
          <h3 className="font-semibold mb-4">{t('project.documentList', 'Liste des documents')}</h3>
          {documents.length === 0 ? (
            <p className="text-muted-foreground">{t('project.noDocuments', 'Aucun document pour ce projet')}</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('common.name', 'Nom')}</TableHead>
                    <TableHead>{t('common.type', 'Type')}</TableHead>
                    <TableHead>{t('common.size', 'Taille')}</TableHead>
                    <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc: any) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.file_name}</TableCell>
                      <TableCell>{doc.mime_type.split('/')[1].toUpperCase()}</TableCell>
                      <TableCell>{Math.round(doc.file_size / 1024)} KB</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDownload(doc.url)}
                            title={t('common.view', 'Voir')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDownload(doc.url)}
                            title={t('common.download', 'Télécharger')}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(doc.id)}
                            title={t('common.delete', 'Supprimer')}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
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