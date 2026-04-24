import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { useDocuments, useCreateDocument, useUpdateDocument, useDeleteDocument, useSearchDocuments, useDocumentTags, useDocumentVersions, useRestoreDocumentVersion } from '../hooks/useContentManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pencil, Trash2, Plus, FileText, Upload, Search, Tag, X, Filter, Download, Eye, History, RotateCcw, File } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as adminService from '../services/admin-service';

interface DocumentFormData {
  title: string;
  description: string;
  category: string;
  file?: File;
  file_url?: string;
  file_name?: string;
  file_path?: string;
  file_size?: number;
  mime_type?: string;
  is_public: boolean;
  tags: string[];
}

interface DocumentWithTags {
  id: string;
  title: string;
  description: string;
  category: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  is_public: boolean;
  created_at: string;
  tags: string[];
  upload_progress?: number;
  is_uploading?: boolean;
}

const DOCUMENT_CATEGORIES = [
  { value: 'guides', label: 'Guides' },
  { value: 'reports', label: 'Reports' },
  { value: 'policies', label: 'Policies' },
  { value: 'bulletins', label: 'Bulletins' },
  { value: 'forms', label: 'Forms' },
  { value: 'manuals', label: 'Manuals' },
  { value: 'templates', label: 'Templates' },
  { value: 'presentations', label: 'Presentations' },
  { value: 'regulations', label: 'Regulations' },
  { value: 'studies', label: 'Studies' },
  { value: 'general', label: 'General' }
];

