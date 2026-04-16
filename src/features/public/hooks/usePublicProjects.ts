import { useQuery } from '@tanstack/react-query';
import { mockProjects } from '../data/mockProjects';
import type { PublicProject } from '../data/mockProjects';

export function usePublicProjects() {
  return useQuery<PublicProject[]>({
    queryKey: ['public-projects'],
    queryFn: async () => {
      // Return mock data directly
      return mockProjects;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePublicProjectsByCountry(countryCode: string) {
  return useQuery<PublicProject[]>({
    queryKey: ['public-projects', 'country', countryCode],
    queryFn: async () => {
      // Filter mock projects by country
      return mockProjects.filter(p => p.countryCode === countryCode);
    },
    enabled: !!countryCode,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePublicProjectsByThematic(thematic: string) {
  return useQuery<PublicProject[]>({
    queryKey: ['public-projects', 'thematic', thematic],
    queryFn: async () => {
      // Filter mock projects by thematic
      return mockProjects.filter(p => p.thematic === thematic);
    },
    enabled: !!thematic && thematic !== 'all',
    staleTime: 5 * 60 * 1000,
  });
}

export function usePublicProjectStats() {
  return useQuery({
    queryKey: ['public-projects', 'stats'],
    queryFn: async () => {
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
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
