import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import type { ProjectFilters as Filters, ProjectStatus } from '../types';
import { PROJECT_STATUS_LABELS, REGIONS } from '../types';
import { useCountries } from '../hooks/useCountries';

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function ProjectFilters({ filters, onChange }: Props) {
  const { data: countries = [] } = useCountries();

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-card rounded-lg border">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un projet…"
          value={filters.search ?? ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="pl-9"
        />
      </div>
      <Select
        value={filters.status ?? 'all'}
        onValueChange={(v) => onChange({ ...filters, status: v === 'all' ? '' : (v as ProjectStatus) })}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          {Object.entries(PROJECT_STATUS_LABELS).map(([k, v]) => (
            <SelectItem key={k} value={k}>{v}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.region ?? 'all'}
        onValueChange={(v) => onChange({ ...filters, region: v === 'all' ? undefined : v })}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Région" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les régions</SelectItem>
          {REGIONS.map((r) => (
            <SelectItem key={r} value={r}>{r}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.country_id ?? 'all'}
        onValueChange={(v) => onChange({ ...filters, country_id: v === 'all' ? undefined : v })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Pays" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les pays</SelectItem>
          {countries.map((c) => (
            <SelectItem key={c.id} value={c.id}>{c.name_fr}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
