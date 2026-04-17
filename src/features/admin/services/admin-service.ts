import { supabase } from '@/integrations/supabase/client';
import type { PlatformSetting, SubmissionPeriod, Country, AuditLogEntry } from '../types';
import type { Json } from '@/integrations/supabase/types';

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

// Documents
export async function getDocuments() {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createDocument(input: { title: string; description?: string; category: string; file_name: string; file_path: string }) {
  const { data, error } = await supabase.from('documents').insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateDocument(id: string, input: Partial<{ title: string; description: string; category: string; is_public: boolean }>) {
  const { data, error } = await supabase.from('documents').update(input).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteDocument(id: string) {
  const { error } = await supabase.from('documents').delete().eq('id', id);
  if (error) throw error;
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
