import { useMutation, useQueryClient } from '@tanstack/react-query';
import { faqService, type FaqArticle } from '../services/faq-service';
import { toast } from 'sonner';

export function useFaqMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['faq-articles'] });

  const create = useMutation({
    mutationFn: (article: Omit<FaqArticle, 'id' | 'created_at' | 'updated_at'>) =>
      faqService.create(article),
    onSuccess: () => { toast.success('Article créé'); invalidate(); },
    onError: () => toast.error('Erreur lors de la création'),
  });

  const update = useMutation({
    mutationFn: ({ id, ...updates }: Partial<FaqArticle> & { id: string }) =>
      faqService.update(id, updates),
    onSuccess: () => { toast.success('Article mis à jour'); invalidate(); },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  });

  const remove = useMutation({
    mutationFn: (id: string) => faqService.remove(id),
    onSuccess: () => { toast.success('Article supprimé'); invalidate(); },
    onError: () => toast.error('Erreur lors de la suppression'),
  });

  return { create, update, remove };
}
