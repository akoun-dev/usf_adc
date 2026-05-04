import { supabase } from '@/integrations/supabase/client';

export interface ProjectComment {
  id: string;
  project_id: string;
  author_id: string;
  content: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export async function fetchProjectComments(projectId: string): Promise<ProjectComment[]> {
  const { data, error } = await supabase
    .from('project_comments')
    .select(`
      *,
      profiles:author_id(full_name, avatar_url)
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ProjectComment[];
}

export async function addProjectComment(projectId: string, content: string): Promise<ProjectComment> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('project_comments')
    .insert({
      project_id: projectId,
      author_id: user.id,
      content
    })
    .select(`
      *,
      profiles:author_id(full_name, avatar_url)
    `)
    .single();

  if (error) throw error;
  return data as ProjectComment;
}
