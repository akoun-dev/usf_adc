import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCountries } from '../hooks/useCountries';
import { useCreateProject } from '../hooks/useCreateProject';
import { useUpdateProject } from '../hooks/useUpdateProject';
import { useDeleteProject } from '../hooks/useDeleteProject';
import { PROJECT_STATUS_LABELS, REGIONS, type Project, type ProjectStatus } from '../types';
import type { ProjectInput } from '../services/projects-service';
import { Trash2 } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
}

export function ProjectFormDialog({ open, onOpenChange, project }: Props) {
  const { data: countries = [] } = useCountries();
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();
  const isEdit = !!project;

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ProjectInput>({
    defaultValues: project
      ? {
          title: project.title,
          description: project.description,
          country_id: project.country_id,
          region: project.region,
          status: project.status,
          budget: project.budget,
          latitude: project.latitude,
          longitude: project.longitude,
        }
      : { status: 'planned' as ProjectStatus, title: '', country_id: '' },
  });

  const onSubmit = async (data: ProjectInput) => {
    if (isEdit) {
      await updateMutation.mutateAsync({ id: project.id, input: data });
    } else {
      await createMutation.mutateAsync(data);
    }
    reset();
    onOpenChange(false);
  };

  const handleDelete = async () => {
    if (!project) return;
    await deleteMutation.mutateAsync(project.id);
    onOpenChange(false);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Modifier le projet' : 'Nouveau projet'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre *</Label>
            <Input id="title" {...register('title', { required: true })} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Pays *</Label>
              <Select value={watch('country_id') || ''} onValueChange={(v) => setValue('country_id', v)}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name_fr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Région</Label>
              <Select value={watch('region') ?? ''} onValueChange={(v) => setValue('region', v || null)}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucune</SelectItem>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Statut</Label>
              <Select value={watch('status')} onValueChange={(v) => setValue('status', v as ProjectStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(PROJECT_STATUS_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="budget">Budget (USD)</Label>
              <Input id="budget" type="number" {...register('budget', { valueAsNumber: true })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input id="latitude" type="number" step="any" {...register('latitude', { valueAsNumber: true })} />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input id="longitude" type="number" step="any" {...register('longitude', { valueAsNumber: true })} />
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            {isEdit && (
              <Button type="button" variant="destructive" size="sm" onClick={handleDelete} disabled={deleteMutation.isPending}>
                <Trash2 className="h-4 w-4 mr-1" /> Supprimer
              </Button>
            )}
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Enregistrement…' : isEdit ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
