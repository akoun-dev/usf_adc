import { useQuery } from '@tanstack/react-query';
import { newsletterService } from '../services/newsletter-service';

export function useNewsletters() {
  return useQuery({
    queryKey: ['newsletters'],
    queryFn: () => newsletterService.list(),
  });
}
