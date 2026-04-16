import { supabase } from '@/integrations/supabase/client';

// Types based on Supabase migrations
export type ProjectStatus = 'planned' | 'in_progress' | 'completed' | 'suspended';

export interface Country {
  id: string;
  code_iso: string;
  name_fr: string;
  name_en: string;
  region: string;
}

export interface PublicProject {
  id: string;
  country_id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  budget: number | null;
  latitude: number | null;
  longitude: number | null;
  region: string | null;
  progress: number | null;
  beneficiaries: string | null;
  operator: string | null;
  thematic: string | null;
  created_at: string;
  updated_at: string;
  country?: Country;
  images?: string[];
  tags?: string[];
}

export interface ProjectWithDetails extends PublicProject {
  country: Country;
  images: string[];
  tags: string[];
}

export interface ProjectStats {
  total: number;
  byStatus: Record<string, number>;
  byThematic: Record<string, number>;
  totalBeneficiaries: number;
  activeProjects: number;
  completedProjects: number;
}

/**
 * Fetches all public projects
 */
export async function fetchPublicProjects(): Promise<ProjectWithDetails[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      country:countries(id, code_iso, name_fr, name_en, region),
      project_images(image_url),
      project_tags(tag)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map(project => ({
    ...project,
    images: project.project_images?.map((pi: { image_url: string }) => pi.image_url) || [],
    tags: project.project_tags?.map((pt: { tag: string }) => pt.tag) || []
  }));
}

/**
 * Fetches projects by country ISO code
 */
export async function fetchProjectsByCountryCode(countryCode: string): Promise<ProjectWithDetails[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      country:countries(id, code_iso, name_fr, name_en, region),
      project_images(image_url),
      project_tags(tag)
    `)
    .eq('country.code_iso', countryCode)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map(project => ({
    ...project,
    images: project.project_images?.map((pi: { image_url: string }) => pi.image_url) || [],
    tags: project.project_tags?.map((pt: { tag: string }) => pt.tag) || []
  }));
}

/**
 * Fetches projects by country ID
 */
export async function fetchProjectsByCountryId(countryId: string): Promise<ProjectWithDetails[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      country:countries(id, code_iso, name_fr, name_en, region),
      project_images(image_url),
      project_tags(tag)
    `)
    .eq('country_id', countryId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map(project => ({
    ...project,
    images: project.project_images?.map((pi: { image_url: string }) => pi.image_url) || [],
    tags: project.project_tags?.map((pt: { tag: string }) => pt.tag) || []
  }));
}

/**
 * Fetches projects by thematic
 */
export async function fetchProjectsByThematic(thematic: string): Promise<ProjectWithDetails[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      country:countries(id, code_iso, name_fr, name_en, region),
      project_images(image_url),
      project_tags(tag)
    `)
    .eq('thematic', thematic)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map(project => ({
    ...project,
    images: project.project_images?.map((pi: { image_url: string }) => pi.image_url) || [],
    tags: project.project_tags?.map((pt: { tag: string }) => pt.tag) || []
  }));
}

/**
 * Fetches projects by status
 */
export async function fetchProjectsByStatus(status: ProjectStatus): Promise<ProjectWithDetails[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      country:countries(id, code_iso, name_fr, name_en, region),
      project_images(image_url),
      project_tags(tag)
    `)
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map(project => ({
    ...project,
    images: project.project_images?.map((pi: { image_url: string }) => pi.image_url) || [],
    tags: project.project_tags?.map((pt: { tag: string }) => pt.tag) || []
  }));
}

/**
 * Fetches a single project by ID
 */
export async function fetchProjectById(id: string): Promise<ProjectWithDetails | null> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      country:countries(id, code_iso, name_fr, name_en, region),
      project_images(image_url),
      project_tags(tag)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  return {
    ...data,
    images: data.project_images?.map((pi: { image_url: string }) => pi.image_url) || [],
    tags: data.project_tags?.map((pt: { tag: string }) => pt.tag) || []
  };
}

/**
 * Fetches project statistics
 */
export async function fetchProjectStats(): Promise<ProjectStats> {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('status, thematic, beneficiaries');

  if (error) throw error;

  const byStatus: Record<string, number> = {};
  const byThematic: Record<string, number> = {};
  let totalBeneficiaries = 0;

  (projects || []).forEach(project => {
    byStatus[project.status] = (byStatus[project.status] || 0) + 1;
    if (project.thematic) {
      byThematic[project.thematic] = (byThematic[project.thematic] || 0) + 1;
    }
    // Extract beneficiaries count if it's stored as a number string
    if (project.beneficiaries) {
      const count = parseInt(project.beneficiaries.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(count)) {
        totalBeneficiaries += count;
      }
    }
  });

  const total = projects?.length || 0;

  return {
    total,
    byStatus,
    byThematic,
    totalBeneficiaries,
    activeProjects: byStatus['in_progress'] || 0,
    completedProjects: byStatus['completed'] || 0,
  };
}

/**
 * Fetches projects for map display (with coordinates)
 */
export async function fetchProjectsForMap(): Promise<ProjectWithDetails[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      country:countries(id, code_iso, name_fr, name_en, region),
      project_images(image_url),
      project_tags(tag)
    `)
    .not('latitude', 'is', null)
    .not('longitude', 'is', null);

  if (error) throw error;

  return (data || []).map(project => ({
    ...project,
    images: project.project_images?.map((pi: { image_url: string }) => pi.image_url) || [],
    tags: project.project_tags?.map((pt: { tag: string }) => pt.tag) || []
  }));
}
