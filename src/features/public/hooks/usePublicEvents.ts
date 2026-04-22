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

// Re-export types from service
export type { EventWithTags as PublicEvent, EventType, EventStatus };

/**
 * Hook to fetch all upcoming public events
 */
export function usePublicEvents() {
  return useQuery({
    queryKey: ['public-events'],
    queryFn: fetchUpcomingEvents,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch a single event by ID
 */
export function useEvent(id: string) {
  return useQuery({
    queryKey: ['public-event', id],
    queryFn: () => fetchEventById(id),
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
    queryFn: fetchPastEvents,
    staleTime: 15 * 60 * 1000,
  });
}

/**
 * Hook to fetch events by type
 */
export function useEventsByType(eventType: EventType) {
  return useQuery({
    queryKey: ['public-events', 'type', eventType],
    queryFn: () => fetchEventsByType(eventType),
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
    queryFn: () => fetchEventsByCountry(countryId),
    enabled: !!countryId,
    staleTime: 10 * 60 * 1000,
  });
}

