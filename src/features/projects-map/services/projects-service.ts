import { supabase } from '@/integrations/supabase/client';
import type { Project, ProjectFilters } from '../types';

export interface ProjectInput {
  title: string;
  description?: string | null;
  country_id: string;
  region?: string | null;
  status: Project['status'];
  budget?: number | null;
  latitude?: number | null;
  longitude?: number | null;
}

export const projectsService = {
  async list(filters: ProjectFilters = {}): Promise<Project[]> {
    let query = supabase
      .from('projects')
      .select('*, countries(name_fr, name_en, code_iso, flag_url)')
      .order('created_at', { ascending: false });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.region) {
      query = query.eq('region', filters.region);
    }
    if (filters.country_id) {
      query = query.eq('country_id', filters.country_id);
    }
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as unknown as Project[];
  },

  async getById(id: string): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .select('*, countries(name_fr, name_en, code_iso, flag_url)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as unknown as Project;
  },

  async create(input: ProjectInput): Promise<Project> {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('projects')
      .insert({ ...input, created_by: user?.id ?? null })
      .select('*, countries(name_fr, name_en, code_iso, flag_url)')
      .single();
    if (error) throw error;
    return data as unknown as Project;
  },

  async update(id: string, input: Partial<ProjectInput>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(input)
      .eq('id', id)
      .select('*, countries(name_fr, name_en, code_iso, flag_url)')
      .single();
    if (error) throw error;
    return data as unknown as Project;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },
};
