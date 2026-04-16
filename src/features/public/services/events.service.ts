import { supabase } from '@/integrations/supabase/client';

// Types based on Supabase migrations
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type EventType = 'conference' | 'webinar' | 'workshop' | 'training' | 'meeting' | 'other';

export interface PublicEvent {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  location: string | null;
  event_type: EventType;
  status: EventStatus;
  max_participants: number | null;
  registration_url: string | null;
  price: string | null;
  image_url: string | null;
  organizer: string | null;
  is_public: boolean;
  country_id: string | null;
  created_at: string;
  updated_at: string;
  tags?: string[];
}

export interface EventWithTags extends PublicEvent {
  tags: string[];
}

/**
 * Fetches all upcoming public events
 */
export async function fetchUpcomingEvents(): Promise<EventWithTags[]> {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      event_tags(tag)
    `)
    .eq('is_public', true)
    .gte('start_date', new Date().toISOString())
    .order('start_date', { ascending: true });

  if (error) throw error;

  return (data || []).map(event => ({
    ...event,
    tags: event.event_tags?.map((et: { tag: string }) => et.tag) || []
  }));
}

/**
 * Fetches past public events
 */
export async function fetchPastEvents(limit = 10): Promise<EventWithTags[]> {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      event_tags(tag)
    `)
    .eq('is_public', true)
    .lt('start_date', new Date().toISOString())
    .order('start_date', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data || []).map(event => ({
    ...event,
    tags: event.event_tags?.map((et: { tag: string }) => et.tag) || []
  }));
}

/**
 * Fetches a single event by ID
 */
export async function fetchEventById(id: string): Promise<EventWithTags | null> {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      event_tags(tag)
    `)
    .eq('id', id)
    .eq('is_public', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  return {
    ...data,
    tags: data.event_tags?.map((et: { tag: string }) => et.tag) || []
  };
}

/**
 * Fetches events by type
 */
export async function fetchEventsByType(eventType: EventType): Promise<EventWithTags[]> {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      event_tags(tag)
    `)
    .eq('is_public', true)
    .eq('event_type', eventType)
    .gte('start_date', new Date().toISOString())
    .order('start_date', { ascending: true });

  if (error) throw error;

  return (data || []).map(event => ({
    ...event,
    tags: event.event_tags?.map((et: { tag: string }) => et.tag) || []
  }));
}

/**
 * Fetches events by country
 */
export async function fetchEventsByCountry(countryId: string): Promise<EventWithTags[]> {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      event_tags(tag)
    `)
    .eq('is_public', true)
    .eq('country_id', countryId)
    .gte('start_date', new Date().toISOString())
    .order('start_date', { ascending: true });

  if (error) throw error;

  return (data || []).map(event => ({
    ...event,
    tags: event.event_tags?.map((et: { tag: string }) => et.tag) || []
  }));
}
