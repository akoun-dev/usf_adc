import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNews, useCreateNews, useUpdateNews, useDeleteNews } from '../hooks/useContentManagement';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

interface NewsFormData {
  title: string;
  content: string;
  category: string;
  image_url: string;
}

export function NewsTab() {
  const { t } = useTranslation();
  const { data: news, isLoading } = useNews();
  const createNews = useCreateNews();
  const updateNews = useUpdateNews();
  const deleteNews = useDeleteNews();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<NewsFormData>();
  const navigate = useNavigate();

  const onSubmit = async (data: NewsFormData) => {
    if (editingId) {
      await updateNews.mutateAsync({ id: editingId, ...data });
    } else {
      await createNews.mutateAsync(data);
    }
    reset();
    setEditingId(null);
    setIsOpen(false);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setValue('title', item.title);
    setValue('content', item.content);
    setValue('category', item.category || '');
    setValue('image_url', item.image_url || '');
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('admin.confirmDelete', 'Êtes-vous sûr de vouloir supprimer ?'))) {
      await deleteNews.mutateAsync(id);
    }
  };

  const handleTogglePublish = async (item: any) => {
    await updateNews.mutateAsync({ id: item.id, is_public: !item.is_public });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('admin.newsManagement', 'Gestion des actualités')}</CardTitle>
            <CardDescription>{t('admin.newsManagementDesc', 'Créer et gérer les actualités de la plateforme')}</CardDescription>
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
                  {editingId ? t('admin.editNews', 'Modifier une actualité') : t('admin.createNews', 'Créer une actualité')}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="title">{t('news.title', 'Titre')}</Label>
                  <Input id="title" {...register('title', { required: true })} />
                </div>
                <div>
                  <Label htmlFor="category">{t('news.category', 'Catégorie')}</Label>
                  <Input id="category" {...register('category')} placeholder="Actualité, Annonce, etc." />
                </div>
                <div>
                  <Label htmlFor="image_url">{t('news.imageUrl', 'URL de l\'image')}</Label>
                  <Input id="image_url" {...register('image_url')} placeholder="https://..." />
                </div>
                <div>
                  <Label htmlFor="content">{t('news.content', 'Contenu')}</Label>
                  <Textarea id="content" {...register('content', { required: true })} rows={10} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    {t('common.cancel', 'Annuler')}
                  </Button>
                  <Button type="submit" disabled={createNews.isPending || updateNews.isPending}>
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
              <TableHead>{t('news.title', 'Titre')}</TableHead>
              <TableHead>{t('news.category', 'Catégorie')}</TableHead>
              <TableHead>{t('news.publishedAt', 'Publié le')}</TableHead>
              <TableHead>{t('common.status', 'Statut')}</TableHead>
              <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5}>{t('common.loading', 'Chargement...')}</TableCell></TableRow>
            ) : news?.length === 0 ? (
              <TableRow><TableCell colSpan={5}>{t('admin.noNews', 'Aucune actualité')}</TableCell></TableRow>
            ) : (
              news?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell><Badge variant="secondary">{item.category || '-'}</Badge></TableCell>
                  <TableCell>{item.published_at ? new Date(item.published_at).toLocaleDateString('fr-FR') : '-'}</TableCell>
                  <TableCell>
                    <Badge variant={item.is_public ? 'default' : 'outline'}>
                      {item.is_public ? t('common.published', 'Publié') : t('common.draft', 'Brouillon')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => handleTogglePublish(item)}>
                        {item.is_public ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
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
