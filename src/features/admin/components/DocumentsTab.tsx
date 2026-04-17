import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDocuments, useCreateDocument, useUpdateDocument, useDeleteDocument } from '../hooks/useContentManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface DocumentFormData {
  title: string;
  description: string;
  file_url: string;
  document_type: string;
}

const DOCUMENT_TYPES = ['guide', 'report', 'policy', 'form', 'manual', 'other'];

export function DocumentsTab() {
  const { t } = useTranslation();
  const { data: documents, isLoading } = useDocuments();
  const createDocument = useCreateDocument();
  const updateDocument = useUpdateDocument();
  const deleteDocument = useDeleteDocument();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<DocumentFormData>();

  const onSubmit = async (data: DocumentFormData) => {
    if (editingId) {
      await updateDocument.mutateAsync({ id: editingId, ...data });
    } else {
      await createDocument.mutateAsync(data);
    }
    reset();
    setEditingId(null);
    setIsOpen(false);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setValue('title', item.title);
    setValue('description', item.description || '');
    setValue('file_url', item.file_url || '');
    setValue('document_type', item.document_type || '');
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('admin.confirmDelete', 'Êtes-vous sûr de vouloir supprimer ?'))) {
      await deleteDocument.mutateAsync(id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('admin.documentsManagement', 'Gestion des documents')}</CardTitle>
            <CardDescription>{t('admin.documentsManagementDesc', 'Gérer la bibliothèque de documents')}</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { reset(); setEditingId(null); }}>
                <Plus className="mr-2 h-4 w-4" />
                {t('common.add', 'Ajouter')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? t('admin.editDocument', 'Modifier un document') : t('admin.createDocument', 'Créer un document')}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="title">{t('document.title', 'Titre')}</Label>
                  <Input id="title" {...register('title', { required: true })} />
                </div>
                <div>
                  <Label htmlFor="document_type">{t('document.type', 'Type')}</Label>
                  <Input id="document_type" {...register('document_type')} placeholder="guide, report, etc." />
                </div>
                <div>
                  <Label htmlFor="file_url">{t('document.fileUrl', 'URL du fichier')}</Label>
                  <Input id="file_url" {...register('file_url', { required: true })} placeholder="https://..." />
                </div>
                <div>
                  <Label htmlFor="description">{t('document.description', 'Description')}</Label>
                  <Textarea id="description" {...register('description')} rows={3} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    {t('common.cancel', 'Annuler')}
                  </Button>
                  <Button type="submit" disabled={createDocument.isPending || updateDocument.isPending}>
                    {t('common.save', 'Enregistrer')}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('document.title', 'Titre')}</TableHead>
              <TableHead>{t('document.type', 'Type')}</TableHead>
              <TableHead>{t('document.createdAt', 'Créé le')}</TableHead>
              <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4}>{t('common.loading', 'Chargement...')}</TableCell></TableRow>
            ) : documents?.length === 0 ? (
              <TableRow><TableCell colSpan={4}>{t('admin.noDocuments', 'Aucun document')}</TableCell></TableRow>
            ) : (
              documents?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {item.title}
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary">{item.document_type || '-'}</Badge></TableCell>
                  <TableCell>{item.created_at ? new Date(item.created_at).toLocaleDateString('fr-FR') : '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
