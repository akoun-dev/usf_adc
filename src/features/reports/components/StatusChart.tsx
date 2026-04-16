import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SubmissionStatusCount } from '../types';

const STATUS_COLORS: Record<string, string> = {
  Brouillon: '#94a3b8',
  Soumis: '#f59e0b',
  'En révision': '#3b82f6',
  Approuvé: '#22c55e',
  Rejeté: '#ef4444',
  'Révision demandée': '#a855f7',
};

interface Props {
  data: SubmissionStatusCount[];
}

export default function StatusChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Répartition par statut</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Aucune donnée</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="status" width={130} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }}
              />
              <Bar dataKey="count" name="Soumissions" radius={[0, 4, 4, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? '#64748b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