export function DocumentsTab() {
  const { t } = useTranslation();
  const { data: documents, isLoading } = useDocuments();
  const { data: searchResults, isLoading: isSearching, mutate: executeSearch } = useSearchDocuments();
  const createDocument = useCreateDocument();
  const updateDocument = useUpdateDocument();
  const deleteDocument = useDeleteDocument();
  const { data: allTags } = useDocumentTags();
  const restoreVersion = useRestoreDocumentVersion();
  
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDocForVersions, setSelectedDocForVersions] = useState<string | null>(null);
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);
  const { data: versions } = useDocumentVersions(selectedDocForVersions || '');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  
  const { register, handleSubmit, reset, setValue, watch, control } = useForm<DocumentFormData>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const onSubmit = async (data: DocumentFormData) => {
    try {
      if (editingId) {
        await updateDocument.mutateAsync({ id: editingId, ...data });
      } else {
        await createDocument.mutateAsync(data);
      }
      reset();
      setEditingId(null);
      setIsOpen(false);
      setFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error('Error saving document:', error);
      // Add user feedback here
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                          'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                          'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
      
      if (!validTypes.includes(selectedFile.type)) {
        alert(t('admin.invalidFileType', 'Type de fichier non valide. Veuillez télécharger un PDF, DOCX, XLSX ou PPTX.'));
        return;
      }
      
      // Validate file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert(t('admin.fileTooLarge', 'Le fichier est trop volumineux. Maximum 10 Mo.'));
        return;
      }
      
      setFile(selectedFile);
      setValue('file', selectedFile);
      setValue('file_name', selectedFile.name);
      setValue('file_size', selectedFile.size);
      setValue('mime_type', selectedFile.type);
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Call actual upload function
      const result = await adminService.uploadDocumentFile(file);
      
      setUploadProgress(100);
      clearInterval(interval);
      
      setValue('file_path', result.path);
      setValue('file_url', result.url);
      
      return result;
    } catch (error) {
      console.error('Upload failed:', error);
      alert(t('admin.uploadFailed', 'Échec du téléchargement du fichier'));
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setValue('tags', tagsArray);
  };
  
  const handleSearch = useCallback(() => {
    executeSearch({
      searchTerm,
      categories: selectedCategories,
      tags: selectedTags
    });
  }, [searchTerm, selectedCategories, selectedTags, executeSearch]);
  
  // Auto-search when search term changes
  useEffect(() => {
    if (searchTerm.length > 2) { // Only search if at least 3 characters
      const timer = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(timer);
    } else if (searchTerm.length === 0) {
      // Clear search results when search term is empty
      queryClient.setQueryData(['search-results'], []);
    }
  }, [searchTerm, handleSearch, queryClient]);
  
  const handleCategoryFilter = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };
  
  const handleTagFilter = (tagsString: string) => {
    const tagsArray = tagsString.split(',').map(t => t.trim()).filter(t => t.length > 0);
    setSelectedTags(tagsArray);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setValue('title', item.title);
    setValue('description', item.description || '');
    setValue('category', item.category || '');
    setValue('file_url', item.file_url || '');
    setValue('file_name', item.file_name || '');
    setValue('file_path', item.file_path || '');
    setValue('file_size', item.file_size || 0);
    setValue('mime_type', item.mime_type || '');
    setValue('is_public', item.is_public || false);
    setValue('tags', item.tags || []);
    setIsOpen(true);
  };

  const handleViewVersions = (docId: string) => {
    setSelectedDocForVersions(docId);
    setIsVersionsOpen(true);
  };

  const handleRestoreVersion = async (versionId: string) => {
    await restoreVersion.mutateAsync(versionId);
    setIsVersionsOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('admin.confirmDelete', 'Êtes-vous sûr de vouloir supprimer ?'))) {
      await deleteDocument.mutateAsync(id);
    }
  };

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('admin.documentsManagement', 'Gestion des documents')}</CardTitle>
            <CardDescription>{t('admin.documentsManagementDesc', 'Gérer la bibliothèque de documents')}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAdvancedSearchOpen} onOpenChange={setIsAdvancedSearchOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  {t('admin.advancedSearch', 'Recherche avancée')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>{t('admin.advancedSearch', 'Recherche avancée')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="searchTerm">{t('common.search', 'Rechercher')}</Label>
                    <Input
                      id="searchTerm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={t('admin.searchPlaceholder', 'Rechercher dans les titres, descriptions...')}
                    />
                  </div>
                  <div>
                    <Label>{t('document.categories', 'Catégories')}</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {DOCUMENT_CATEGORIES.map((category) => (
                        <Button
                          key={category.value}
                          type="button"
                          variant={selectedCategories.includes(category.value) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleCategoryFilter(category.value)}
                        >
                          {category.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="searchTags">{t('document.tags', 'Tags')}</Label>
                    <Input
                      id="searchTags"
                      value={selectedTags.join(', ')}
                      onChange={(e) => setSelectedTags(e.target.value.split(',').map(t => t.trim()).filter(t => t.length > 0))}
                      placeholder={t('document.tagsPlaceholder', 'Filtrer par tags (séparés par virgules)')}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAdvancedSearchOpen(false)}>
                      {t('common.cancel', 'Annuler')}
                    </Button>
                    <Button type="button" onClick={handleSearch}>
                      {t('common.search', 'Rechercher')}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { reset(); setEditingId(null); setFile(null); setUploadProgress(0); }}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('common.add', 'Ajouter')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
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
                    <Label htmlFor="category">{t('document.category', 'Catégorie')}</Label>
                    <Select onValueChange={(value) => setValue('category', value)} value={watch('category') || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('document.selectCategory', 'Sélectionner une catégorie')} />
                      </SelectTrigger>
                      <SelectContent>
                        {DOCUMENT_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">{t('document.description', 'Description')}</Label>
                    <Textarea id="description" {...register('description')} rows={3} />
                  </div>
                  
                  <div>
                    <Label>{t('document.fileUpload', 'Télécharger un fichier')}</Label>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {t('document.selectFile', 'Sélectionner un fichier')}
                      </Button>
                      {file && (
                        <div className="mt-2 text-sm">
                          <p>{file.name} ({Math.round(file.size / 1024)} KB)</p>
                          {isUploading && (
                            <div className="mt-2">
                              <Progress value={uploadProgress} className="w-full" />
                              <p className="text-xs text-muted-foreground mt-1">
                                {uploadProgress}% {t('document.uploading', 'Téléchargement...')}
                              </p>
                            </div>
                          )}
                          {!isUploading && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="mt-2"
                              onClick={handleUpload}
                            >
                              <Upload className="mr-2 h-3 w-3" />
                              {t('document.upload', 'Télécharger')}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="tags">{t('document.tags', 'Tags')}</Label>
                    <Input
                      id="tags"
                      {...register('tags', {
                        onChange: handleTagChange
                      })}
                      placeholder={t('document.tagsPlaceholder', 'Entrez des tags séparés par des virgules')}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('document.tagsHelp', 'Séparez les tags par des virgules')}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_public"
                      checked={watch('is_public') || false}
                      onCheckedChange={(checked) => setValue('is_public', checked as boolean)}
                    />
                    <Label htmlFor="is_public">{t('document.publicDocument', 'Document public')}</Label>
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <div className="flex gap-2">
              <Input
                placeholder={t('admin.searchDocuments', 'Rechercher des documents...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="pl-9"
              />
              <Button onClick={handleSearch} size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('document.title', 'Titre')}</TableHead>
              <TableHead>{t('document.category', 'Catégorie')}</TableHead>
              <TableHead>{t('document.tags', 'Tags')}</TableHead>
              <TableHead>{t('document.createdAt', 'Créé le')}</TableHead>
              <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isSearching ? (
              <TableRow><TableCell colSpan={5}>{t('common.loading', 'Chargement...')}</TableCell></TableRow>
            ) : (searchResults?.length > 0 ? searchResults : documents)?.length === 0 ? (
              <TableRow><TableCell colSpan={5}>{t('admin.noDocuments', 'Aucun document')}</TableCell></TableRow>
            ) : (
              (searchResults?.length > 0 ? searchResults : documents)?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {item.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {DOCUMENT_CATEGORIES.find(c => c.value === item.category)?.label || item.category || '-'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.tags?.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{item.created_at ? new Date(item.created_at).toLocaleDateString('fr-FR') : '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => handleViewVersions(item.id)} title={t('document.versions', 'Versions')}>
                        <History className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Eye className="h-4 w-4" />
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

    {/* Versions History Dialog */}
    <Dialog open={isVersionsOpen} onOpenChange={setIsVersionsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            {t('document.versionHistory', 'Historique des versions')}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          {versions && versions.length > 0 ? (
            <div className="space-y-3">
              {versions.map((version) => (
                <div key={version.id} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                      <span className="text-sm font-medium">v{version.version_number}</span>
                    </div>
                    <div>
                      <p className="font-medium">{version.file_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {version.file_size ? `${Math.round(version.file_size / 1024)} KB` : '-'} • {new Date(version.created_at).toLocaleDateString('fr-FR')}
                      </p>
                      {version.changelog && (
                        <p className="text-sm mt-1">{version.changelog}</p>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRestoreVersion(version.id)}
                    disabled={restoreVersion.isPending}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    {t('document.restore', 'Restaurer')}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('document.noVersions', 'Aucune version disponible')}</p>
            </div>
          )}
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsVersionsOpen(false)}>
            {t('common.close', 'Fermer')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
