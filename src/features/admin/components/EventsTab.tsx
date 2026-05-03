import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '../hooks/useContentManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getLangValue } from '@/types/i18n';

export function EventsTab() {
  const { t, i18n } = useTranslation();
  const { data: events, isLoading } = useEvents();
  const deleteEvent = useDeleteEvent();
  const navigate = useNavigate();

  const handleEdit = (item: any) => {
    navigate(`/admin/events/${item.id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('admin.confirmDelete', 'Êtes-vous sûr de vouloir supprimer ?'))) {
      await deleteEvent.mutateAsync(id);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return t('common.notAvailable', '-');
    return new Date(date).toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusKeys: Record<string, string> = {
      draft: 'admin.event.draft',
      in_review: 'admin.event.inReview',
      published: 'admin.event.published',
      archived: 'admin.event.archived',
      cancelled: 'admin.event.cancelled',
    };
    const variants: Record<string, 'secondary' | 'outline' | 'default' | 'destructive'> = {
      draft: 'secondary',
      in_review: 'outline',
      published: 'default',
      archived: 'destructive',
      cancelled: 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'}>{t(statusKeys[status] || status)}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('admin.eventsManagement')}</CardTitle>
            <CardDescription>{t('admin.eventsManagementDesc')}</CardDescription>
          </div>
          <Button onClick={() => navigate('/admin/events/new')}>
            <Plus className="mr-2 h-4 w-4" />
            {t('common.add', 'Ajouter')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.event.title')}</TableHead>
              <TableHead>{t('admin.event.location')}</TableHead>
              <TableHead>{t('admin.event.startDate')}</TableHead>
              <TableHead>{t('admin.event.endDate')}</TableHead>
              <TableHead>{t('admin.event.status')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6}>{t('common.loading')}</TableCell></TableRow>
            ) : events?.length === 0 ? (
              <TableRow><TableCell colSpan={6}>{t('admin.noEvents')}</TableCell></TableRow>
            ) : (
              events?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {getLangValue(item.title, i18n.language)}
                    </div>
                  </TableCell>
                  <TableCell>{getLangValue(item.location, i18n.language) || t('common.notAvailable', '-')}</TableCell>
                  <TableCell>{formatDate(item.start_date)}</TableCell>
                  <TableCell>{formatDate(item.end_date)}</TableCell>
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
