import { useQuery } from '@tanstack/react-query';
import { getFaqArticles } from '../services/admin-service';

export function useFaqArticles() {
  return useQuery({
    queryKey: ['faq-articles'],
    queryFn: getFaqArticles,
  });
}
