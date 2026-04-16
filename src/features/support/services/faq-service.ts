import { supabase } from '@/integrations/supabase/client';

export interface FaqArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const faqService = {
  async getPublished(): Promise<FaqArticle[]> {
    const { data, error } = await supabase
      .from('faq_articles')
      .select('*')
      .eq('is_published', true)
      .order('category')
      .order('sort_order');
    if (error) throw error;
    return data as FaqArticle[];
  },

  async getAll(): Promise<FaqArticle[]> {
    const { data, error } = await supabase
      .from('faq_articles')
      .select('*')
      .order('category')
      .order('sort_order');
    if (error) throw error;
    return data as FaqArticle[];
  },

  async create(article: Omit<FaqArticle, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
    const { error } = await supabase.from('faq_articles').insert(article);
    if (error) throw error;
  },

  async update(id: string, updates: Partial<FaqArticle>): Promise<void> {
    const { error } = await supabase.from('faq_articles').update(updates).eq('id', id);
    if (error) throw error;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('faq_articles').delete().eq('id', id);
    if (error) throw error;
  },
};
