import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFaqArticle, updateFaqArticle, deleteFaqArticle } from '../services/admin-service';
import type { FaqArticle } from '../types';

export function useCreateFaqArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Omit<FaqArticle, 'id' | 'created_at' | 'updated_at'>) =>
      createFaqArticle(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq-articles'] });
    },
  });
}

export function useUpdateFaqArticle() {
  const queryClient = useQueryClient();

  type FaqArticleInput = Partial<Omit<FaqArticle, 'id' | 'created_at' | 'updated_at'>>;

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: FaqArticleInput }) => {
        return updateFaqArticle(id, input);
      },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq-articles'] });
    },
  });
}

export function useDeleteFaqArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFaqArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq-articles'] });
    },
  });
}
