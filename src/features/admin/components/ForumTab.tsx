import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForumCategories, useCreateForumCategory, useUpdateForumCategory, useDeleteForumCategory } from '../hooks/useContentManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, MessageSquare } from 'lucide-react';
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

interface ForumCategoryFormData {
  name: string;
  slug?: string;
  description: string;
  color: string;
}

export function ForumTab() {
  const { t } = useTranslation();
  const { data: categories, isLoading } = useForumCategories();
  const createCategory = useCreateForumCategory();
  const updateCategory = useUpdateForumCategory();
  const deleteCategory = useDeleteForumCategory();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<ForumCategoryFormData>();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const onSubmit = async (data: ForumCategoryFormData) => {
    const slug = data.slug || data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const submissionData = { ...data, slug };
    
    if (editingId) {
      await updateCategory.mutateAsync({ id: editingId, ...submissionData });
    } else {
      await createCategory.mutateAsync(submissionData as any);
    }
    reset();
    setEditingId(null);
    setIsOpen(false);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setValue('name', item.name);
    setValue('description', item.description || '');
    setValue('color', item.color || '#000000');
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('admin.confirmDelete', 'Êtes-vous sûr de vouloir supprimer ?'))) {
      await deleteCategory.mutateAsync(id);
    }
  };

  const totalPages = Math.ceil((categories?.length || 0) / itemsPerPage);
  const paginatedCategories = (categories || []).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('admin.forumManagement', 'Catégories')}</CardTitle>
            <CardDescription>{t('admin.forumManagementDesc', 'Gérer les catégories du forum')}</CardDescription>
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
                  {editingId ? t('admin.editCategory', 'Modifier une catégorie') : t('admin.createCategory', 'Créer une catégorie')}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name">{t('forum.categoryName', 'Nom de la catégorie')}</Label>
                  <Input id="name" {...register('name', { required: true })} />
                </div>
                <div>
                  <Label htmlFor="description">{t('forum.description', 'Description')}</Label>
                  <Textarea id="description" {...register('description')} rows={3} />
                </div>
                <div>
                  <Label htmlFor="color">{t('forum.color', 'Couleur')}</Label>
                  <Input id="color" type="color" {...register('color')} className="h-10 w-full" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    {t('common.cancel', 'Annuler')}
                  </Button>
                  <Button type="submit" disabled={createCategory.isPending || updateCategory.isPending}>
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
              <TableHead>{t('forum.categoryName', 'Catégorie')}</TableHead>
              <TableHead>{t('forum.description', 'Description')}</TableHead>
              <TableHead>{t('forum.color', 'Couleur')}</TableHead>
              <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4}>{t('common.loading', 'Chargement...')}</TableCell></TableRow>
            ) : paginatedCategories.length === 0 ? (
              <TableRow><TableCell colSpan={4}>{t('admin.noCategories', 'Aucune catégorie')}</TableCell></TableRow>
            ) : (
              paginatedCategories.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" style={{ color: item.color }} />
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell>{item.description || '-'}</TableCell>
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
