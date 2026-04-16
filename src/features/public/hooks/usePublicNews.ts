import { useQuery } from '@tanstack/react-query';
import {
  fetchPublicNews,
  fetchNewsById,
  fetchNewsByCategory,
  fetchNewsByLanguage,
  fetchLatestNews,
  type NewsWithTags,
} from '../services';
import { mockNews } from '../data/mockNews';

// Re-export types from service
export type { NewsWithTags as NewsArticle };

/**
 * Hook to fetch all public news articles
 */
export function usePublicNews(limit = 20) {
  return useQuery({
    queryKey: ['public-news', { limit }],
    queryFn: async () => {
      try {
        return await fetchPublicNews(limit);
      } catch (error) {
        // Fallback to mock data if database is not available
        console.warn('Failed to fetch news from database, using mock data:', error);
        return mockNews as unknown as NewsWithTags[];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single news article by ID
 */
export function useNewsArticle(id: string) {
  return useQuery({
    queryKey: ['public-news', id],
    queryFn: async () => {
      try {
        const article = await fetchNewsById(id);
        if (article) return article;
        // Fallback to mock data if not found in database
        return mockNews.find(n => n.id === id) as unknown as NewsWithTags | undefined;
      } catch (error) {
        console.warn('Failed to fetch news article from database, using mock data:', error);
        return mockNews.find(n => n.id === id) as unknown as NewsWithTags | undefined;
      }
    },
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
    queryFn: async () => {
      try {
        return await fetchNewsByCategory(category, limit);
      } catch (error) {
        console.warn('Failed to fetch news by category from database:', error);
        return mockNews.filter(n => n.category === category) as unknown as NewsWithTags[];
      }
    },
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
    queryFn: async () => {
      try {
        return await fetchNewsByLanguage(language, limit);
      } catch (error) {
        console.warn('Failed to fetch news by language from database:', error);
        return mockNews.filter(n => n.language === language) as unknown as NewsWithTags[];
      }
    },
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
    queryFn: async () => {
      try {
        return await fetchLatestNews(limit);
      } catch (error) {
        console.warn('Failed to fetch latest news from database, using mock data:', error);
        return mockNews.slice(0, limit) as unknown as NewsWithTags[];
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

