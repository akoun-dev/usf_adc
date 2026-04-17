import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '../hooks/useContentManagement';
import { useCountries } from '../hooks/useCountries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface ProjectFormData {
  title: string;
  description: string;
  country_id: string;
  status: string;
  region: string;
}

const REGIONS = ['CEDEAO', 'SADC', 'EAC', 'CEEAC', 'UMA', 'COMESA', 'CEMAC', 'IGAD'];
const PROJECT_STATUSES = ['planned', 'in_progress', 'completed', 'suspended'];

export function ProjectsTab() {
  const { t } = useTranslation();
  const { data: projects, isLoading } = useProjects();
  const { data: countries } = useCountries();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<ProjectFormData>();

  const onSubmit = async (data: ProjectFormData) => {
    if (editingId) {
      await updateProject.mutateAsync({ id: editingId, ...data });
    } else {
      await createProject.mutateAsync(data);
    }
    reset();
    setEditingId(null);
    setIsOpen(false);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setValue('title', item.title);
    setValue('description', item.description || '');
    setValue('country_id', item.country_id || '');
    setValue('status', item.status || 'planned');
    setValue('region', item.region || '');
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('admin.confirmDelete', 'Êtes-vous sûr de vouloir supprimer ?'))) {
      await deleteProject.mutateAsync(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      planned: 'secondary',
      in_progress: 'default',
      completed: 'success',
      suspended: 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'}>{status || '-'}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('admin.projectsManagement', 'Gestion des projets')}</CardTitle>
            <CardDescription>{t('admin.projectsManagementDesc', 'Gérer les projets FSU')}</CardDescription>
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
                  {editingId ? t('admin.editProject', 'Modifier un projet') : t('admin.createProject', 'Créer un projet')}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="title">{t('project.title', 'Titre du projet')}</Label>
                  <Input id="title" {...register('title', { required: true })} />
                </div>
                <div>
                  <Label htmlFor="description">{t('project.description', 'Description')}</Label>
                  <Textarea id="description" {...register('description')} rows={4} />
                </div>
                <div>
                  <Label htmlFor="country_id">{t('project.country', 'Pays')}</Label>
                  <Select onValueChange={(v) => setValue('country_id', v)}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner un pays" /></SelectTrigger>
                    <SelectContent>
                      {countries?.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name_fr}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="region">{t('project.region', 'Région')}</Label>
                    <Select onValueChange={(v) => setValue('region', v)}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                      <SelectContent>
                        {REGIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">{t('project.status', 'Statut')}</Label>
                    <Select onValueChange={(v) => setValue('status', v)}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                      <SelectContent>
                        {PROJECT_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    {t('common.cancel', 'Annuler')}
                  </Button>
                  <Button type="submit" disabled={createProject.isPending || updateProject.isPending}>
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
              <TableHead>{t('project.title', 'Titre')}</TableHead>
              <TableHead>{t('project.country', 'Pays')}</TableHead>
              <TableHead>{t('project.region', 'Région')}</TableHead>
              <TableHead>{t('project.status', 'Statut')}</TableHead>
              <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5}>{t('common.loading', 'Chargement...')}</TableCell></TableRow>
            ) : projects?.length === 0 ? (
              <TableRow><TableCell colSpan={5}>{t('admin.noProjects', 'Aucun projet')}</TableCell></TableRow>
            ) : (
              projects?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.countries?.name_fr || '-'}</TableCell>
                  <TableCell>{item.region || '-'}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
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
