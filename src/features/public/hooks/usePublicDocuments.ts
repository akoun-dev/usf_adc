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

// Re-export types and constants from service
export type { DocumentWithTags as PublicDocument, DocumentStats };
export { DOCUMENT_CATEGORIES, DOCUMENT_TYPES };

/**
 * Hook to fetch all public documents
 */
export function usePublicDocuments() {
  return useQuery({
    queryKey: ['public-documents'],
    queryFn: fetchPublicDocuments,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch documents by category
 */
export function usePublicDocumentsByCategory(category: string) {
  return useQuery({
    queryKey: ['public-documents', 'category', category],
    queryFn: () => fetchDocumentsByCategory(category),
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
    queryFn: () => fetchDocumentsByLanguage(language),
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
    queryFn: () => fetchDocumentsByType(type),
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
    queryFn: fetchFeaturedDocuments,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Hook to fetch a single document by ID
 */
export function usePublicDocument(id: string) {
  return useQuery({
    queryKey: ['public-document', id],
    queryFn: () => fetchDocumentById(id),
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
    queryFn: fetchDocumentStats,
    staleTime: 15 * 60 * 1000,
  });
}

/**
 * Hook to search documents
 */
export function useDocumentSearch(query: string) {
  return useQuery({
    queryKey: ['public-documents', 'search', query],
    queryFn: () => query.trim() ? searchDocuments(query) : Promise.resolve([] as DocumentWithTags[]),
    enabled: query.length > 2,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Utility function to get document URL
 */
export { getDocumentUrl };
