import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ReportsData } from '../types';

export function exportReportsPDF(data: ReportsData) {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString('fr-FR');

  // Title
  doc.setFontSize(18);
  doc.text('Rapport des soumissions FSU', 14, 20);
  doc.setFontSize(10);
  doc.text(`Généré le ${date}`, 14, 28);

  // KPIs table
  autoTable(doc, {
    startY: 35,
    head: [['Métrique', 'Valeur']],
    body: [
      ['Total soumissions', String(data.total)],
      ['En attente', String(data.pending)],
      ['Approuvées', String(data.approved)],
      ['Rejetées', String(data.rejected)],
      ["Taux d'approbation", `${data.approvalRate}%`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
  });

  // Status table
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const statusY = (doc as any).lastAutoTable.finalY + 10;
  autoTable(doc, {
    startY: statusY,
    head: [['Statut', 'Nombre']],
    body: data.byStatus.map((s) => [s.status, String(s.count)]),
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
  });

  // Country table
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const countryY = (doc as any).lastAutoTable.finalY + 10;
  autoTable(doc, {
    startY: countryY,
    head: [['Pays', 'Total', 'En attente', 'Approuvées', 'Rejetées', 'Taux']],
    body: data.byCountry.map((c) => [
      c.country_name,
      String(c.total),
      String(c.pending),
      String(c.approved),
      String(c.rejected),
      `${c.approval_rate}%`,
    ]),
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
  });

  doc.save(`rapport-fsu-${new Date().toISOString().slice(0, 10)}.pdf`);
}
