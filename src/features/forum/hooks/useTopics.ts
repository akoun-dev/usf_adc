import { useQuery } from '@tanstack/react-query';
import { forumService } from '../services/forum-service';

export function useTopics(categoryId?: string) {
  return useQuery({
    queryKey: ['forum-topics', categoryId],
    queryFn: () => forumService.getTopics(categoryId),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['forum-categories'],
    queryFn: () => forumService.getCategories(),
  });
}
