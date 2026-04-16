import { FileText, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  total: number;
  pending: number;
  approved: number;
  approvalRate: number;
}

const kpis: { key: keyof Props; label: string; icon: React.ElementType; color: string; suffix?: string }[] = [
  { key: 'total', label: 'Total soumissions', icon: FileText, color: 'text-primary' },
  { key: 'pending', label: 'En attente', icon: Clock, color: 'text-yellow-500' },
  { key: 'approved', label: 'Approuvées', icon: CheckCircle, color: 'text-green-500' },
  { key: 'approvalRate', label: "Taux d'approbation", icon: TrendingUp, color: 'text-blue-500', suffix: '%' },
];

export default function KpiCards({ total, pending, approved, approvalRate }: Props) {
  const values = { total, pending, approved, approvalRate };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map(({ key, label, icon: Icon, color, suffix }) => (
        <Card key={key}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted ${color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold text-foreground">
                {values[key]}{suffix ?? ''}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
