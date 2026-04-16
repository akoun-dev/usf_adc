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
import { mockCountries } from '../data/mockCountries';

// Re-export types from service
export type { Country, CountryWithProjects };
export { REGIONS };

/**
 * Hook to fetch all countries
 */
export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      try {
        return await fetchAllCountries();
      } catch (error) {
        console.warn('Failed to fetch countries from database, using mock data:', error);
        return mockCountries as unknown as Country[];
      }
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Hook to fetch countries by region
 */
export function useCountriesByRegion(region: string) {
  return useQuery({
    queryKey: ['countries', 'region', region],
    queryFn: async () => {
      try {
        return await fetchCountriesByRegion(region);
      } catch (error) {
        console.warn('Failed to fetch countries by region from database, using mock data:', error);
        return mockCountries.filter(c => c.region === region) as unknown as Country[];
      }
    },
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
    queryFn: async () => {
      try {
        const country = await fetchCountryByISO(codeISO);
        if (country) return country;
        // Fallback to mock data
        return mockCountries.find(c => c.code_iso === codeISO) as unknown as Country | undefined;
      } catch (error) {
        console.warn('Failed to fetch country by ISO from database, using mock data:', error);
        return mockCountries.find(c => c.code_iso === codeISO) as unknown as Country | undefined;
      }
    },
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
    queryFn: async () => {
      try {
        const country = await fetchCountryById(id);
        if (country) return country;
        // Fallback to mock data
        return mockCountries.find(c => c.id === id) as unknown as Country | undefined;
      } catch (error) {
        console.warn('Failed to fetch country by ID from database, using mock data:', error);
        return mockCountries.find(c => c.id === id) as unknown as Country | undefined;
      }
    },
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
    queryFn: async () => {
      try {
        return await fetchAllRegions();
      } catch (error) {
        console.warn('Failed to fetch regions from database, using mock data:', error);
        const uniqueRegions = [...new Set(mockCountries.map(c => c.region))];
        return uniqueRegions;
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to fetch countries with project count
 */
export function useCountriesWithProjectCount() {
  return useQuery({
    queryKey: ['countries', 'with-project-count'],
    queryFn: async () => {
      try {
        return await fetchCountriesWithProjectCount();
      } catch (error) {
        console.warn('Failed to fetch countries with project count from database, using mock data:', error);
        return mockCountries.map(c => ({
          ...c,
          project_count: 0,
        })) as unknown as CountryWithProjects[];
      }
    },
    staleTime: 15 * 60 * 1000,
  });
}

/**
 * Hook to search countries
 */
export function useCountrySearch(query: string) {
  return useQuery({
    queryKey: ['countries', 'search', query],
    queryFn: async () => {
      if (!query.trim()) return [] as Country[];
      try {
        return await searchCountries(query);
      } catch (error) {
        console.warn('Failed to search countries from database, using mock data:', error);
        const lowerQuery = query.toLowerCase();
        return mockCountries.filter(c =>
          c.name_fr.toLowerCase().includes(lowerQuery) ||
          c.name_en.toLowerCase().includes(lowerQuery)
        ) as unknown as Country[];
      }
    },
    enabled: query.length >= 2,
    staleTime: 10 * 60 * 1000,
  });
}
