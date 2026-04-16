import { useQuery } from '@tanstack/react-query';
import {
  fetchPublicDocuments,
  fetchDocumentsByCategory,
  fetchDocumentsByLanguage,
  fetchDocumentsByType,
  fetchFeaturedDocuments,
  fetchDocumentById,
  fetchDocumentStats,
  searchDocuments,
  getDocumentUrl,
  type DocumentWithTags,
  type DocumentStats,
  DOCUMENT_CATEGORIES,
  DOCUMENT_TYPES,
} from '../services';
import { mockDocuments } from '../data/mockDocuments';
import type { PublicDocument } from '../data/mockDocuments';

// Re-export types and constants from service
export type { DocumentWithTags as PublicDocument, DocumentStats };
export { DOCUMENT_CATEGORIES, DOCUMENT_TYPES };

/**
 * Hook to fetch all public documents
 */
export function usePublicDocuments() {
  return useQuery({
    queryKey: ['public-documents'],
    queryFn: async () => {
      try {
        return await fetchPublicDocuments();
      } catch (error) {
        // Fallback to mock data if database is not available
        console.warn('Failed to fetch documents from database, using mock data:', error);
        return mockDocuments as unknown as DocumentWithTags[];
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch documents by category
 */
export function usePublicDocumentsByCategory(category: string) {
  return useQuery({
    queryKey: ['public-documents', 'category', category],
    queryFn: async () => {
      try {
        return await fetchDocumentsByCategory(category);
      } catch (error) {
        console.warn('Failed to fetch documents by category from database, using mock data:', error);
        if (category === 'all') return mockDocuments as unknown as DocumentWithTags[];
        return mockDocuments.filter(d => d.category === category) as unknown as DocumentWithTags[];
      }
    },
    enabled: !!category,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch documents by language
 */
export function usePublicDocumentsByLanguage(language: string) {
  return useQuery({
    queryKey: ['public-documents', 'language', language],
    queryFn: async () => {
      try {
        return await fetchDocumentsByLanguage(language);
      } catch (error) {
        console.warn('Failed to fetch documents by language from database, using mock data:', error);
        return mockDocuments.filter(d => d.language === language) as unknown as DocumentWithTags[];
      }
    },
    enabled: !!language,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch documents by type
 */
export function usePublicDocumentsByType(type: string) {
  return useQuery({
    queryKey: ['public-documents', 'type', type],
    queryFn: async () => {
      try {
        return await fetchDocumentsByType(type);
      } catch (error) {
        console.warn('Failed to fetch documents by type from database, using mock data:', error);
        return mockDocuments.filter(d => d.type === type) as unknown as DocumentWithTags[];
      }
    },
    enabled: !!type,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch featured documents
 */
export function useFeaturedDocuments() {
  return useQuery({
    queryKey: ['public-documents', 'featured'],
    queryFn: async () => {
      try {
        return await fetchFeaturedDocuments();
      } catch (error) {
        console.warn('Failed to fetch featured documents from database, using mock data:', error);
        return mockDocuments.filter(d => d.featured) as unknown as DocumentWithTags[];
      }
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Hook to fetch a single document by ID
 */
export function usePublicDocument(id: string) {
  return useQuery({
    queryKey: ['public-document', id],
    queryFn: async () => {
      try {
        const document = await fetchDocumentById(id);
        if (document) return document;
        // Fallback to mock data if not found
        return mockDocuments.find(d => d.id === id) as unknown as DocumentWithTags | undefined;
      } catch (error) {
        console.warn('Failed to fetch document from database, using mock data:', error);
        return mockDocuments.find(d => d.id === id) as unknown as DocumentWithTags | undefined;
      }
    },
    enabled: !!id,
    staleTime: 15 * 60 * 1000,
  });
}

/**
 * Hook to fetch document statistics
 */
export function usePublicDocumentStats() {
  return useQuery({
    queryKey: ['public-documents', 'stats'],
    queryFn: async () => {
      try {
        return await fetchDocumentStats();
      } catch (error) {
        console.warn('Failed to fetch document stats from database, using mock data:', error);
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
      }
    },
    staleTime: 15 * 60 * 1000,
  });
}

/**
 * Hook to search documents
 */
export function useDocumentSearch(query: string) {
  return useQuery({
    queryKey: ['public-documents', 'search', query],
    queryFn: async () => {
      if (!query.trim()) return [] as DocumentWithTags[];
      try {
        return await searchDocuments(query);
      } catch (error) {
        console.warn('Failed to search documents from database, using mock data:', error);
        return mockDocuments.filter(d =>
          d.title.toLowerCase().includes(query.toLowerCase()) ||
          d.description?.toLowerCase().includes(query.toLowerCase())
        ) as unknown as DocumentWithTags[];
      }
    },
    enabled: query.length > 2,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Utility function to get document URL
 */
export { getDocumentUrl };
