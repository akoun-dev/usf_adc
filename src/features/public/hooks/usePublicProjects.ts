import { useQuery } from '@tanstack/react-query';
import {
  fetchPublicProjects,
  fetchProjectsByCountryCode,
  fetchProjectsByThematic,
  fetchProjectsByStatus,
  fetchProjectById,
  fetchProjectStats,
  fetchProjectsForMap,
  type ProjectWithDetails,
  type ProjectStats,
  type ProjectStatus,
} from '../services';

// Re-export types from service
export type { ProjectWithDetails as PublicProject, ProjectStats, ProjectStatus };

/**
 * Hook to fetch all public projects
 */
export function usePublicProjects() {
  return useQuery({
    queryKey: ['public-projects'],
    queryFn: fetchPublicProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch projects by country ISO code
 */
export function usePublicProjectsByCountry(countryCode: string) {
  return useQuery({
    queryKey: ['public-projects', 'country', countryCode],
    queryFn: () => fetchProjectsByCountryCode(countryCode),
    enabled: !!countryCode,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch projects by thematic
 */
export function usePublicProjectsByThematic(thematic: string) {
  return useQuery({
    queryKey: ['public-projects', 'thematic', thematic],
    queryFn: () => fetchProjectsByThematic(thematic),
    enabled: !!thematic && thematic !== 'all',
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch projects by status
 */
export function usePublicProjectsByStatus(status: ProjectStatus) {
  return useQuery({
    queryKey: ['public-projects', 'status', status],
    queryFn: () => fetchProjectsByStatus(status),
    enabled: !!status,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single project by ID
 */
export function usePublicProject(id: string) {
  return useQuery({
    queryKey: ['public-project', id],
    queryFn: () => fetchProjectById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch project statistics
 */
export function usePublicProjectStats() {
  return useQuery({
    queryKey: ['public-projects', 'stats'],
    queryFn: fetchProjectStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch projects for map display
 */
export function useProjectsForMap() {
  return useQuery({
    queryKey: ['public-projects', 'map'],
    queryFn: fetchProjectsForMap,
    staleTime: 5 * 60 * 1000,
  });
}
