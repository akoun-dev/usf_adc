import { useMutation, useQueryClient } from '@tanstack/react-query';
import { newsletterService } from '../services/newsletter-service';
import type { NewsletterInput } from '../types';
import { toast } from 'sonner';

export function useCreateNewsletter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: NewsletterInput) => newsletterService.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['newsletters'] });
      toast.success('Bulletin créé');
    },
    onError: () => toast.error('Erreur lors de la création'),
  });
}

export function useUpdateNewsletter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<NewsletterInput> }) =>
      newsletterService.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['newsletters'] });
      toast.success('Bulletin mis à jour');
    },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  });
}

export function usePublishNewsletter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => newsletterService.publish(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['newsletters'] });
      toast.success('Bulletin publié');
    },
    onError: () => toast.error('Erreur lors de la publication'),
  });
}

export function useUnpublishNewsletter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => newsletterService.unpublish(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['newsletters'] });
      toast.success('Bulletin dépublié');
    },
    onError: () => toast.error('Erreur'),
  });
}

export function useDeleteNewsletter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => newsletterService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['newsletters'] });
      toast.success('Bulletin supprimé');
    },
    onError: () => toast.error('Erreur lors de la suppression'),
  });
}
