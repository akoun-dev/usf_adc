import { supabase } from '@/integrations/supabase/client';

// Types based on Supabase migrations
export interface Country {
  id: string;
  code_iso: string;
  name_fr: string;
  name_en: string;
  region: string;
  capital: string | null;
  fsu_budget: number | null;
  population: number | null;
  fsu_coordinator_name: string | null;
  fsu_coordinator_email: string | null;
  fsu_coordinator_phone: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CountryWithProjects extends Country {
  project_count?: number;
}

/**
 * Fetches all countries
 */
export async function fetchAllCountries(): Promise<Country[]> {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .order('name_fr');

  if (error) throw error;
  return (data || []) as Country[];
}

/**
 * Fetches countries by region
 */
export async function fetchCountriesByRegion(region: string): Promise<Country[]> {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('region', region)
    .order('name_fr');

  if (error) throw error;
  return (data || []) as Country[];
}

/**
 * Fetches a single country by ISO code
 */
export async function fetchCountryByISO(codeISO: string): Promise<Country | null> {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('code_iso', codeISO)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  return data as Country;
}

/**
 * Fetches a single country by ID
 */
export async function fetchCountryById(id: string): Promise<Country | null> {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  return data as Country;
}

/**
 * Fetches all regions
 */
export async function fetchAllRegions(): Promise<string[]> {
  const { data, error } = await supabase
    .from('countries')
    .select('region')
    .order('region');

  if (error) throw error;

  // Get unique regions
  const regions = [...new Set((data || []).map(c => c.region))];
  return regions;
}

/**
 * Fetches countries with project count
 */
export async function fetchCountriesWithProjectCount(): Promise<CountryWithProjects[]> {
  const { data, error } = await supabase
    .from('countries')
    .select(`
      *,
      projects(count)
    `)
    .order('name_fr');

  if (error) throw error;

  return ((data || []) as unknown as CountryWithProjects[]).map(country => ({
    ...country,
    project_count: (country as unknown as { projects?: { count: number }[] }).projects?.[0]?.count || 0,
  }));
}

/**
 * Searches countries by name (French or English)
 */
export async function searchCountries(query: string): Promise<Country[]> {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .or(`name_fr.ilike.%${query}%,name_en.ilike.%${query}%`)
    .order('name_fr');

  if (error) throw error;
  return (data || []) as Country[];
}

// Region constants for consistency
export const REGIONS = {
  CEDEAO: 'CEDEAO',
  EAC: 'EAC',
  SADC: 'SADC',
  UMA: 'UMA',
  CEEAC: 'CEEAC',
  NORTH_AFRICA: 'North Africa',
} as const;
