import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForumCategories, useCreateForumCategory, useUpdateForumCategory, useDeleteForumCategory } from '../hooks/useContentManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, MessageSquare, Sparkles, Loader2, Languages } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getLangValue } from '@/types/i18n';
import { translateToFourLang } from '../services/translate.service';
import { useToast } from '@/hooks/use-toast';

interface ForumCategoryFormData {
  name: string | Record<string, string>;
  slug: string | Record<string, string>;
  description: string | Record<string, string>;
  color: string;
}

export function ForumTab() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0];
  const { data: categories, isLoading } = useForumCategories();
  const createCategory = useCreateForumCategory();
  const updateCategory = useUpdateForumCategory();
  const deleteCategory = useDeleteForumCategory();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('fr');
  const [isTranslating, setIsTranslating] = useState(false);
  const [extraTranslations, setExtraTranslations] = useState<Record<string, { name: string, description: string, slug: string }>>({
    en: { name: '', description: '', slug: '' },
    pt: { name: '', description: '', slug: '' },
    ar: { name: '', description: '', slug: '' },
  });

  const { register, handleSubmit, reset, setValue, watch } = useForm<ForumCategoryFormData>();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const onSubmit = async (data: ForumCategoryFormData) => {
    try {
      const frName = (watch('name') as string) || '';
      const frDesc = (watch('description') as string) || '';
      const frSlug = (watch('slug') as string) || frName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      
      const finalData = {
        ...data,
        name: { fr: frName, ...Object.fromEntries(Object.entries(extraTranslations).map(([l, v]) => [l, v.name])) },
        description: { fr: frDesc, ...Object.fromEntries(Object.entries(extraTranslations).map(([l, v]) => [l, v.description])) },
        slug: { fr: frSlug, ...Object.fromEntries(Object.entries(extraTranslations).map(([l, v]) => [l, v.slug])) },
      };

      if (editingId) {
        await updateCategory.mutateAsync({ id: editingId, ...finalData });
      } else {
        await createCategory.mutateAsync(finalData as any);
      }
      
      toast({ title: t('common.success') });
      reset();
      setEditingId(null);
      setIsOpen(false);
      setExtraTranslations({
        en: { name: '', description: '', slug: '' },
        pt: { name: '', description: '', slug: '' },
        ar: { name: '', description: '', slug: '' },
      });
    } catch (error) {
      toast({ title: t('common.error'), variant: 'destructive' });
    }
  };

  const handleEdit = (item: any) => {
    const getVal = (field: any, lang: string) => {
      if (!field) return '';
      if (typeof field === 'object') return field[lang] || '';
      return lang === 'fr' ? field : '';
    };

    setEditingId(item.id);
    setValue('name', getVal(item.name, currentLang));
    setValue('description', getVal(item.description, currentLang));
    setValue('slug', getVal(item.slug, currentLang));
    setValue('color', item.color || '#000000');
    
    const extra: any = {};
    ['en', 'pt', 'ar'].forEach(l => {
      extra[l] = {
        name: getVal(item.name, l),
        description: getVal(item.description, l),
        slug: getVal(item.slug, l),
      };
    });
    setExtraTranslations(extra);
    
    setIsOpen(true);
  };

  const handleDelete = async (item: any) => {
    const displayName = getLangValue(item.name, i18n.language);
    if (confirm(t('admin.forum.confirmDeleteCategory', { name: displayName }, `Supprimer la catégorie "${displayName}" ?`))) {
      await deleteCategory.mutateAsync(item.id);
    }
  };

  const totalPages = Math.ceil((categories?.length || 0) / itemsPerPage);
  const paginatedCategories = (categories || []).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('admin.forum.categoriesManagement', 'Gestion des Catégories')}</CardTitle>
            <CardDescription>{t('admin.forum.categoriesManagementDesc', 'Gérer les catégories du forum')}</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { 
                reset(); 
                setEditingId(null); 
                setExtraTranslations({
                  en: { name: '', description: '' },
                  pt: { name: '', description: '' },
                  ar: { name: '', description: '' },
                });
              }}>
                <Plus className="mr-2 h-4 w-4" />
                {t('common.add', 'Ajouter')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? t('admin.forum.editCategory', 'Modifier une catégorie') : t('admin.forum.createCategory', 'Créer une catégorie')}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-4 w-full mb-4">
                    <TabsTrigger value="fr">{t('common.french', 'Français')}</TabsTrigger>
                    <TabsTrigger value="en">{t('common.english', 'English')}</TabsTrigger>
                    <TabsTrigger value="pt">{t('common.portuguese', 'Português')}</TabsTrigger>
                    <TabsTrigger value="ar">{t('common.arabic', 'العربية')}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="fr" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="name">{t('admin.forum.categoryName', 'Nom de la catégorie')}</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-xs h-7"
                        onClick={async () => {
                          setIsTranslating(true);
                          try {
                            const val = watch('name') as string;
                            if (val) {
                              const trans = await translateToFourLang('fr', val);
                              setExtraTranslations(prev => ({
                                en: { ...prev.en, name: trans.en, slug: trans.en.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') },
                                pt: { ...prev.pt, name: trans.pt, slug: trans.pt.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') },
                                ar: { ...prev.ar, name: trans.ar, slug: trans.ar.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') },
                              }));
                            }
                            const desc = watch('description') as string;
                            if (desc) {
                              const transDesc = await translateToFourLang('fr', desc);
                              setExtraTranslations(prev => ({
                                en: { ...prev.en, description: transDesc.en },
                                pt: { ...prev.pt, description: transDesc.pt },
                                ar: { ...prev.ar, description: transDesc.ar },
                              }));
                            }
                            toast({ title: t('common.success') });
                          } catch (err) {
                            toast({ title: t('common.error'), variant: 'destructive' });
                          } finally {
                            setIsTranslating(false);
                          }
                        }}
                      >
                        <Sparkles className="h-3 w-3" />
                        {t('admin.autoTranslate', 'Traduire via IA')}
                      </Button>
                    </div>
                    <Input id="name" {...register('name', { required: true })} />
                    
                    <div>
                      <Label htmlFor="description">{t('admin.forum.description', 'Description')}</Label>
                      <Textarea id="description" {...register('description')} rows={3} />
                    </div>

                    <div>
                      <Label htmlFor="slug">{t('admin.forum.slug', 'Slug')}</Label>
                      <Input id="slug" {...register('slug')} placeholder={t('admin.forum.slugPlaceholder', 'la-categorie')} />
                    </div>
                  </TabsContent>

                  {['en', 'pt', 'ar'].map((lang) => (
                    <TabsContent key={lang} value={lang} className="space-y-4">
                      <Label htmlFor={`trans-name-${lang}`}>{t('admin.forum.categoryName', 'Nom')} ({lang.toUpperCase()})</Label>
                      <Input 
                        id={`trans-name-${lang}`} 
                        value={extraTranslations[lang]?.name || ''}
                        onChange={(e) => setExtraTranslations(prev => ({
                          ...prev,
                          [lang]: { ...prev[lang], name: e.target.value }
                        }))}
                        dir={lang === 'ar' ? 'rtl' : 'ltr'}
                      />
                      
                      <div>
                        <Label htmlFor={`trans-desc-${lang}`}>{t('admin.forum.description', 'Description')} ({lang.toUpperCase()})</Label>
                        <Textarea 
                          id={`trans-desc-${lang}`} 
                          value={extraTranslations[lang]?.description || ''}
                          onChange={(e) => setExtraTranslations(prev => ({
                            ...prev,
                            [lang]: { ...prev[lang], description: e.target.value }
                          }))}
                          rows={3}
                          dir={lang === 'ar' ? 'rtl' : 'ltr'}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`trans-slug-${lang}`}>{t('admin.forum.slug', 'Slug')} ({lang.toUpperCase()})</Label>
                        <Input 
                          id={`trans-slug-${lang}`} 
                          value={extraTranslations[lang]?.slug || ''}
                          onChange={(e) => setExtraTranslations(prev => ({
                            ...prev,
                            [lang]: { ...prev[lang], slug: e.target.value }
                          }))}
                        />
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>

                <div>
                  <Label htmlFor="color">{t('admin.forum.color', 'Couleur')}</Label>
                  <Input id="color" type="color" {...register('color')} className="h-10 w-full" />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    {t('common.cancel', 'Annuler')}
                  </Button>
                  <Button type="submit" disabled={createCategory.isPending || updateCategory.isPending || isTranslating}>
                    {isTranslating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
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
              <TableHead>{t('admin.forum.categoryName', 'Catégorie')}</TableHead>
              <TableHead>{t('admin.forum.description', 'Description')}</TableHead>
              <TableHead>{t('admin.forum.color', 'Couleur')}</TableHead>
              <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4}>{t('common.loading', 'Chargement...')}</TableCell></TableRow>
            ) : paginatedCategories.length === 0 ? (
              <TableRow><TableCell colSpan={4}>{t('admin.forum.noCategories', 'Aucune catégorie')}</TableCell></TableRow>
            ) : (
              paginatedCategories.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" style={{ color: item.color }} />
                      {getLangValue(item.name, i18n.language)}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground line-clamp-1 max-w-[300px]">
                    {getLangValue(item.description, i18n.language) || '-'}
                  </TableCell>
                  <TableCell>
                    <div 
                      className="h-4 w-4 rounded" 
                      style={{ backgroundColor: item.color || '#000000' }}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(item)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <span>{t('admin.rowsPerPage', 'Lignes par page')}:</span>
                        <Select value={itemsPerPage.toString()} onValueChange={(v) => {
                            setItemsPerPage(parseInt(v));
                            setCurrentPage(1);
                        }}>
                            <SelectTrigger className="w-[70px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <span className="whitespace-nowrap">
                        {Math.min((currentPage - 1) * itemsPerPage + 1, categories?.length || 0)}-
                        {Math.min(currentPage * itemsPerPage, categories?.length || 0)} {t('admin.of', 'sur')} {categories?.length || 0}
                    </span>
                </div>
                <Pagination className="w-auto m-0">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }).map((_, i) => {
                            const pageNum = i + 1;
                            if (
                                pageNum === 1 ||
                                pageNum === totalPages ||
                                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                            ) {
                                return (
                                    <PaginationItem key={pageNum}>
                                        <PaginationLink
                                            isActive={currentPage === pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className="cursor-pointer"
                                        >
                                            {pageNum}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            } else if (
                                pageNum === currentPage - 2 ||
                                pageNum === currentPage + 2
                            ) {
                                return (
                                    <PaginationItem key={pageNum}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                );
                            }
                            return null;
                        })}

                        <PaginationItem>
                            <PaginationNext 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

