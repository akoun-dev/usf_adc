import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTranslation } from 'react-i18next';
import type { ConnectivityData, FinancingData, QualityData } from '../types';

interface Props {
  current: { connectivity: ConnectivityData; financing: FinancingData; quality: QualityData };
  previous?: { connectivity: ConnectivityData; financing: FinancingData; quality: QualityData } | null;
}

interface Warning {
  field: string;
  message: string;
}

const THRESHOLD = 0.5; // 50% deviation triggers warning

function checkDeviation(label: string, current: number, previous: number): Warning | null {
  if (previous === 0) return null;
  const ratio = Math.abs(current - previous) / previous;
  if (ratio > THRESHOLD) {
    const direction = current > previous ? '↑' : '↓';
    const pct = Math.round(ratio * 100);
    return { field: label, message: `${direction} ${pct}% par rapport à la période précédente` };
  }
  return null;
}

export function InconsistencyWarning({ current, previous }: Props) {
  const { t } = useTranslation();

  if (!previous) return null;

  const warnings: Warning[] = [
    checkDeviation('Population couverte', current.connectivity.population_covered, previous.connectivity.population_covered),
    checkDeviation('Pénétration mobile', current.connectivity.mobile_penetration_rate, previous.connectivity.mobile_penetration_rate),
    checkDeviation('Abonnés mobiles', current.connectivity.mobile_subscribers, previous.connectivity.mobile_subscribers),
    checkDeviation('Budget FSU', current.financing.annual_fsu_budget, previous.financing.annual_fsu_budget),
    checkDeviation('Contributions', current.financing.contributions_collected, previous.financing.contributions_collected),
    checkDeviation('Dépenses', current.financing.expenses_incurred, previous.financing.expenses_incurred),
    checkDeviation('Latence', current.quality.average_latency_ms, previous.quality.average_latency_ms),
    checkDeviation('Débit descendant', current.quality.avg_download_speed_mbps, previous.quality.avg_download_speed_mbps),
  ].filter((w): w is Warning => w !== null);

  if (warnings.length === 0) return null;

  return (
    <Alert variant="destructive" className="border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{t('fsu.inconsistencyTitle', 'Variations significatives détectées')}</AlertTitle>
      <AlertDescription>
        <ul className="mt-2 space-y-1 text-sm">
          {warnings.map((w) => (
            <li key={w.field}>
              <strong>{w.field}</strong> : {w.message}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
