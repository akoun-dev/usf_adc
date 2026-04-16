import type { ReportsData } from '../types';

export function exportReportsCSV(data: ReportsData) {
  const lines: string[] = [];

  // KPIs
  lines.push('--- Indicateurs clés ---');
  lines.push('Métrique,Valeur');
  lines.push(`Total soumissions,${data.total}`);
  lines.push(`En attente,${data.pending}`);
  lines.push(`Approuvées,${data.approved}`);
  lines.push(`Rejetées,${data.rejected}`);
  lines.push(`Taux d'approbation,${data.approvalRate}%`);
  lines.push('');

  // By status
  lines.push('--- Répartition par statut ---');
  lines.push('Statut,Nombre');
  data.byStatus.forEach((s) => lines.push(`${s.status},${s.count}`));
  lines.push('');

  // By country
  lines.push('--- Récapitulatif par pays ---');
  lines.push('Pays,Total,En attente,Approuvées,Rejetées,Taux approbation');
  data.byCountry.forEach((c) =>
    lines.push(`${c.country_name},${c.total},${c.pending},${c.approved},${c.rejected},${c.approval_rate}%`)
  );

  const csv = lines.join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rapport-fsu-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
