import type { UserProfile } from '../types';
import { ROLE_LABELS } from '@/core/constants/roles';

export function exportUsersToExcel(users: UserProfile[]) {
  const BOM = '\uFEFF';
  const headers = ['Nom complet', 'Pays', 'Code ISO', 'Rôles', 'Statut', 'Langue', 'Date de création'];
  
  const rows = users.map((u) => [
    u.full_name || '',
    u.country?.name_fr || '',
    u.country?.code_iso || '',
    u.roles.map((r) => ROLE_LABELS[r] || r).join(', '),
    u.is_active ? 'Actif' : 'Inactif',
    u.language.toUpperCase(),
    new Date(u.created_at).toLocaleDateString('fr-FR'),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
    .join('\n');

  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `utilisateurs_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
