import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { CountryStats } from '../types';

interface Props {
  data: CountryStats[];
}

export default function CountryTable({ data }: Props) {
  const sorted = [...data].sort((a, b) => b.total - a.total);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Récapitulatif par pays</CardTitle>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Aucune donnée</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pays</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">En attente</TableHead>
                  <TableHead className="text-center">Approuvées</TableHead>
                  <TableHead className="text-center">Rejetées</TableHead>
                  <TableHead className="text-center">Taux</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((row) => (
                  <TableRow key={row.country_id}>
                    <TableCell className="font-medium">{row.country_name}</TableCell>
                    <TableCell className="text-center">{row.total}</TableCell>
                    <TableCell className="text-center">{row.pending}</TableCell>
                    <TableCell className="text-center">{row.approved}</TableCell>
                    <TableCell className="text-center">{row.rejected}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={row.approval_rate >= 80 ? 'default' : row.approval_rate >= 50 ? 'secondary' : 'destructive'}>
                        {row.approval_rate}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
