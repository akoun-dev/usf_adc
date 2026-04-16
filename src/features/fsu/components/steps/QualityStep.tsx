import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import type { FsuFormValues } from '../../schemas/fsuFormSchema';

export function QualityStep() {
  const { register, formState: { errors } } = useFormContext<FsuFormValues>();
  const e = errors.quality;
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">{t('fsu.quality.title')}</h3>
        <p className="text-sm text-muted-foreground">{t('fsu.quality.desc')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t('fsu.quality.latency')} *</Label>
          <Input type="number" step="0.1" placeholder="0" {...register('quality.average_latency_ms')} />
          {e?.average_latency_ms && <p className="text-xs text-destructive">{e.average_latency_ms.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>{t('fsu.quality.availability')} *</Label>
          <Input type="number" step="0.01" placeholder="0" {...register('quality.network_availability_percent')} />
          {e?.network_availability_percent && <p className="text-xs text-destructive">{e.network_availability_percent.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>{t('fsu.quality.geoCoverage')} *</Label>
          <Input type="number" step="0.01" placeholder="0" {...register('quality.geographic_coverage_percent')} />
          {e?.geographic_coverage_percent && <p className="text-xs text-destructive">{e.geographic_coverage_percent.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>{t('fsu.quality.popCoverage')} *</Label>
          <Input type="number" step="0.01" placeholder="0" {...register('quality.population_coverage_percent')} />
          {e?.population_coverage_percent && <p className="text-xs text-destructive">{e.population_coverage_percent.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>{t('fsu.quality.downloadSpeed')} *</Label>
          <Input type="number" step="0.01" placeholder="0" {...register('quality.avg_download_speed_mbps')} />
          {e?.avg_download_speed_mbps && <p className="text-xs text-destructive">{e.avg_download_speed_mbps.message}</p>}
        </div>
      </div>
    </div>
  );
}