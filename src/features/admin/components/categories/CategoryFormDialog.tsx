import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NewsCategory } from '../../types';

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: NewsCategory | null;
  onSubmit: (data: Omit<NewsCategory, 'id' | 'created_at' | 'updated_at'>) => void;
  isLoading?: boolean;
}

export function CategoryFormDialog({ 
  open, 
  onOpenChange, 
  category, 
  onSubmit, 
  isLoading = false 
}: CategoryFormDialogProps) {
  const { t } = useTranslation();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<NewsCategory, 'id' | 'created_at' | 'updated_at'>>({
    defaultValues: category || {
      name_fr: '',
      name_en: '',
      name_pt: '',
      slug: '',
      color: '',
      icon: '',
      sort_order: 0,
      is_active: true
    }
  });

  const handleFormSubmit = (data: Omit<NewsCategory, 'id' | 'created_at' | 'updated_at'>) => {
    onSubmit(data);
    if (!category) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {category ? t('admin.editCategory', 'Modifier une catégorie') : t('admin.createCategory', 'Créer une catégorie')}
          </DialogTitle>
          <DialogDescription>
            {category ? t('admin.editCategoryDesc', 'Modifiez les détails de la catégorie') : t('admin.createCategoryDesc', 'Créez une nouvelle catégorie pour organiser les actualités')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name_fr">{t('common.french', 'Français')}</Label>
              <Input 
                id="name_fr" 
                {...register('name_fr', { required: t('common.required', 'Ce champ est requis') })}
                className={errors.name_fr ? 'border-red-500' : ''}
              />
              {errors.name_fr && <p className="text-xs text-red-500 mt-1">{errors.name_fr.message}</p>}
            </div>
            <div>
              <Label htmlFor="name_en">{t('common.english', 'Anglais')}</Label>
              <Input 
                id="name_en" 
                {...register('name_en', { required: t('common.required', 'Ce champ est requis') })}
                className={errors.name_en ? 'border-red-500' : ''}
              />
              {errors.name_en && <p className="text-xs text-red-500 mt-1">{errors.name_en.message}</p>}
            </div>
            <div>
              <Label htmlFor="name_pt">{t('common.portuguese', 'Portugais')}</Label>
              <Input 
                id="name_pt" 
                {...register('name_pt', { required: t('common.required', 'Ce champ est requis') })}
                className={errors.name_pt ? 'border-red-500' : ''}
              />
              {errors.name_pt && <p className="text-xs text-red-500 mt-1">{errors.name_pt.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="slug">{t('news.slug', 'Slug')}</Label>
              <Input 
                id="slug" 
                {...register('slug', { 
                  required: t('common.required', 'Ce champ est requis'),
                  pattern: {
                    value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                    message: t('news.slugValidation', 'Le slug doit être en minuscules avec des tirets')
                  }
                })}
                placeholder="category-slug"
                className={errors.slug ? 'border-red-500' : ''}
              />
              {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
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
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="icon">{t('news.icon', 'Icône')}</Label>
              <Input 
                id="icon" 
                {...register('icon')}
                placeholder="lucide-icon-name"
              />
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel', 'Annuler')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {category ? t('common.update', 'Mettre à jour') : t('common.save', 'Enregistrer')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}