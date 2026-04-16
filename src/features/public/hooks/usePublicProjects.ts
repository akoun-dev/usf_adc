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
import { mockProjects } from '../data/mockProjects';
import type { PublicProject } from '../data/mockProjects';

// Re-export types from service
export type { ProjectWithDetails as PublicProject, ProjectStats, ProjectStatus };

/**
 * Hook to fetch all public projects
 */
export function usePublicProjects() {
  return useQuery({
    queryKey: ['public-projects'],
    queryFn: async () => {
      try {
        return await fetchPublicProjects();
      } catch (error) {
        // Fallback to mock data if database is not available
        console.warn('Failed to fetch projects from database, using mock data:', error);
        return mockProjects as unknown as ProjectWithDetails[];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch projects by country ISO code
 */
export function usePublicProjectsByCountry(countryCode: string) {
  return useQuery({
    queryKey: ['public-projects', 'country', countryCode],
    queryFn: async () => {
      try {
        return await fetchProjectsByCountryCode(countryCode);
      } catch (error) {
        console.warn('Failed to fetch projects by country from database, using mock data:', error);
        return mockProjects.filter(p => p.countryCode === countryCode) as unknown as ProjectWithDetails[];
      }
    },
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
    queryFn: async () => {
      try {
        return await fetchProjectsByThematic(thematic);
      } catch (error) {
        console.warn('Failed to fetch projects by thematic from database, using mock data:', error);
        return mockProjects.filter(p => p.thematic === thematic) as unknown as ProjectWithDetails[];
      }
    },
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
    queryFn: async () => {
      try {
        return await fetchProjectsByStatus(status);
      } catch (error) {
        console.warn('Failed to fetch projects by status from database:', error);
        return mockProjects.filter(p => p.status === status) as unknown as ProjectWithDetails[];
      }
    },
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
    queryFn: async () => {
      try {
        const project = await fetchProjectById(id);
        if (project) return project;
        // Fallback to mock data if not found
        return mockProjects.find(p => p.id === id) as unknown as ProjectWithDetails | undefined;
      } catch (error) {
        console.warn('Failed to fetch project from database, using mock data:', error);
        return mockProjects.find(p => p.id === id) as unknown as ProjectWithDetails | undefined;
      }
    },
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
    queryFn: async () => {
      try {
        return await fetchProjectStats();
      } catch (error) {
        console.warn('Failed to fetch project stats from database, using mock data:', error);
        const total = mockProjects.length;
        const byStatus = mockProjects.reduce((acc, p) => {
          acc[p.status] = (acc[p.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        const byThematic = mockProjects.reduce((acc, p) => {
          acc[p.thematic] = (acc[p.thematic] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        const totalBeneficiaries = mockProjects.reduce((sum, p) => sum + p.beneficiaries, 0);

        return {
          total,
          byStatus,
          byThematic,
          totalBeneficiaries,
          activeProjects: mockProjects.filter(p => p.status === 'active').length,
          completedProjects: mockProjects.filter(p => p.status === 'completed').length,
        };
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch projects for map display
 */
export function useProjectsForMap() {
  return useQuery({
    queryKey: ['public-projects', 'map'],
    queryFn: async () => {
      try {
        return await fetchProjectsForMap();
      } catch (error) {
        console.warn('Failed to fetch projects for map from database, using mock data:', error);
        return mockProjects.filter(p => p.latitude && p.longitude) as unknown as ProjectWithDetails[];
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}
