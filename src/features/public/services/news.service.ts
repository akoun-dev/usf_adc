import { supabase } from '@/integrations/supabase/client';

// Types based on Supabase migrations
export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  source: string | null;
  image_url: string | null;
  published_at: string | null;
  is_public: boolean;
  author: string | null;
  read_time: string | null;
  language: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
}

export interface NewsWithTags extends NewsArticle {
  tags: string[];
}

/**
 * Fetches all public news articles
 */
export async function fetchPublicNews(limit = 20): Promise<NewsWithTags[]> {
  const { data, error } = await supabase
    .from('news')
    .select(`
      *,
      news_tags(tag)
    `)
    .eq('is_public', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) throw error;

  return (data || []).map(article => ({
    ...article,
    tags: article.news_tags?.map((nt: { tag: string }) => nt.tag) || []
  }));
}

/**
 * Fetches a single news article by ID
 */
export async function fetchNewsById(id: string): Promise<NewsWithTags | null> {
  const { data, error } = await supabase
    .from('news')
    .select(`
      *,
      news_tags(tag)
    `)
    .eq('id', id)
    .eq('is_public', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  return {
    ...data,
    tags: data.news_tags?.map((nt: { tag: string }) => nt.tag) || []
  };
}

/**
 * Fetches news by category
 */
export async function fetchNewsByCategory(category: string, limit = 10): Promise<NewsWithTags[]> {
  const { data, error } = await supabase
    .from('news')
    .select(`
      *,
      news_tags(tag)
    `)
    .eq('is_public', true)
    .eq('category', category)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) throw error;

  return (data || []).map(article => ({
    ...article,
    tags: article.news_tags?.map((nt: { tag: string }) => nt.tag) || []
  }));
}

/**
 * Fetches news by language
 */
export async function fetchNewsByLanguage(language: string, limit = 10): Promise<NewsWithTags[]> {
  const { data, error } = await supabase
    .from('news')
    .select(`
      *,
      news_tags(tag)
    `)
    .eq('is_public', true)
    .eq('language', language)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) throw error;

  return (data || []).map(article => ({
    ...article,
    tags: article.news_tags?.map((nt: { tag: string }) => nt.tag) || []
  }));
}

/**
 * Fetches latest news (most recent)
 */
export async function fetchLatestNews(limit = 5): Promise<NewsWithTags[]> {
  const { data, error } = await supabase
    .from('news')
    .select(`
      *,
      news_tags(tag)
    `)
    .eq('is_public', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) throw error;

  return (data || []).map(article => ({
    ...article,
    tags: article.news_tags?.map((nt: { tag: string }) => nt.tag) || []
  }));
}
