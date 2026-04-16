import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mockEvents, mockPastEvents } from '../data/mockEvents';

export interface PublicEvent {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  location: string | null;
  event_type: 'webinar' | 'conference' | 'workshop' | 'meeting';
  registration_url: string | null;
  max_participants: number | null;
  is_public: boolean;
  created_at: string;
  image_url?: string;
  organizer?: string;
  status?: string;
  price?: string;
  tags?: string[];
}

export function usePublicEvents() {
  return useQuery({
    queryKey: ['public-events'],
    queryFn: async () => {
      // Always return mock data for now
      // TODO: Remove this when database is properly populated
      return mockEvents;

      /* const { data, error } = await supabase
        .from('events' as any)
        .select('*')
        .eq('is_public', true)
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true });

      if (error) {
        if (error.code === '42P01') {
          return mockEvents;
        }
        throw error;
      }

      // If table exists but is empty, return mock data
      if (!data || data.length === 0) {
        return mockEvents;
      }

      return data as PublicEvent[];
      */
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['public-event', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events' as any)
        .select('*')
        .eq('id', id)
        .eq('is_public', true)
        .single();

      if (error) {
        if (error.code === '42P01') {
          return mockEvents.find(e => e.id === id);
        }
        throw error;
      }

      return data as unknown as PublicEvent;
    },
    enabled: !!id,
    staleTime: 15 * 60 * 1000,
  });
}

export function usePastEvents() {
  return useQuery({
    queryKey: ['public-events-past'],
    queryFn: async () => {
      // Always return mock data for now
      // TODO: Remove this when database is properly populated
      return mockPastEvents;

      /* const { data, error } = await supabase
        .from('events' as any)
        .select('*')
        .eq('is_public', true)
        .lt('start_date', new Date().toISOString())
        .order('start_date', { ascending: false })
        .limit(10);

      if (error) {
        if (error.code === '42P01') {
          return mockPastEvents;
        }
        throw error;
      }

      // If table exists but is empty, return mock data
      if (!data || data.length === 0) {
        return mockPastEvents;
      }

      return data as PublicEvent[];
      */
    },
    staleTime: 15 * 60 * 1000,
  });
}

