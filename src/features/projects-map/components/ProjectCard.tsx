import { Badge } from '@/components/ui/badge';
import type { Project } from '../types';
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '../types';
import { useTranslation } from 'react-i18next';
import { getLangValue } from '@/types/i18n';

interface Props {
  project: Project;
}

function formatBudget(budget: number | null): string {
  if (!budget) return '—';
  if (budget >= 1_000_000) return `${(budget / 1_000_000).toFixed(1)} M$`;
  if (budget >= 1_000) return `${(budget / 1_000).toFixed(0)} k$`;
  return `${budget} $`;
}

export function ProjectCard({ project }: Props) {
  const { i18n } = useTranslation();
  return (
    <div className="min-w-[220px] max-w-[280px]">
      <h3 className="font-semibold text-sm mb-1">{getLangValue(project.title, i18n.language)}</h3>
      <div className="flex items-center gap-2 mb-2">
        {project.countries?.flag_url && (
          <img
            src={project.countries.flag_url}
            alt={project.countries.name_fr}
            className="h-4 w-auto"
          />
        )}
        <p className="text-xs text-muted-foreground">
          {project.countries?.name_fr ?? '—'} • {project.region ?? '—'}
        </p>
      </div>
      {project.description && (
        <p className="text-xs mb-2 line-clamp-2">{getLangValue(project.description, i18n.language)}</p>
      )}
      <div className="flex items-center justify-between">
        <Badge
          className="text-[10px]"
          style={{ backgroundColor: PROJECT_STATUS_COLORS[project.status], color: '#fff', borderColor: 'transparent' }}
        >
          {PROJECT_STATUS_LABELS[project.status]}
        </Badge>
        <span className="text-xs font-medium">{formatBudget(project.budget)}</span>
      </div>
    </div>
  );
}
