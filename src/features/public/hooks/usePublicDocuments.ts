import { useQuery } from '@tanstack/react-query';
import { mockDocuments, DOCUMENT_CATEGORIES, DOCUMENT_TYPES } from '../data/mockDocuments';
import type { PublicDocument } from '../data/mockDocuments';

// Re-export for convenience
export { DOCUMENT_CATEGORIES, DOCUMENT_TYPES };

export function usePublicDocuments() {
  return useQuery<PublicDocument[]>({
    queryKey: ['public-documents'],
    queryFn: async () => {
      // Return mock data directly
      return mockDocuments;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function usePublicDocumentsByCategory(category: string) {
  return useQuery<PublicDocument[]>({
    queryKey: ['public-documents', 'category', category],
    queryFn: async () => {
      if (category === 'all') return mockDocuments;
      return mockDocuments.filter(d => d.category === category);
    },
    enabled: !!category,
    staleTime: 10 * 60 * 1000,
  });
}

export function usePublicDocumentsByLanguage(language: string) {
  return useQuery<PublicDocument[]>({
    queryKey: ['public-documents', 'language', language],
    queryFn: async () => {
      return mockDocuments.filter(d => d.language === language);
    },
    enabled: !!language,
    staleTime: 10 * 60 * 1000,
  });
}

export function useFeaturedDocuments() {
  return useQuery<PublicDocument[]>({
    queryKey: ['public-documents', 'featured'],
    queryFn: async () => {
      return mockDocuments.filter(d => d.featured);
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function usePublicDocumentStats() {
  return useQuery({
    queryKey: ['public-documents', 'stats'],
    queryFn: async () => {
      const total = mockDocuments.length;
      const byCategory = mockDocuments.reduce((acc, d) => {
        acc[d.category] = (acc[d.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const byType = mockDocuments.reduce((acc, d) => {
        acc[d.type] = (acc[d.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const byLanguage = mockDocuments.reduce((acc, d) => {
        acc[d.language] = (acc[d.language] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        total,
        byCategory,
        byType,
        byLanguage,
        featured: mockDocuments.filter(d => d.featured).length,
      };
    },
    staleTime: 15 * 60 * 1000,
  });
}
