import { supabase } from '@/integrations/supabase/client';
import type { Newsletter, NewsletterInput } from '../types';

export const newsletterService = {
  async list(): Promise<Newsletter[]> {
    const { data, error } = await supabase
      .from('newsletters')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as Newsletter[];
  },

  async getById(id: string): Promise<Newsletter> {
    const { data, error } = await supabase
      .from('newsletters')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as unknown as Newsletter;
  },

  async create(input: NewsletterInput): Promise<Newsletter> {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('newsletters')
      .insert({
        title: input.title,
        summary: input.summary ?? null,
        content: input.content,
        target_roles: input.target_roles,
        created_by: user?.id ?? '',
      })
      .select('*')
      .single();
    if (error) throw error;
    return data as unknown as Newsletter;
  },

  async update(id: string, input: Partial<NewsletterInput> & { is_published?: boolean; published_at?: string | null }): Promise<Newsletter> {
    const updatePayload: Record<string, unknown> = {};
    if (input.title !== undefined) updatePayload.title = input.title;
    if (input.summary !== undefined) updatePayload.summary = input.summary;
    if (input.content !== undefined) updatePayload.content = input.content;
    if (input.target_roles !== undefined) updatePayload.target_roles = input.target_roles;
    if (input.is_published !== undefined) updatePayload.is_published = input.is_published;
    if (input.published_at !== undefined) updatePayload.published_at = input.published_at;

    const { data, error } = await supabase
      .from('newsletters')
      .update(updatePayload as { title?: string })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data as unknown as Newsletter;
  },

  async publish(id: string): Promise<Newsletter> {
    return this.update(id, { is_published: true, published_at: new Date().toISOString() });
  },

  async unpublish(id: string): Promise<Newsletter> {
    return this.update(id, { is_published: false, published_at: null });
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('newsletters').delete().eq('id', id);
    if (error) throw error;
  },
};
