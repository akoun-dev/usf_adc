import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Plus, MapPin } from 'lucide-react';
import type { Project } from '../types';
import { PROJECT_STATUS_COLORS, PROJECT_STATUS_LABELS } from '../types';
import { Badge } from '@/components/ui/badge';

interface Props {
  projects: Project[];
  selectedId?: string | null;
  onSelect: (project: Project) => void;
  onAdd?: () => void;
  showAddButton?: boolean;
}

function formatBudget(budget: number | null): string {
  if (!budget) return '—';
  if (budget >= 1_000_000) return `${(budget / 1_000_000).toFixed(1)} M$`;
  if (budget >= 1_000) return `${(budget / 1_000).toFixed(0)} k$`;
  return `${budget} $`;
}

export function ProjectSidebar({ projects, selectedId, onSelect, onAdd, showAddButton }: Props) {
  return (
    <div className="flex flex-col h-full border rounded-lg bg-card">
      <div className="flex items-center justify-between p-3 border-b">
        <span className="text-sm font-semibold">{projects.length} projet{projects.length !== 1 ? 's' : ''}</span>
        {showAddButton && onAdd && (
          <Button size="sm" variant="outline" onClick={onAdd}>
            <Plus className="h-4 w-4 mr-1" /> Ajouter
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {projects.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">Aucun projet trouvé</p>
          )}
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => onSelect(project)}
              className={`w-full text-left rounded-lg p-3 transition-colors border ${
                selectedId === project.id
                  ? 'border-primary bg-primary/5'
                  : 'border-transparent hover:bg-muted/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-medium line-clamp-1">{project.title}</h4>
                <Badge
                  className="text-[10px] shrink-0"
                  style={{ backgroundColor: PROJECT_STATUS_COLORS[project.status], color: '#fff', borderColor: 'transparent' }}
                >
                  {PROJECT_STATUS_LABELS[project.status]}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {project.countries?.name_fr ?? '—'} {project.region ? `· ${project.region}` : ''}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {project.latitude && project.longitude && (
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                )}
                <span className="text-xs font-medium">{formatBudget(project.budget)}</span>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
