import { Badge } from '@/components/ui/badge';
import type { Project } from '../types';
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '../types';

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
  return (
    <div className="min-w-[220px] max-w-[280px]">
      <h3 className="font-semibold text-sm mb-1">{project.title}</h3>
      <p className="text-xs text-muted-foreground mb-2">
        {project.countries?.name_fr ?? '—'} • {project.region ?? '—'}
      </p>
      {project.description && (
        <p className="text-xs mb-2 line-clamp-2">{project.description}</p>
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
