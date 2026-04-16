import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CountryKpi {
  country: string;
  completionRate: number;
  approvalRate: number;
  avgDelay: number;
  regionalAvg: { completionRate: number; approvalRate: number; avgDelay: number };
}

const SAMPLE_DATA: CountryKpi[] = [
  { country: 'Côte d\'Ivoire', completionRate: 85, approvalRate: 92, avgDelay: 5, regionalAvg: { completionRate: 72, approvalRate: 78, avgDelay: 8 } },
  { country: 'Sénégal', completionRate: 78, approvalRate: 85, avgDelay: 7, regionalAvg: { completionRate: 72, approvalRate: 78, avgDelay: 8 } },
  { country: 'Ghana', completionRate: 65, approvalRate: 70, avgDelay: 12, regionalAvg: { completionRate: 72, approvalRate: 78, avgDelay: 8 } },
  { country: 'Kenya', completionRate: 90, approvalRate: 88, avgDelay: 4, regionalAvg: { completionRate: 75, approvalRate: 80, avgDelay: 7 } },
];

function Trend({ value, avg, invert = false }: { value: number; avg: number; invert?: boolean }) {
  const diff = invert ? avg - value : value - avg;
  if (Math.abs(diff) < 2) return <Minus className="h-4 w-4 text-muted-foreground" />;
  return diff > 0
    ? <TrendingUp className="h-4 w-4 text-green-600" />
    : <TrendingDown className="h-4 w-4 text-red-600" />;
}

export default function KpiComparison() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparaison KPIs vs moyennes régionales</CardTitle>
        <CardDescription>Performance par pays comparée aux moyennes de la région</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 font-medium">Pays</th>
                <th className="pb-2 font-medium">Taux complétion</th>
                <th className="pb-2 font-medium">Taux approbation</th>
                <th className="pb-2 font-medium">Délai moyen (j)</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_DATA.map(row => (
                <tr key={row.country} className="border-b last:border-0">
                  <td className="py-3 font-medium">{row.country}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span>{row.completionRate}%</span>
                      <Trend value={row.completionRate} avg={row.regionalAvg.completionRate} />
                      <span className="text-xs text-muted-foreground">(rég. {row.regionalAvg.completionRate}%)</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span>{row.approvalRate}%</span>
                      <Trend value={row.approvalRate} avg={row.regionalAvg.approvalRate} />
                      <span className="text-xs text-muted-foreground">(rég. {row.regionalAvg.approvalRate}%)</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span>{row.avgDelay}j</span>
                      <Trend value={row.avgDelay} avg={row.regionalAvg.avgDelay} invert />
                      <span className="text-xs text-muted-foreground">(rég. {row.regionalAvg.avgDelay}j)</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
