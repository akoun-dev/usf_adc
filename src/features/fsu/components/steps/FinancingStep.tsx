import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import type { FsuFormValues } from '../../schemas/fsuFormSchema';

export function FinancingStep() {
  const { register, formState: { errors } } = useFormContext<FsuFormValues>();
  const e = errors.financing;
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">{t('fsu.financing.title')}</h3>
        <p className="text-sm text-muted-foreground">{t('fsu.financing.desc')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t('fsu.financing.annualBudget')} *</Label>
          <Input type="number" step="0.01" placeholder="0" {...register('financing.annual_fsu_budget')} />
          {e?.annual_fsu_budget && <p className="text-xs text-destructive">{e.annual_fsu_budget.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>{t('fsu.financing.contributions')} *</Label>
          <Input type="number" step="0.01" placeholder="0" {...register('financing.contributions_collected')} />
          {e?.contributions_collected && <p className="text-xs text-destructive">{e.contributions_collected.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>{t('fsu.financing.expenses')} *</Label>
          <Input type="number" step="0.01" placeholder="0" {...register('financing.expenses_incurred')} />
          {e?.expenses_incurred && <p className="text-xs text-destructive">{e.expenses_incurred.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>{t('fsu.financing.balance')}</Label>
          <Input type="number" step="0.01" placeholder="0" {...register('financing.balance')} />
          {e?.balance && <p className="text-xs text-destructive">{e.balance.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>{t('fsu.financing.fundedProjects')} *</Label>
          <Input type="number" placeholder="0" {...register('financing.num_funded_projects')} />
          {e?.num_funded_projects && <p className="text-xs text-destructive">{e.num_funded_projects.message}</p>}
        </div>
      </div>
    </div>
  );
}