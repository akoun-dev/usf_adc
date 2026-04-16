/**
 * US-025: Generate and download pre-filled Excel template for FSU data entry.
 * Uses CSV format with BOM for Excel compatibility.
 */
export function downloadFsuTemplate(periodStart?: string, periodEnd?: string): void {
  const headers = [
    'Indicateur', 'Valeur', 'Unité', 'Commentaire',
  ];

  const rows = [
    ['=== CONNECTIVITÉ ===', '', '', ''],
    ['Population couverte', '', 'habitants', ''],
    ['Taux pénétration mobile', '', '%', 'Max 100'],
    ['Taux pénétration internet', '', '%', 'Max 100'],
    ['Nombre opérateurs', '', 'entier', ''],
    ['Abonnés mobiles', '', 'nombre', ''],
    ['Abonnés internet', '', 'nombre', ''],
    ['', '', '', ''],
    ['=== FINANCEMENT ===', '', '', ''],
    ['Budget FSU annuel', '', 'USD', ''],
    ['Contributions collectées', '', 'USD', ''],
    ['Dépenses engagées', '', 'USD', ''],
    ['Solde', '', 'USD', 'Auto-calculé'],
    ['Projets financés', '', 'nombre', ''],
    ['', '', '', ''],
    ['=== QUALITÉ DE SERVICE ===', '', '', ''],
    ['Latence moyenne', '', 'ms', ''],
    ['Disponibilité réseau', '', '%', 'Max 100'],
    ['Couverture géographique', '', '%', 'Max 100'],
    ['Couverture population', '', '%', 'Max 100'],
    ['Débit descendant moyen', '', 'Mbps', ''],
  ];

  const period = periodStart && periodEnd
    ? `Période: ${periodStart} → ${periodEnd}`
    : `Période: à compléter`;

  const csvContent = [
    [`Modèle de saisie FSU — ${period}`],
    [],
    headers,
    ...rows,
  ]
    .map((r) => r.map((c) => `"${c}"`).join(','))
    .join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `modele-fsu-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
