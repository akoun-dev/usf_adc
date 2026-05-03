import { useQuery } from '@tanstack/react-query';
import {
  fetchPublicNews,
  fetchNewsById,
  fetchNewsByCategory,
  fetchNewsByLanguage,
  fetchLatestNews,
  fetchNewsByCountry,
  type NewsWithTags,
} from '../services';

// Re-export types from service
export type { NewsWithTags as NewsArticle };

/**
 * Hook to fetch all public news articles
 */
export function usePublicNews(limit = 20) {
  return useQuery({
    queryKey: ['public-news', { limit }],
    queryFn: () => fetchPublicNews(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single news article by ID
 */
export function useNewsArticle(id: string) {
  return useQuery({
    queryKey: ['public-news', id],
    queryFn: () => fetchNewsById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch news by category
 */
export function useNewsByCategory(category: string, limit = 10) {
  return useQuery({
    queryKey: ['public-news', 'category', category, { limit }],
    queryFn: () => fetchNewsByCategory(category, limit),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch news by language
 */
export function useNewsByLanguage(language: string, limit = 10) {
  return useQuery({
    queryKey: ['public-news', 'language', language, { limit }],
    queryFn: () => fetchNewsByLanguage(language, limit),
    enabled: !!language,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch latest news
 */
export function useLatestNews(limit = 5) {
  return useQuery({
    queryKey: ['public-news', 'latest', { limit }],
    queryFn: () => fetchLatestNews(limit),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch news by country ID
 */
export function useNewsByCountry(countryId: string, limit = 5) {
  return useQuery({
    queryKey: ['public-news', 'country', countryId, { limit }],
    queryFn: () => fetchNewsByCountry(countryId, limit),
    enabled: !!countryId,
    staleTime: 5 * 60 * 1000,
  });
}

