import { useQuery } from '@tanstack/react-query';
import {
  fetchUpcomingEvents,
  fetchPastEvents,
  fetchEventById,
  fetchEventsByType,
  fetchEventsByCountry,
  type EventWithTags,
  type EventType,
} from '../services';
import { mockEvents, mockPastEvents } from '../data/mockEvents';

// Re-export types from service
export type { EventWithTags as PublicEvent, EventType, EventStatus };

/**
 * Hook to fetch all upcoming public events
 */
export function usePublicEvents() {
  return useQuery({
    queryKey: ['public-events'],
    queryFn: async () => {
      try {
        return await fetchUpcomingEvents();
      } catch (error) {
        // Fallback to mock data if database is not available
        console.warn('Failed to fetch events from database, using mock data:', error);
        return mockEvents as unknown as EventWithTags[];
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch a single event by ID
 */
export function useEvent(id: string) {
  return useQuery({
    queryKey: ['public-event', id],
    queryFn: async () => {
      try {
        const event = await fetchEventById(id);
        if (event) return event;
        // Fallback to mock data if not found in database
        return mockEvents.find(e => e.id === id) as unknown as EventWithTags | undefined;
      } catch (error) {
        console.warn('Failed to fetch event from database, using mock data:', error);
        return mockEvents.find(e => e.id === id) as unknown as EventWithTags | undefined;
      }
    },
    enabled: !!id,
    staleTime: 15 * 60 * 1000,
  });
}

/**
 * Hook to fetch past events
 */
export function usePastEvents() {
  return useQuery({
    queryKey: ['public-events-past'],
    queryFn: async () => {
      try {
        return await fetchPastEvents();
      } catch (error) {
        // Fallback to mock data if database is not available
        console.warn('Failed to fetch past events from database, using mock data:', error);
        return mockPastEvents as unknown as EventWithTags[];
      }
    },
    staleTime: 15 * 60 * 1000,
  });
}

/**
 * Hook to fetch events by type
 */
export function useEventsByType(eventType: EventType) {
  return useQuery({
    queryKey: ['public-events', 'type', eventType],
    queryFn: async () => {
      try {
        return await fetchEventsByType(eventType);
      } catch (error) {
        console.warn('Failed to fetch events by type from database:', error);
        return mockEvents.filter(e => e.event_type === eventType) as unknown as EventWithTags[];
      }
    },
    enabled: !!eventType,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch events by country
 */
export function useEventsByCountry(countryId: string) {
  return useQuery({
    queryKey: ['public-events', 'country', countryId],
    queryFn: async () => {
      try {
        return await fetchEventsByCountry(countryId);
      } catch (error) {
        console.warn('Failed to fetch events by country from database:', error);
        return [] as EventWithTags[];
      }
    },
    enabled: !!countryId,
    staleTime: 10 * 60 * 1000,
  });
}

