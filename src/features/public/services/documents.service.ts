import { supabase } from '@/integrations/supabase/client';

// Types based on Supabase migrations
export interface PublicDocument {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  is_public: boolean;
  type: string | null;
  language: string;
  published_at: string | null;
  download_url: string | null;
  thumbnail: string | null;
  featured: boolean;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
  tags?: string[];
}

export interface DocumentWithTags extends PublicDocument {
  tags: string[];
}

export interface DocumentStats {
  total: number;
  byCategory: Record<string, number>;
  byType: Record<string, number>;
  byLanguage: Record<string, number>;
  featured: number;
}

// Document categories with icons and translation keys
export const DOCUMENT_CATEGORIES = {
  all: { icon: '📋', label: 'public.documents.categories.all' },
  guides: { icon: '📖', label: 'public.documents.categories.guides' },
  reports: { icon: '📊', label: 'public.documents.categories.reports' },
  templates: { icon: '📝', label: 'public.documents.categories.templates' },
  presentations: { icon: '📽️', label: 'public.documents.categories.presentations' },
  regulations: { icon: '⚖️', label: 'public.documents.categories.regulations' },
  studies: { icon: '🔬', label: 'public.documents.categories.studies' },
  general: { icon: '📁', label: 'public.documents.categories.general' },
} as const;

// Document types with icons and labels
export const DOCUMENT_TYPES = {
  pdf: { icon: '📄', label: 'PDF' },
  doc: { icon: '📝', label: 'Word' },
  xls: { icon: '📊', label: 'Excel' },
  ppt: { icon: '📽️', label: 'PowerPoint' },
  video: { icon: '🎥', label: 'Vidéo' },
  guide: { icon: '📖', label: 'Guide' },
} as const;

/**
 * Fetches all public documents
 */
export async function fetchPublicDocuments(): Promise<DocumentWithTags[]> {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      document_tags(tag)
    `)
    .eq('is_public', true)
    .order('published_at', { ascending: false, nullsFirst: false });

  if (error) throw error;

  return (data || []).map(mapDocumentRow);
}

/**
 * Fetches documents by category
 */
export async function fetchDocumentsByCategory(category: string): Promise<DocumentWithTags[]> {
  if (category === 'all') {
    return fetchPublicDocuments();
  }

  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      document_tags(tag)
    `)
    .eq('is_public', true)
    .eq('category', category)
    .order('published_at', { ascending: false, nullsFirst: false });

  if (error) throw error;

  return (data || []).map(mapDocumentRow);
}

/**
 * Fetches documents by language
 */
export async function fetchDocumentsByLanguage(language: string): Promise<DocumentWithTags[]> {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      document_tags(tag)
    `)
    .eq('is_public', true)
    .eq('language', language)
    .order('published_at', { ascending: false, nullsFirst: false });

  if (error) throw error;

  return (data || []).map(mapDocumentRow);
}

/**
 * Fetches documents by type
 */
export async function fetchDocumentsByType(type: string): Promise<DocumentWithTags[]> {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      document_tags(tag)
    `)
    .eq('is_public', true)
    .eq('type', type)
    .order('published_at', { ascending: false, nullsFirst: false });

  if (error) throw error;

  return (data || []).map(mapDocumentRow);
}

/**
 * Fetches featured documents
 */
export async function fetchFeaturedDocuments(): Promise<DocumentWithTags[]> {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      document_tags(tag)
    `)
    .eq('is_public', true)
    .eq('featured', true)
    .order('published_at', { ascending: false, nullsFirst: false });

  if (error) throw error;

  return (data || []).map(mapDocumentRow);
}

/**
 * Fetches a single document by ID
 */
export async function fetchDocumentById(id: string): Promise<DocumentWithTags | null> {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      document_tags(tag)
    `)
    .eq('id', id)
    .eq('is_public', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  return mapDocumentRow(data);
}

/**
 * Fetches document statistics
 */
export async function fetchDocumentStats(): Promise<DocumentStats> {
  const { data: documents, error } = await supabase
    .from('documents')
    .select('category, type, language, featured')
    .eq('is_public', true);

  if (error) throw error;

  const byCategory: Record<string, number> = {};
  const byType: Record<string, number> = {};
  const byLanguage: Record<string, number> = {};
  let featured = 0;

  (documents || []).forEach(doc => {
    byCategory[doc.category] = (byCategory[doc.category] || 0) + 1;
    if (doc.type) {
      byType[doc.type] = (byType[doc.type] || 0) + 1;
    }
    byLanguage[doc.language] = (byLanguage[doc.language] || 0) + 1;
    if (doc.featured) featured++;
  });

  return {
    total: documents?.length || 0,
    byCategory,
    byType,
    byLanguage,
    featured,
  };
}

/**
 * Searches documents by title or description
 */
export async function searchDocuments(query: string): Promise<DocumentWithTags[]> {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      document_tags(tag)
    `)
    .eq('is_public', true)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('published_at', { ascending: false, nullsFirst: false });

  if (error) throw error;

  return (data || []).map(mapDocumentRow);
}

/**
 * Maps a database row to a DocumentWithTags object with computed download_url
 */
function mapDocumentRow(doc: Record<string, unknown>): DocumentWithTags {
  const { document_tags, ...rest } = doc;
  const filePath = rest.file_path as string;
  const { data } = supabase.storage.from('documents').getPublicUrl(filePath);
  return {
    ...(rest as Omit<PublicDocument, 'download_url' | 'tags'>),
    download_url: data.publicUrl,
    tags: (document_tags as Array<{ tag: string }>)?.map((dt) => dt.tag) || [],
  } as DocumentWithTags;
}

/**
 * Gets the public URL for a document file
 */
export function getDocumentUrl(filePath: string): string {
  const { data } = supabase.storage.from('documents').getPublicUrl(filePath);
  return data.publicUrl;
}
