import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mockNews } from '../data/mockNews';

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  source: string | null;
  category: string | null;
  image_url: string | null;
  published_at: string | null;
  is_public: boolean;
  created_at?: string;
  author?: string;
  read_time?: string;
  tags?: string[];
}

export function usePublicNews() {
  return useQuery({
    queryKey: ['public-news'],
    queryFn: async () => {
      // Always return mock data for now
      // TODO: Remove this when database is properly populated
      return mockNews;

      /* Try to fetch from news_articles table first
      const { data, error } = await supabase
        .from('news_articles' as any)
        .select('*')
        .eq('is_public', true)
        .order('published_at', { ascending: false, nullsFirst: false })
        .limit(20);

      if (error) {
        // If table doesn't exist, return mock data
        if (error.code === '42P01') {
          return mockNews;
        }
        throw error;
      }

      // If table exists but is empty, return mock data
      if (!data || data.length === 0) {
        return mockNews;
      }

      return data as NewsArticle[];
      */
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useNewsArticle(id: string) {
  return useQuery({
    queryKey: ['public-news', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_articles' as any)
        .select('*')
        .eq('id', id)
        .eq('is_public', true)
        .single();

      if (error) {
        if (error.code === '42P01') {
          return mockNews.find(n => n.id === id);
        }
        throw error;
      }

      return data as unknown as NewsArticle;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

