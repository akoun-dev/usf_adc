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
