import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useCountries, useCreateCountry, useUpdateCountry, useDeleteCountry } from '../hooks/useCountries';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import type { Country } from '../types';

const REGIONS = ['CEDEAO', 'CEEAC', 'SADC', 'EAC', 'UMA', 'IGAD', 'CEN-SAD', 'COMESA'];

export function CountriesTab() {
  const { data: countries, isLoading } = useCountries();
  const { hasRole } = useAuth();
  const isGlobalAdmin = hasRole('global_admin');
  const createCountry = useCreateCountry();
  const updateCountry = useUpdateCountry();
  const deleteCountry = useDeleteCountry();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Country | null>(null);
  const [form, setForm] = useState({ name_fr: '', name_en: '', code_iso: '', region: '' });

  const openNew = () => {
    setEditing(null);
    setForm({ name_fr: '', name_en: '', code_iso: '', region: '' });
    setOpen(true);
  };

  const openEdit = (c: Country) => {
    setEditing(c);
    setForm({ name_fr: c.name_fr, name_en: c.name_en, code_iso: c.code_iso, region: c.region });
    setOpen(true);
  };

  const handleSubmit = () => {
    const payload = { ...form, code_iso: form.code_iso.toUpperCase().slice(0, 2) };
    if (editing) {
      updateCountry.mutate(
        { id: editing.id, ...payload },
        {
          onSuccess: () => { setOpen(false); toast({ title: t('admin.countryUpdated') }); },
          onError: () => toast({ title: t('common.error'), variant: 'destructive' }),
        }
      );
    } else {
      createCountry.mutate(payload, {
        onSuccess: () => { setOpen(false); toast({ title: t('admin.countryAdded') }); },
        onError: () => toast({ title: t('common.error'), variant: 'destructive' }),
      });
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm(t('admin.deleteCountryConfirm'))) return;
    deleteCountry.mutate(id, {
      onSuccess: () => toast({ title: t('admin.countryDeleted') }),
      onError: () => toast({ title: t('admin.deleteCountryError'), variant: 'destructive' }),
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('admin.countriesTitle', { count: countries?.length ?? 0 })}</CardTitle>
        {isGlobalAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={openNew}><Plus className="mr-2 h-4 w-4" />{t('admin.addCountry')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? t('admin.editCountry') : t('admin.addCountryTitle')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <Label>{t('admin.nameFr')}</Label>
                  <Input value={form.name_fr} onChange={(e) => setForm({ ...form, name_fr: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>{t('admin.nameEn')}</Label>
                  <Input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>{t('admin.codeIso')}</Label>
                    <Input value={form.code_iso} maxLength={2} onChange={(e) => setForm({ ...form, code_iso: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>{t('admin.region')}</Label>
                    <Input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} list="regions" />
                    <datalist id="regions">
                      {REGIONS.map((r) => <option key={r} value={r} />)}
                    </datalist>
                  </div>
                </div>
                <Button className="w-full" onClick={handleSubmit} disabled={!form.name_fr || !form.code_iso || !form.region}>
                  {editing ? t('common.update') : t('common.add')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.nameFr')}</TableHead>
              <TableHead>{t('admin.nameEn')}</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>{t('admin.region')}</TableHead>
              {isGlobalAdmin && <TableHead className="w-20">{t('common.actions')}</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {countries?.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name_fr}</TableCell>
                <TableCell>{c.name_en}</TableCell>
                <TableCell><Badge variant="outline">{c.code_iso}</Badge></TableCell>
                <TableCell>{c.region}</TableCell>
                {isGlobalAdmin && (
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(c as any)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}