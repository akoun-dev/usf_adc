import { useState, useCallback } from 'react';
import { MapPin, FileDown, Share2, Image, Copy } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { ProjectMap } from '../components/ProjectMap';
import { ProjectFilters } from '../components/ProjectFilters';
import { ProjectSidebar } from '../components/ProjectSidebar';
import { ProjectFormDialog } from '../components/ProjectFormDialog';
import { exportMapData, generateShareableMapUrl } from '../utils/export-map';
import type { ProjectFilters as Filters, Project } from '../types';
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS, type ProjectStatus } from '../types';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import PageHero from '@/components/PageHero';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function ProjectsMapPage() {
  const [filters, setFilters] = useState<Filters>({});
  const { data: projects = [], isLoading } = useProjects(filters);
  const { t } = useTranslation();
  const { roles } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const isAdmin = roles?.includes('global_admin') || roles?.includes('country_admin');

  const handleProjectSelect = useCallback((project: Project) => {
    setSelectedProjectId(project.id);
  }, []);

  const handleProjectClick = useCallback((project: Project) => {
    setSelectedProjectId(project.id);
  }, []);

  const handleAdd = () => {
    setEditingProject(null);
    setDialogOpen(true);
  };

  const handleEdit = useCallback((project: Project) => {
    if (!isAdmin) return;
    setEditingProject(project);
    setDialogOpen(true);
  }, [isAdmin]);

  /* US-063: Share filtered map link */
  const handleShare = () => {
    const url = generateShareableMapUrl({
      status: filters.status || undefined,
      region: filters.region,
      country_id: filters.country_id,
      search: filters.search,
    });
    navigator.clipboard.writeText(url);
    toast.success(t('map.linkCopied', 'Lien de la carte copié dans le presse-papiers'));
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <PageHero
        title={t('map.title')}
        description={t('map.desc')}
        icon={<MapPin className="h-6 w-6 text-secondary" />}
      >
        <div className="flex gap-2">
          {/* US-061: Export map */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 border-white/20">
                <FileDown className="mr-1 h-4 w-4" />{t('map.export', 'Exporter')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportMapData(projects, 'csv')}>
                <FileDown className="mr-2 h-4 w-4" />CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportMapData(projects, 'png')}>
                <Image className="mr-2 h-4 w-4" />PNG
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* US-063: Share link */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 border-white/20"
          >
            <Share2 className="mr-1 h-4 w-4" />{t('map.share', 'Partager')}
          </Button>
        </div>
      </PageHero>

      <ProjectFilters filters={filters} onChange={setFilters} />

      <div className="flex-1 flex gap-4 min-h-[500px]">
        <div className="w-[320px] shrink-0 hidden lg:block">
          <ProjectSidebar
            projects={projects}
            selectedId={selectedProjectId}
            onSelect={(p) => {
              handleProjectSelect(p);
              if (isAdmin) handleEdit(p);
            }}
            onAdd={handleAdd}
            showAddButton={isAdmin}
          />
        </div>

        <div className="flex-1 rounded-lg border overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <ProjectMap
              projects={projects}
              selectedProjectId={selectedProjectId}
              onProjectClick={handleProjectClick}
            />
          )}
        </div>
      </div>

      <div className="flex items-center gap-6 px-2 py-2">
        {(Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[]).map((status) => {
          const isActive = filters.status === status;
          return (
            <button
              key={status}
              type="button"
              className={`flex items-center gap-2 rounded-full px-3 py-1 transition-colors ${
                isActive ? 'bg-primary/10 ring-1 ring-primary' : 'hover:bg-muted'
              }`}
              onClick={() => setFilters((prev) => ({ ...prev, status: isActive ? '' : status }))}
            >
              <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: PROJECT_STATUS_COLORS[status] }} />
              <span className={`text-sm ${isActive ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                {PROJECT_STATUS_LABELS[status]}
              </span>
            </button>
          );
        })}
      </div>

      <ProjectFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={editingProject}
      />
    </div>
  );
}
