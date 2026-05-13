import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCountries, createCountry, updateCountry, deleteCountry } from '../services/admin-service';
import { Country } from '../types';

export function useCountries() {
  return useQuery({
    queryKey: ['admin-countries'],
    queryFn: getCountries,
  });
}

export function useCreateCountry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCountry,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-countries'] }),
  });
}

export function useUpdateCountry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string } & Partial<Country>) =>
      updateCountry(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-countries'] }),
  });
}

export function useDeleteCountry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCountry,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-countries'] }),
  });
}
