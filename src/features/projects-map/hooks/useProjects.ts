import { useQuery } from '@tanstack/react-query';
import { projectsService } from '../services/projects-service';
import type { ProjectFilters } from '../types';

export function useProjects(filters: ProjectFilters = {}) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => projectsService.list(filters),
  });
}
