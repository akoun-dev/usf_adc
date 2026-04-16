import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import type { FsuFormValues } from '../schemas/fsuFormSchema';

interface Props {
  data: FsuFormValues;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm sm:grid-cols-2">{children}</CardContent>
    </Card>
  );
}

function Field({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <div>
      <span className="text-muted-foreground">{label} :</span>{' '}
      <span className="font-medium text-foreground">{value}{unit ? ` ${unit}` : ''}</span>
    </div>
  );
}

export function SubmissionPreview({ data }: Props) {
  const { t } = useTranslation();
  const c = data.connectivity;
  const f = data.financing;
  const q = data.quality;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">{t('fsu.preview.title')}</h3>
        <p className="text-sm text-muted-foreground">{t('fsu.preview.desc')}</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 text-sm rounded-lg border p-4 bg-muted/30">
        <Field label={t('fsu.preview.period')} value={`${data.period_start} → ${data.period_end}`} />
      </div>

      <Section title={t('fsu.steps.connectivity')}>
        <Field label={t('fsu.preview.populationCovered')} value={c.population_covered?.toLocaleString() ?? '—'} />
        <Field label={t('fsu.preview.mobilePenetration')} value={c.mobile_penetration_rate ?? '—'} unit="%" />
        <Field label={t('fsu.preview.internetPenetration')} value={c.internet_penetration_rate ?? '—'} unit="%" />
        <Field label={t('fsu.preview.operators')} value={c.num_operators ?? '—'} />
        <Field label={t('fsu.preview.mobileSubscribers')} value={c.mobile_subscribers?.toLocaleString() ?? '—'} />
        <Field label={t('fsu.preview.internetSubscribers')} value={c.internet_subscribers?.toLocaleString() ?? '—'} />
      </Section>

      <Section title={t('fsu.steps.financing')}>
        <Field label={t('fsu.preview.annualBudget')} value={f.annual_fsu_budget?.toLocaleString() ?? '—'} unit="USD" />
        <Field label={t('fsu.preview.contributions')} value={f.contributions_collected?.toLocaleString() ?? '—'} unit="USD" />
        <Field label={t('fsu.preview.expenses')} value={f.expenses_incurred?.toLocaleString() ?? '—'} unit="USD" />
        <Field label={t('fsu.preview.balance')} value={f.balance?.toLocaleString() ?? '—'} unit="USD" />
        <Field label={t('fsu.preview.fundedProjects')} value={f.num_funded_projects ?? '—'} />
      </Section>

      <Section title={t('fsu.steps.quality')}>
        <Field label={t('fsu.preview.latency')} value={q.average_latency_ms ?? '—'} unit="ms" />
        <Field label={t('fsu.preview.availability')} value={q.network_availability_percent ?? '—'} unit="%" />
        <Field label={t('fsu.preview.geoCoverage')} value={q.geographic_coverage_percent ?? '—'} unit="%" />
        <Field label={t('fsu.preview.popCoverage')} value={q.population_coverage_percent ?? '—'} unit="%" />
        <Field label={t('fsu.preview.downloadSpeed')} value={q.avg_download_speed_mbps ?? '—'} unit="Mbps" />
      </Section>
    </div>
  );
}