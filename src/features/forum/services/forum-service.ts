import { supabase } from '@/integrations/supabase/client';
import type { ForumCategory, ForumTopic, ForumPost } from '../types';

export const forumService = {
  async getCategories(): Promise<ForumCategory[]> {
    const { data, error } = await supabase
      .from('forum_categories')
      .select('*')
      .order('sort_order');
    if (error) throw error;
    return data as ForumCategory[];
  },

  async getTopics(categoryId?: string): Promise<ForumTopic[]> {
    let query = supabase
      .from('forum_topics')
      .select(`
        *,
        category:forum_categories(*),
        author:profiles!forum_topics_created_by_fkey(full_name, avatar_url)
      `)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Fetch post counts
    const topicIds = (data || []).map((t: any) => t.id);
    const { data: postCounts } = await supabase
      .from('forum_posts')
      .select('topic_id')
      .in('topic_id', topicIds);

    const countMap: Record<string, number> = {};
    (postCounts || []).forEach((p: any) => {
      countMap[p.topic_id] = (countMap[p.topic_id] || 0) + 1;
    });

    return (data || []).map((t: any) => ({
      ...t,
      author: Array.isArray(t.author) ? t.author[0] : t.author,
      post_count: countMap[t.id] || 0,
    })) as ForumTopic[];
  },

  async getTopic(id: string): Promise<ForumTopic> {
    const { data, error } = await supabase
      .from('forum_topics')
      .select(`
        *,
        category:forum_categories(*),
        author:profiles!forum_topics_created_by_fkey(full_name, avatar_url)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    const topic = data as any;
    return {
      ...topic,
      author: Array.isArray(topic.author) ? topic.author[0] : topic.author,
    } as ForumTopic;
  },

  async getTopicPosts(topicId: string): Promise<ForumPost[]> {
    const { data, error } = await supabase
      .from('forum_posts')
      .select(`
        *,
        author:profiles!forum_posts_author_id_fkey(full_name, avatar_url)
      `)
      .eq('topic_id', topicId)
      .order('created_at');
    if (error) throw error;
    return (data || []).map((p: any) => ({
      ...p,
      author: Array.isArray(p.author) ? p.author[0] : p.author,
    })) as ForumPost[];
  },

  async createTopic(input: { title: string; content: string; category_id: string; created_by: string }): Promise<ForumTopic> {
    const { data, error } = await supabase
      .from('forum_topics')
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data as ForumTopic;
  },

  async createPost(input: { topic_id: string; content: string; author_id: string }): Promise<ForumPost> {
    const { data, error } = await supabase
      .from('forum_posts')
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data as ForumPost;
  },

  async updateTopic(id: string, input: { title: string; content: string }): Promise<ForumTopic> {
    const { data, error } = await supabase
      .from('forum_topics')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as ForumTopic;
  },

  async deleteTopic(id: string): Promise<void> {
    const { error } = await supabase.from('forum_topics').delete().eq('id', id);
    if (error) throw error;
  },

  async updatePost(id: string, input: { content: string }): Promise<ForumPost> {
    const { data, error } = await supabase
      .from('forum_posts')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as ForumPost;
  },

  async deletePost(id: string): Promise<void> {
    const { error } = await supabase.from('forum_posts').delete().eq('id', id);
    if (error) throw error;
  },
};
