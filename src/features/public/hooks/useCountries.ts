import { useQuery } from '@tanstack/react-query';
import {
  fetchAllCountries,
  fetchCountriesByRegion,
  fetchCountryByISO,
  fetchCountryById,
  fetchAllRegions,
  fetchCountriesWithProjectCount,
  searchCountries,
  type Country,
  type CountryWithProjects,
  REGIONS,
} from '../services';

// Re-export types from service
export type { Country, CountryWithProjects };
export { REGIONS };

/**
 * Hook to fetch all countries
 */
export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: fetchAllCountries,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Hook to fetch countries by region
 */
export function useCountriesByRegion(region: string) {
  return useQuery({
    queryKey: ['countries', 'region', region],
    queryFn: () => fetchCountriesByRegion(region),
    enabled: !!region,
    staleTime: 15 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single country by ISO code
 */
export function useCountryByISO(codeISO: string) {
  return useQuery({
    queryKey: ['country', 'iso', codeISO],
    queryFn: () => fetchCountryByISO(codeISO),
    enabled: !!codeISO,
    staleTime: 15 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single country by ID
 */
export function useCountryById(id: string) {
  return useQuery({
    queryKey: ['country', id],
    queryFn: () => fetchCountryById(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000,
  });
}

/**
 * Hook to fetch all regions
 */
export function useRegions() {
  return useQuery({
    queryKey: ['regions'],
    queryFn: fetchAllRegions,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to fetch countries with project count
 */
export function useCountriesWithProjectCount() {
  return useQuery({
    queryKey: ['countries', 'with-project-count'],
    queryFn: fetchCountriesWithProjectCount,
    staleTime: 15 * 60 * 1000,
  });
}

/**
 * Hook to search countries
 */
export function useCountrySearch(query: string) {
  return useQuery({
    queryKey: ['countries', 'search', query],
    queryFn: () => query.trim() ? searchCountries(query) : Promise.resolve([] as Country[]),
    enabled: query.length >= 2,
    staleTime: 10 * 60 * 1000,
  });
}
