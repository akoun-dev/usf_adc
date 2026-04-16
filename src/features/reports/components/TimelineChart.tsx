import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { MonthlySubmission } from '../types';

interface Props {
  data: MonthlySubmission[];
}

export default function TimelineChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Évolution mensuelle</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Aucune donnée</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                tickFormatter={(v: string) => {
                  const [y, m] = v.split('-');
                  return `${m}/${y.slice(2)}`;
                }}
              />
              <YAxis allowDecimals={false} />
              <Tooltip
                labelFormatter={(v: string) => {
                  const [y, m] = v.split('-');
                  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
                  return `${months[parseInt(m) - 1]} ${y}`;
                }}
                contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }}
              />
              <Line
                type="monotone"
                dataKey="count"
                name="Soumissions"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4, fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
