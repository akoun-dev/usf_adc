import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNewsCategories, useCreateNewsCategory, useUpdateNewsCategory, useDeleteNewsCategory } from '../../hooks/useContentManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { NewsCategory } from '../../types';
import { CategoryBadge } from '../news/CategoryBadge';

interface CategoryFormData {
  name_fr: string;
  name_en: string;
  name_pt: string;
  slug: string;
  color?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
}

export function CategoriesTab() {
  const { t } = useTranslation();
  const { data: categories, isLoading } = useNewsCategories();
  const createCategory = useCreateNewsCategory();
  const updateCategory = useUpdateNewsCategory();
  const deleteCategory = useDeleteNewsCategory();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue, watch } = useForm<CategoryFormData>();

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (editingId) {
        await updateCategory.mutateAsync({ id: editingId, ...data });
      } else {
        await createCategory.mutateAsync(data);
      }
      reset();
      setEditingId(null);
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category: NewsCategory) => {
    setEditingId(category.id);
    setValue('name_fr', category.name_fr);
    setValue('name_en', category.name_en);
    setValue('name_pt', category.name_pt);
    setValue('slug', category.slug);
    setValue('color', category.color || '');
    setValue('icon', category.icon || '');
    setValue('sort_order', category.sort_order);
    setValue('is_active', category.is_active);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('admin.confirmDelete', 'Êtes-vous sûr de vouloir supprimer ?'))) {
      try {
        await deleteCategory.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('admin.categoriesManagement', 'Gestion des catégories')}</CardTitle>
            <CardDescription>{t('admin.categoriesManagementDesc', 'Créer et gérer les catégories pour les actualités')}</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { 
                reset({ 
                  name_fr: '', 
                  name_en: '', 
                  name_pt: '', 
                  slug: '', 
                  color: '', 
                  icon: '', 
                  sort_order: 0, 
                  is_active: true 
                });
                setEditingId(null); 
              }}>
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
                {/* Names in different languages */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="name_fr">{t('common.french', 'Français')}</Label>
                    <Input id="name_fr" {...register('name_fr', { required: true })} />
                  </div>
                  <div>
                    <Label htmlFor="name_en">{t('common.english', 'Anglais')}</Label>
                    <Input id="name_en" {...register('name_en', { required: true })} />
                  </div>
                  <div>
                    <Label htmlFor="name_pt">{t('common.portuguese', 'Portugais')}</Label>
                    <Input id="name_pt" {...register('name_pt', { required: true })} />
                  </div>
                </div>

                {/* Slug and visual settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="slug">{t('news.slug', 'Slug')}</Label>
                    <Input id="slug" {...register('slug', { required: true })} placeholder="category-slug" />
                  </div>
                  <div>
                    <Label htmlFor="color">{t('news.color', 'Couleur')}</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="color" 
                        type="color" 
                        {...register('color')}
                        className="h-10 w-16 p-1 border"
                      />
                      <span className="text-sm text-gray-500">{watch('color') || t('common.none', 'Aucune')}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="icon">{t('news.icon', 'Icône')}</Label>
                    <Input id="icon" {...register('icon')} placeholder="lucide-icon-name" />
                  </div>
                  <div>
                    <Label htmlFor="sort_order">{t('news.sortOrder', 'Ordre de tri')}</Label>
                    <Input 
                      id="sort_order" 
                      type="number" 
                      {...register('sort_order', { valueAsNumber: true })}
                      min="0"
                    />
                  </div>
                </div>

                {/* Active status */}
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="is_active" 
                    {...register('is_active')} 
                    className="h-4 w-4"
                  />
                  <Label htmlFor="is_active">{t('news.isActive', 'Active')}</Label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    {t('common.cancel', 'Annuler')}
                  </Button>
                  <Button type="submit" disabled={createCategory.isPending || updateCategory.isPending}>
                    {editingId ? t('common.update', 'Mettre à jour') : t('common.save', 'Enregistrer')}
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
              <TableHead>{t('news.name', 'Nom')}</TableHead>
              <TableHead>{t('news.slug', 'Slug')}</TableHead>
              <TableHead>{t('news.status', 'Statut')}</TableHead>
              <TableHead>{t('news.sortOrder', 'Ordre')}</TableHead>
              <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5}>{t('common.loading', 'Chargement...')}</TableCell></TableRow>
            ) : categories?.length === 0 ? (
              <TableRow><TableCell colSpan={5}>{t('admin.noCategories', 'Aucune catégorie')}</TableCell></TableRow>
            ) : (
              categories?.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <CategoryBadge category={category} />
                    </div>
                  </TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>
                    <Badge variant={category.is_active ? 'default' : 'secondary'}>
                      {category.is_active ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
                    </Badge>
                  </TableCell>
                  <TableCell>{category.sort_order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(category)} className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(category.id)} className="h-8 w-8">
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