import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import type { FsuFormValues } from '../../schemas/fsuFormSchema';

export function ConnectivityStep() {
  const { register, formState: { errors } } = useFormContext<FsuFormValues>();
  const e = errors.connectivity;
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">{t('fsu.connectivity.title')}</h3>
        <p className="text-sm text-muted-foreground">{t('fsu.connectivity.desc')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t('fsu.connectivity.periodStart')} *</Label>
          <Input type="date" {...register('period_start')} />
          {errors.period_start && <p className="text-xs text-destructive">{errors.period_start.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>{t('fsu.connectivity.periodEnd')} *</Label>
          <Input type="date" {...register('period_end')} />
          {errors.period_end && <p className="text-xs text-destructive">{errors.period_end.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t('fsu.connectivity.populationCovered')} *</Label>
          <Input type="number" placeholder="0" {...register('connectivity.population_covered')} />
          {e?.population_covered && <p className="text-xs text-destructive">{e.population_covered.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>{t('fsu.connectivity.mobilePenetration')} *</Label>
          <Input type="number" step="0.01" placeholder="0" {...register('connectivity.mobile_penetration_rate')} />
          {e?.mobile_penetration_rate && <p className="text-xs text-destructive">{e.mobile_penetration_rate.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>{t('fsu.connectivity.internetPenetration')} *</Label>
          <Input type="number" step="0.01" placeholder="0" {...register('connectivity.internet_penetration_rate')} />
          {e?.internet_penetration_rate && <p className="text-xs text-destructive">{e.internet_penetration_rate.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>{t('fsu.connectivity.numOperators')} *</Label>
          <Input type="number" placeholder="0" {...register('connectivity.num_operators')} />
          {e?.num_operators && <p className="text-xs text-destructive">{e.num_operators.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>{t('fsu.connectivity.mobileSubscribers')} *</Label>
          <Input type="number" placeholder="0" {...register('connectivity.mobile_subscribers')} />
          {e?.mobile_subscribers && <p className="text-xs text-destructive">{e.mobile_subscribers.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>{t('fsu.connectivity.internetSubscribers')} *</Label>
          <Input type="number" placeholder="0" {...register('connectivity.internet_subscribers')} />
          {e?.internet_subscribers && <p className="text-xs text-destructive">{e.internet_subscribers.message}</p>}
        </div>
      </div>
    </div>
  );
}