import { supabase } from '@/integrations/supabase/client';
import type { PlatformSetting, SubmissionPeriod, Country, AuditLogEntry } from '../types';
import type { Json } from '@/integrations/supabase/types';

// File upload function for logos
async function uploadLogoFile(file: File, entityType: 'members' | 'partners', entityId: string): Promise<string> {
    try {
        // Validate file type and size
        if (!file.type.startsWith('image/')) {
            throw new Error('Only image files are allowed');
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            throw new Error('File size exceeds 5MB limit');
        }
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${entityType}/${entityId}/logo.${fileExt}`;
        
        const { data, error } = await supabase
            .storage
            .from('logos')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: true
            });
            
        if (error) throw error;
        
        // Get public URL
        const { data: { publicUrl } } = supabase
            .storage
            .from('logos')
            .getPublicUrl(fileName);
            
        return publicUrl;
    } catch (error) {
        console.error('Error uploading logo:', error);
        throw error;
    }
}

// Platform Settings
export async function getSettings(): Promise<PlatformSetting[]> {
  const { data, error } = await supabase
    .from('platform_settings')
    .select('*')
    .order('category', { ascending: true });
  if (error) throw error;
  return (data ?? []) as PlatformSetting[];
}

export async function updateSetting(id: string, value: Json) {
  const { data, error } = await supabase
    .from('platform_settings')
    .update({ value })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Submission Periods
export async function getSubmissionPeriods(): Promise<SubmissionPeriod[]> {
  const { data, error } = await supabase
    .from('submission_periods')
    .select('*')
    .order('start_date', { ascending: false });
  if (error) throw error;
  return (data ?? []) as SubmissionPeriod[];
}

export async function createSubmissionPeriod(input: Omit<SubmissionPeriod, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('submission_periods')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSubmissionPeriod(id: string, input: Partial<SubmissionPeriod>) {
  const { data, error } = await supabase
    .from('submission_periods')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSubmissionPeriod(id: string) {
  const { error } = await supabase.from('submission_periods').delete().eq('id', id);
  if (error) throw error;
}

// Countries
export async function getCountries(): Promise<Country[]> {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .order('name_fr', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Country[];
}

export async function createCountry(input: { name_fr: string; name_en: string; code_iso: string; region: string }) {
  const { data, error } = await supabase
    .from('countries')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCountry(id: string, input: Partial<Country>) {
  const { data, error } = await supabase
    .from('countries')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCountry(id: string) {
  const { error } = await supabase.from('countries').delete().eq('id', id);
  if (error) throw error;
}

// Audit Logs
export async function getAuditLogs(limit = 100): Promise<AuditLogEntry[]> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as AuditLogEntry[];
}

// News / Actualités
export async function getNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createNews(input: { title: string; content: string; category?: string; image_url?: string }) {
  const { data, error } = await supabase.from('news').insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateNews(id: string, input: Partial<{ title: string; content: string; category: string; image_url: string; is_public: boolean }>) {
  const { data, error } = await supabase.from('news').update(input).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteNews(id: string) {
  const { error } = await supabase.from('news').delete().eq('id', id);
  if (error) throw error;
}

// Projects
export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*, countries(name_fr)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createProject(input: { title: string; description?: string; country_id: string; status?: string; region?: string }) {
  const { data, error } = await supabase.from('projects').insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateProject(id: string, input: Partial<{ title: string; description: string; country_id: string; status: string; region: string }>) {
  const { data, error } = await supabase.from('projects').update(input).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadDocumentFile(file: File): Promise<{
  filePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
}> {
  try {
    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only PDF, DOCX, XLSX, PPTX files are allowed.');
    }
    
    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      throw new Error('File size exceeds 50MB limit');
    }
    
    // Generate unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `documents/${fileName}`;
    
    // Upload file to Supabase storage
    const { data, error } = await supabase
      .storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('documents')
      .getPublicUrl(filePath);
    
    return {
      filePath,
      fileName,
      fileSize: file.size,
      mimeType: file.type,
      url: publicUrl
    };
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
}

// Documents
export async function getDocuments() {
  const { data, error } = await supabase
    .from('documents')
    .select('*, document_tags(tag)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  
  return (data ?? []).map(doc => ({
    ...doc,
    tags: doc.document_tags?.map((dt: { tag: string }) => dt.tag) || []
  }));
}

export async function createDocument(input: { 
  title: string; 
  description?: string; 
  category: string; 
  file_name: string; 
  file_path: string;
  file_size: number;
  mime_type: string;
  type?: string;
  language?: string;
  is_public?: boolean;
  tags?: string[]
}) {
  const { data: document, error: docError } = await supabase
    .from('documents')
    .insert({
      title: input.title,
      description: input.description,
      category: input.category,
      file_name: input.file_name,
      file_path: input.file_path,
      file_size: input.file_size,
      mime_type: input.mime_type,
      type: input.type,
      language: input.language || 'fr',
      is_public: input.is_public || false
    })
    .select()
    .single();
    
  if (docError) throw docError;
  
  // Add tags if provided
  if (input.tags && input.tags.length > 0) {
    const tagInserts = input.tags.map(tag => ({
      document_id: document.id,
      tag: tag.trim()
    }));
    
    const { error: tagError } = await supabase
      .from('document_tags')
      .insert(tagInserts);
      
    if (tagError) {
      console.error('Error adding tags:', tagError);
      // Don't fail the whole operation if tags fail
    }
  }
  
  return document;
}

export async function updateDocument(id: string, input: Partial<{ 
  title: string; 
  description: string; 
  category: string; 
  is_public: boolean;
  tags?: string[]
}>) {
  const { data: document, error: docError } = await supabase
    .from('documents')
    .update({
      title: input.title,
      description: input.description,
      category: input.category,
      is_public: input.is_public
    })
    .eq('id', id)
    .select()
    .single();
    
  if (docError) throw docError;
  
  // Update tags if provided
  if (input.tags !== undefined) {
    // Delete existing tags
    const { error: deleteError } = await supabase
      .from('document_tags')
      .delete()
      .eq('document_id', id);
      
    if (deleteError) {
      console.error('Error deleting tags:', deleteError);
    }
    
    // Add new tags
    if (input.tags && input.tags.length > 0) {
      const tagInserts = input.tags.map(tag => ({
        document_id: id,
        tag: tag.trim()
      }));
      
      const { error: tagError } = await supabase
        .from('document_tags')
        .insert(tagInserts);
        
      if (tagError) {
        console.error('Error adding tags:', tagError);
      }
    }
  }
  
  return document;
}

export async function deleteDocument(id: string) {
  // First delete from storage
  const { data: document } = await supabase
    .from('documents')
    .select('file_path')
    .eq('id', id)
    .single();
  
  if (document?.file_path) {
    const { error: storageError } = await supabase
      .storage
      .from('documents')
      .remove([document.file_path]);
      
    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
    }
  }
  
  // Then delete from database (tags will cascade)
  const { error } = await supabase.from('documents').delete().eq('id', id);
  if (error) throw error;
}

interface SearchDocumentsParams {
  searchTerm?: string;
  categories?: string[];
  tags?: string[];
}

export async function searchDocuments({ searchTerm = '', categories = [], tags = [] }: SearchDocumentsParams) {
  let query = supabase
    .from('documents')
    .select('*, document_tags(tag)');
  
  // Apply search term filter
  if (searchTerm) {
    query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
  }
  
  // Apply category filter
  if (categories.length > 0) {
    query = query.in('category', categories);
  }
  
  // Apply tags filter (requires subquery)
  if (tags.length > 0) {
    query = query.in('id', {
      text: `SELECT document_id FROM document_tags WHERE tag IN (${tags.map(t => `'${t}'`).join(',')})`
    });
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  
  return (data ?? []).map(doc => ({
    ...doc,
    tags: doc.document_tags?.map((dt: { tag: string }) => dt.tag) || []
  }));
}

export async function getDocumentTags() {
  const { data, error } = await supabase
    .from('document_tags')
    .select('tag')
    .order('tag');
  
  if (error) throw error;
  
  // Extract unique tags manually
  const uniqueTags = Array.from(new Set(data.map((dt: { tag: string }) => dt.tag)));
  return uniqueTags;
}

// Events
export async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createEvent(input: { title: string; description?: string; start_date: string; end_date?: string; location?: string; event_type?: string; status?: string }) {
  const { data, error } = await supabase.from('events').insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateEvent(id: string, input: Partial<{ title: string; description: string; start_date: string; end_date: string; location: string; event_type: string; status: string }>) {
  const { data, error } = await supabase.from('events').update(input).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteEvent(id: string) {
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw error;
}

// Forum Categories
export async function getForumCategories() {
  const { data, error } = await supabase
    .from('forum_categories')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createForumCategory(input: { name: string; description?: string; color?: string }) {
  const { data, error } = await supabase.from('forum_categories').insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateForumCategory(id: string, input: Partial<{ name: string; description: string; color: string }>) {
  const { data, error } = await supabase.from('forum_categories').update(input).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteForumCategory(id: string) {
  const { error } = await supabase.from('forum_categories').delete().eq('id', id);
  if (error) throw error;
}

// Forum Topics Management
export async function getForumTopics() {
  const { data, error } = await supabase
    .from('forum_topics')
    .select('*, forum_categories (*)')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Fetch authors separately
  const authorIds = data?.map(topic => topic.author_id).filter((id): id is string => !!id) ?? [];
  const { data: authors } = await supabase
    .from('profiles')
    .select('*')
    .in('id', authorIds);
  
  return data?.map(topic => ({
    ...topic,
    category: topic.forum_categories,
    author: authors?.find(a => a.id === topic.author_id) || {
      id: topic.author_id,
      name: 'Utilisateur supprimé',
      avatar_url: null
    }
  })) ?? [];
}

export async function updateForumTopic(id: string, input: Partial<{ status: string; title: string }>) {
  const { data, error } = await supabase
    .from('forum_topics')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteForumTopic(id: string) {
  const { error } = await supabase.from('forum_topics').delete().eq('id', id);
  if (error) throw error;
}

// Associated Members Management
export async function getAssociatedMembers() {
  const { data, error } = await supabase
    .from('membres_associes')
    .select('*, countries (id, name_fr, name_en, flag_url)')
    .order('nom', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createAssociatedMember(input: Omit<AssociatedMember, 'id' | 'date_creation' | 'date_mise_a_jour'> & { logo_file?: File }) {
  // Separate the logo_file from the database input
  const { logo_file, ...dbInput } = input;
  
  if (logo_file) {
    // First create the member to get the ID
    const { data: newMember, error: createError } = await supabase
      .from('membres_associes')
      .insert({ ...dbInput, logo_url: null })
      .select()
      .single();
      
    if (createError) throw createError;
    
    // Upload the logo file
    const logoUrl = await uploadLogoFile(logo_file, 'members', newMember.id);
    
    // Update the member with the logo URL
    const { data, error: updateError } = await supabase
      .from('membres_associes')
      .update({ logo_url: logoUrl })
      .eq('id', newMember.id)
      .select()
      .single();
      
    if (updateError) throw updateError;
    return data;
  } else {
    // Regular creation without file upload
    const { data, error } = await supabase
      .from('membres_associes')
      .insert(dbInput)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

export async function updateAssociatedMember(id: string, input: Partial<AssociatedMember> & { logo_file?: File }) {
  // Separate the logo_file from the database input
  const { logo_file, ...dbInput } = input;
  
  let logoUrl = dbInput.logo_url;
  
  if (logo_file) {
    // Upload the logo file
    logoUrl = await uploadLogoFile(logo_file, 'members', id);
  }
  
  // Update the member
  const { data, error } = await supabase
    .from('membres_associes')
    .update({ ...dbInput, logo_url: logoUrl })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteAssociatedMember(id: string) {
  const { error } = await supabase.from('membres_associes').delete().eq('id', id);
  if (error) throw error;
}

// Partners Management
export async function getPartners() {
  const { data, error } = await supabase
    .from('partenaires')
    .select('*, countries (id, name_fr, name_en, flag_url)')
    .order('nom', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createPartner(input: Omit<Partner, 'id' | 'date_creation' | 'date_mise_a_jour'> & { logo_file?: File }) {
  // Separate the logo_file from the database input
  const { logo_file, ...dbInput } = input;
  
  if (logo_file) {
    // First create the partner to get the ID
    const { data: newPartner, error: createError } = await supabase
      .from('partenaires')
      .insert({ ...dbInput, logo_url: null })
      .select()
      .single();
      
    if (createError) throw createError;
    
    // Upload the logo file
    const logoUrl = await uploadLogoFile(logo_file, 'partners', newPartner.id);
    
    // Update the partner with the logo URL
    const { data, error: updateError } = await supabase
      .from('partenaires')
      .update({ logo_url: logoUrl })
      .eq('id', newPartner.id)
      .select()
      .single();
      
    if (updateError) throw updateError;
    return data;
  } else {
    // Regular creation without file upload
    const { data, error } = await supabase
      .from('partenaires')
      .insert(dbInput)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

export async function updatePartner(id: string, input: Partial<Partner> & { logo_file?: File }) {
  // Separate the logo_file from the database input
  const { logo_file, ...dbInput } = input;
  
  let logoUrl = dbInput.logo_url;
  
  if (logo_file) {
    // Upload the logo file
    logoUrl = await uploadLogoFile(logo_file, 'partners', id);
  }
  
  // Update the partner
  const { data, error } = await supabase
    .from('partenaires')
    .update({ ...dbInput, logo_url: logoUrl })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePartner(id: string) {
  const { error } = await supabase.from('partenaires').delete().eq('id', id);
  if (error) throw error;
}

// Type definitions
export interface AssociatedMember {
  id: string;
  nom: string;
  nom_complet?: string;
  pays_id?: string;
  logo_url?: string;
  type: 'agence' | 'operateur' | 'institution' | 'association';
  secteur?: string;
  depuis?: string;
  site_web?: string;
  description?: string;
  projets?: string[];
  email_contact?: string;
  telephone_contact?: string;
  adresse?: string;
  est_actif?: boolean;
  date_creation?: string;
  date_mise_a_jour?: string;
  countries?: {
    id: string;
    name_fr: string;
    name_en: string;
    flag_url?: string;
  };
}

export interface Partner {
  id: string;
  nom: string;
  nom_complet?: string;
  pays_id?: string;
  logo_url?: string;
  type: 'institutionnel' | 'prive' | 'ong' | 'international';
  domaine?: string;
  depuis?: string;
  site_web?: string;
  description?: string;
  projets?: string[];
  email_contact?: string;
  telephone_contact?: string;
  adresse?: string;
  est_actif?: boolean;
  date_creation?: string;
  date_mise_a_jour?: string;
  countries?: {
    id: string;
    name_fr: string;
    name_en: string;
    flag_url?: string;
  };
}
