import type { Project } from '../types';

/**
 * US-061: Export map data as CSV (PDF would require html2canvas which is heavy).
 * For now, exports project list with coordinates as CSV.
 */
export function exportMapData(projects: Project[], format: 'csv' | 'png' = 'csv'): void {
  if (format === 'png') {
    // Capture the map container as PNG using canvas
    const mapEl = document.querySelector('.leaflet-container') as HTMLElement | null;
    if (!mapEl) return;

    import('html2canvas').then(({ default: html2canvas }) => {
      html2canvas(mapEl, { useCORS: true }).then((canvas) => {
        const link = document.createElement('a');
        link.download = `carte-projets-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }).catch(() => {
      // Fallback to CSV if html2canvas not available
      exportMapData(projects, 'csv');
    });
    return;
  }

  const headers = ['Titre', 'Pays', 'Région', 'Statut', 'Budget', 'Latitude', 'Longitude'];
  const rows = projects.map((p) => [
    p.title,
    p.countries?.name_fr ?? '',
    p.region ?? '',
    p.status,
    p.budget?.toString() ?? '',
    p.latitude?.toString() ?? '',
    p.longitude?.toString() ?? '',
  ]);

  const csvContent = [headers, ...rows]
    .map((r) => r.map((c) => `"${c}"`).join(','))
    .join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `projets-carte-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * US-063: Generate shareable URL with current filters encoded as query params.
 */
export function generateShareableMapUrl(filters: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return `${window.location.origin}/map${params.toString() ? '?' + params.toString() : ''}`;
}
