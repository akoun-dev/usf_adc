import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '../hooks/useContentManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface EventFormData {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
}

export function EventsTab() {
  const { t } = useTranslation();
  const { data: events, isLoading } = useEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<EventFormData>();

  const onSubmit = async (data: EventFormData) => {
    if (editingId) {
      await updateEvent.mutateAsync({ id: editingId, ...data });
    } else {
      await createEvent.mutateAsync(data);
    }
    reset();
    setEditingId(null);
    setIsOpen(false);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setValue('title', item.title);
    setValue('description', item.description || '');
    setValue('start_date', item.start_date ? item.start_date.slice(0, 16) : '');
    setValue('end_date', item.end_date ? item.end_date.slice(0, 16) : '');
    setValue('location', item.location || '');
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('admin.confirmDelete', 'Êtes-vous sûr de vouloir supprimer ?'))) {
      await deleteEvent.mutateAsync(id);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('admin.eventsManagement', 'Gestion des événements')}</CardTitle>
            <CardDescription>{t('admin.eventsManagementDesc', 'Gérer les événements et calendriers')}</CardDescription>
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
                  {editingId ? t('admin.editEvent', 'Modifier un événement') : t('admin.createEvent', 'Créer un événement')}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="title">{t('event.title', 'Titre')}</Label>
                  <Input id="title" {...register('title', { required: true })} />
                </div>
                <div>
                  <Label htmlFor="location">{t('event.location', 'Lieu')}</Label>
                  <Input id="location" {...register('location')} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">{t('event.startDate', 'Date de début')}</Label>
                    <Input id="start_date" type="datetime-local" {...register('start_date', { required: true })} />
                  </div>
                  <div>
                    <Label htmlFor="end_date">{t('event.endDate', 'Date de fin')}</Label>
                    <Input id="end_date" type="datetime-local" {...register('end_date')} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">{t('event.description', 'Description')}</Label>
                  <Textarea id="description" {...register('description')} rows={4} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    {t('common.cancel', 'Annuler')}
                  </Button>
                  <Button type="submit" disabled={createEvent.isPending || updateEvent.isPending}>
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
              <TableHead>{t('event.title', 'Titre')}</TableHead>
              <TableHead>{t('event.location', 'Lieu')}</TableHead>
              <TableHead>{t('event.startDate', 'Début')}</TableHead>
              <TableHead>{t('event.endDate', 'Fin')}</TableHead>
              <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5}>{t('common.loading', 'Chargement...')}</TableCell></TableRow>
            ) : events?.length === 0 ? (
              <TableRow><TableCell colSpan={5}>{t('admin.noEvents', 'Aucun événement')}</TableCell></TableRow>
            ) : (
              events?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {item.title}
                    </div>
                  </TableCell>
                  <TableCell>{item.location || '-'}</TableCell>
                  <TableCell>{formatDate(item.start_date)}</TableCell>
                  <TableCell>{formatDate(item.end_date)}</TableCell>
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
