import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { useSubmissionPeriods } from '../hooks/useSubmissionPeriods';
import { useCreateSubmissionPeriod, useUpdateSubmissionPeriod, useDeleteSubmissionPeriod } from '../hooks/useSubmissionPeriodMutations';
import { useSettings } from '../hooks/useSettings';
import { useUpdateSetting } from '../hooks/useUpdateSetting';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export function FsuSettingsTab() {
  const { data: periods, isLoading } = useSubmissionPeriods();
  const { data: settings } = useSettings();
  const { hasRole } = useAuth();
  const isGlobalAdmin = hasRole('global_admin');
  const createPeriod = useCreateSubmissionPeriod();
  const updatePeriod = useUpdateSubmissionPeriod();
  const deletePeriod = useDeleteSubmissionPeriod();
  const updateSetting = useUpdateSetting();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ label: '', start_date: '', end_date: '', reminder_days_before: 7 });

  const locale = i18n.language === 'pt' ? 'pt-PT' : i18n.language === 'en' ? 'en-US' : 'fr-FR';
  const fsuSettings = settings?.filter((s) => s.category === 'fsu') ?? [];

  const handleCreatePeriod = () => {
    createPeriod.mutate(
      { ...form, is_active: true, reminder_days_before: form.reminder_days_before },
      {
        onSuccess: () => { setOpen(false); toast({ title: t('admin.periodCreated') }); },
        onError: () => toast({ title: t('common.error'), variant: 'destructive' }),
      }
    );
  };

  const toggleActive = (id: string, isActive: boolean) => {
    updatePeriod.mutate(
      { id, is_active: isActive } as any,
      {
        onSuccess: () => toast({ title: isActive ? t('admin.periodActivated') : t('admin.periodDeactivated') }),
        onError: () => toast({ title: t('common.error'), variant: 'destructive' }),
      }
    );
  };

  const handleDeletePeriod = (id: string) => {
    if (!confirm(t('admin.deletePeriodConfirm'))) return;
    deletePeriod.mutate(id, {
      onSuccess: () => toast({ title: t('admin.periodDeleted') }),
      onError: () => toast({ title: t('common.error'), variant: 'destructive' }),
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isGlobalAdmin && fsuSettings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.fsuSettings')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fsuSettings.map((s) => {
              if (typeof s.value === 'boolean') {
                return (
                  <div className="flex items-center justify-between" key={s.id}>
                    <Label>{s.label}</Label>
                    <Switch
                      checked={s.value}
                      onCheckedChange={(checked) =>
                        updateSetting.mutate({ id: s.id, value: checked }, {
                          onSuccess: () => toast({ title: t('admin.settingUpdated', { label: s.label }) }),
                        })
                      }
                    />
                  </div>
                );
              }
              return (
                <div className="flex items-center gap-4" key={s.id}>
                  <Label className="min-w-48">{s.label}</Label>
                  <Input
                    type="number"
                    defaultValue={s.value as number}
                    className="w-24"
                    onBlur={(e) =>
                      updateSetting.mutate({ id: s.id, value: Number(e.target.value) }, {
                        onSuccess: () => toast({ title: t('admin.settingUpdated', { label: s.label }) }),
                      })
                    }
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('admin.submissionPeriods')}</CardTitle>
          {isGlobalAdmin && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="mr-2 h-4 w-4" />{t('admin.newPeriod')}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('admin.createPeriod')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <Label>{t('admin.periodLabel')}</Label>
                    <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder={t('admin.periodLabelPlaceholder')} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>{t('admin.startDate')}</Label>
                      <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <Label>{t('admin.endDate')}</Label>
                      <Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>{t('admin.reminderDays')}</Label>
                    <Input type="number" value={form.reminder_days_before} onChange={(e) => setForm({ ...form, reminder_days_before: Number(e.target.value) })} />
                  </div>
                  <Button className="w-full" onClick={handleCreatePeriod} disabled={!form.label || !form.start_date || !form.end_date}>
                    {t('common.create')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          {(!periods || periods.length === 0) ? (
            <p className="text-sm text-muted-foreground text-center py-4">{t('admin.noPeriods')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.label')}</TableHead>
                  <TableHead>{t('admin.start')}</TableHead>
                  <TableHead>{t('admin.end')}</TableHead>
                  <TableHead>{t('admin.reminder')}</TableHead>
                  <TableHead>{t('users.status')}</TableHead>
                  {isGlobalAdmin && <TableHead className="w-20">{t('common.actions')}</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {periods.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.label}</TableCell>
                    <TableCell>{new Date(p.start_date).toLocaleDateString(locale)}</TableCell>
                    <TableCell>{new Date(p.end_date).toLocaleDateString(locale)}</TableCell>
                    <TableCell>{p.reminder_days_before}j</TableCell>
                    <TableCell>
                      {isGlobalAdmin ? (
                        <Switch checked={p.is_active} onCheckedChange={(v) => toggleActive(p.id, v)} />
                      ) : (
                        <Badge variant={p.is_active ? 'default' : 'secondary'}>{p.is_active ? t('admin.active') : t('admin.inactive')}</Badge>
                      )}
                    </TableCell>
                    {isGlobalAdmin && (
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleDeletePeriod(p.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}