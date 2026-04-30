/**
 * Page d'administration de la co-rédaction
 * Liste des documents avec gestion complète
 */
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  FileText,
  Edit,
  Trash2,
  MoreHorizontal,
  Lock,
  Unlock,
  Eye,
  Upload,
  CheckCircle,
  RotateCcw,
  Send,
  Shield,
  History,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import PageHero from '@/components/PageHero';
import { DocumentStatusBadge } from '../components/DocumentStatusBadge';
import { LockIndicator } from '../components/LockIndicator';
import { DocumentPermissionsDialog } from '../components/DocumentPermissionsDialog';
import {
  useDocuments,
  useCreateDocument,
  useDeleteDocument,
  useForceUnlockDocument,
  useChangeWorkflowStatus,
  useUploadFile,
  useDocumentsRealtime,
} from '../hooks/useCoRedaction';
import type { CoDocument, DocumentWorkflowStatus } from '../types';

const CATEGORIES = [
  { value: 'general', label: 'Général' },
  { value: 'legal', label: 'Juridique' },
  { value: 'technical', label: 'Technique' },
  { value: 'reports', label: 'Rapports' },
  { value: 'templates', label: 'Modèles' },
  { value: 'policy', label: 'Politiques' },
];

export default function AdminCoRedactionPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Realtime
  useDocumentsRealtime();

  const { data: documents, isLoading } = useDocuments({
    search: search || undefined,
    status: statusFilter !== 'all' ? (statusFilter as DocumentWorkflowStatus) : undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
  });

  const createDoc = useCreateDocument();
  const deleteDoc = useDeleteDocument();
  const forceUnlock = useForceUnlockDocument();
  const changeStatus = useChangeWorkflowStatus();
  const uploadMutation = useUploadFile();

  const handleCreate = useCallback(async () => {
    if (!newTitle.trim()) return;

    let fileUrl: string | undefined;
    if (uploadFile) {
      // Create doc first, then upload
      const doc = await createDoc.mutateAsync({
        title: newTitle.trim(),
        description: newDescription.trim() || undefined,
        category: newCategory,
      });
      fileUrl = await uploadMutation.mutateAsync({ file: uploadFile, documentId: doc.id });
    } else {
      await createDoc.mutateAsync({
        title: newTitle.trim(),
        description: newDescription.trim() || undefined,
        category: newCategory,
      });
    }

    setNewTitle('');
    setNewDescription('');
    setNewCategory('general');
    setUploadFile(null);
    setCreateOpen(false);
  }, [newTitle, newDescription, newCategory, uploadFile, createDoc, uploadMutation]);

  const handleDelete = useCallback((doc: CoDocument) => {
    if (window.confirm(t('coRedaction.confirmDelete', 'Supprimer ce document ?'))) {
      deleteDoc.mutate(doc.id);
    }
  }, [deleteDoc, t]);

  const formatDate = (date: string) => {
    return format(new Date(date), 'PPp', { locale: fr });
  };

  return (
    <div>
      <PageHero
        title={t('coRedaction.adminTitle', 'Co-Rédaction')}
        subtitle={t('coRedaction.adminSubtitle', 'Gestion collaborative des documents')}
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Barre d'outils */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('coRedaction.search', 'Rechercher un document...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t('coRedaction.filterStatus', 'Filtrer par statut')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('coRedaction.allStatus', 'Tous les statuts')}</SelectItem>
              <SelectItem value="draft">{t('coRedaction.statusDraft', 'Brouillon')}</SelectItem>
              <SelectItem value="editing">{t('coRedaction.statusEditing', 'En édition')}</SelectItem>
              <SelectItem value="submitted">{t('coRedaction.statusSubmitted', 'Soumis')}</SelectItem>
              <SelectItem value="closed">{t('coRedaction.statusClosed', 'Clôturé')}</SelectItem>
              <SelectItem value="reopened">{t('coRedaction.statusReopened', 'Réouvert')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t('coRedaction.filterCategory', 'Catégorie')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('coRedaction.allCategories', 'Toutes catégories')}</SelectItem>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {t('coRedaction.newDocument', 'Nouveau document')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('coRedaction.createDocument', 'Créer un document')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>{t('coRedaction.title', 'Titre')}</Label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={t('coRedaction.titlePlaceholder', 'Titre du document')}
                  />
                </div>
                <div>
                  <Label>{t('coRedaction.description', 'Description')}</Label>
                  <Textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder={t('coRedaction.descriptionPlaceholder', 'Description du document')}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>{t('coRedaction.category', 'Catégorie')}</Label>
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('coRedaction.attachFile', 'Fichier joint (optionnel)')}</Label>
                  <Input
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  />
                </div>
                <Button
                  onClick={handleCreate}
                  disabled={!newTitle.trim() || createDoc.isPending}
                  className="w-full"
                >
                  {createDoc.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {t('coRedaction.create', 'Créer')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table des documents */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : documents && documents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('coRedaction.title', 'Titre')}</TableHead>
                    <TableHead>{t('coRedaction.category', 'Catégorie')}</TableHead>
                    <TableHead>{t('coRedaction.status', 'Statut')}</TableHead>
                    <TableHead>{t('coRedaction.lock', 'Verrou')}</TableHead>
                    <TableHead>{t('coRedaction.lastModified', 'Dernière modification')}</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id} className="cursor-pointer" onClick={() => navigate(`/admin/co-redaction/${doc.id}`)}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div>
                            <p className="font-medium line-clamp-1">{doc.title}</p>
                            {doc.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1">{doc.description}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {CATEGORIES.find(c => c.value === doc.category)?.label || doc.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DocumentStatusBadge status={doc.status_workflow} />
                      </TableCell>
                      <TableCell>
                        <LockIndicator
                          lockedBy={doc.locked_by}
                          lockedAt={doc.locked_at}
                          lockedByName={doc.locked_by_profile?.full_name}
                          currentUserId={user?.id}
                          compact
                        />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(doc.updated_at)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem onClick={() => navigate(`/admin/co-redaction/${doc.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              {t('coRedaction.view', 'Voir')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/admin/co-redaction/${doc.id}/edit`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              {t('coRedaction.edit', 'Éditer')}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <DocumentPermissionsDialog
                                documentId={doc.id}
                                trigger={
                                  <span className="flex items-center">
                                    <Shield className="mr-2 h-4 w-4" />
                                    {t('coRedaction.permissions', 'Permissions')}
                                  </span>
                                }
                              />
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {doc.locked_by && (
                              <DropdownMenuItem onClick={() => forceUnlock.mutate(doc.id)}>
                                <Unlock className="mr-2 h-4 w-4" />
                                {t('coRedaction.forceUnlock', 'Déverrouiller de force')}
                              </DropdownMenuItem>
                            )}
                            {['draft', 'editing', 'submitted', 'reopened'].includes(doc.status_workflow) && (
                              <DropdownMenuItem onClick={() => changeStatus.mutate({ id: doc.id, status: 'closed' })}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                {t('coRedaction.close', 'Clôturer et publier')}
                              </DropdownMenuItem>
                            )}
                            {doc.status_workflow === 'closed' && (
                              <DropdownMenuItem onClick={() => changeStatus.mutate({ id: doc.id, status: 'reopened' })}>
                                <RotateCcw className="mr-2 h-4 w-4" />
                                {t('coRedaction.reopen', 'Réouvrir')}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(doc)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t('coRedaction.delete', 'Supprimer')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <FileText className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">{t('coRedaction.noDocuments', 'Aucun document')}</p>
                <p className="text-sm">{t('coRedaction.createFirst', 'Créez votre premier document')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
