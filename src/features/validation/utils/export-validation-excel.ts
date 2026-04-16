export function exportValidationExcel(data: any[]) {
  const headers = ['ID', 'Pays', 'Période', 'Statut', 'Soumis le', 'Validateur', 'Action', 'Date action'];
  const rows = data.map(d => [
    d.id?.slice(0, 8) || '',
    d.country_id || '',
    `${d.period_start} → ${d.period_end}`,
    d.status || '',
    d.submitted_at ? new Date(d.submitted_at).toLocaleDateString() : '',
    '', '', '',
  ]);

  const csvContent = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `validation-stats-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
