import { useQuery } from '@tanstack/react-query';
import { faqService } from '../services/faq-service';

export function useFaqArticles(allIncludingUnpublished = false) {
  return useQuery({
    queryKey: ['faq-articles', allIncludingUnpublished],
    queryFn: () => (allIncludingUnpublished ? faqService.getAll() : faqService.getPublished()),
  });
}
