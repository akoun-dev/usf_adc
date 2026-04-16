import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateTicket } from '../hooks/useCreateTicket';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface FormValues {
  title: string;
  description: string;
  priority: string;
}

export function NewTicketForm() {
  const form = useForm<FormValues>({ defaultValues: { title: '', description: '', priority: 'medium' } });
  const createTicket = useCreateTicket();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const onSubmit = (values: FormValues) => {
    createTicket.mutate(values, {
      onSuccess: () => {
        toast({ title: t('support.form.created'), description: t('support.form.createdDesc') });
        navigate('/support');
      },
      onError: () => toast({ title: t('common.error'), description: t('support.form.createError'), variant: 'destructive' }),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl space-y-4">
        <FormField control={form.control} name="title" rules={{ required: t('support.form.titleRequired') }} render={({ field }) => (
          <FormItem>
            <FormLabel>{t('support.form.title')}</FormLabel>
            <FormControl><Input placeholder={t('support.form.titlePlaceholder')} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="description" rules={{ required: t('support.form.descriptionRequired') }} render={({ field }) => (
          <FormItem>
            <FormLabel>{t('support.form.description')}</FormLabel>
            <FormControl><Textarea rows={5} placeholder={t('support.form.descriptionPlaceholder')} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="priority" render={({ field }) => (
          <FormItem>
            <FormLabel>{t('support.form.priority')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="low">{t('support.priority.low')}</SelectItem>
                <SelectItem value="medium">{t('support.priority.medium')}</SelectItem>
                <SelectItem value="high">{t('support.priority.high')}</SelectItem>
                <SelectItem value="urgent">{t('support.priority.urgent')}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" disabled={createTicket.isPending}>
          {createTicket.isPending ? t('support.form.creating') : t('support.form.submit')}
        </Button>
      </form>
    </Form>
  );
}