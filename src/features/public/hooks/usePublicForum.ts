import { useQuery } from '@tanstack/react-query';
import {
  getPublicForumCategories,
  getPublicForumTopics,
  getPublicForumTopicById,
  getPopularTags,
} from '../services/forum.service';

export function usePublicForumCategories() {
  return useQuery({
    queryKey: ['public', 'forum', 'categories'],
    queryFn: getPublicForumCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePublicForumTopics() {
  return useQuery({
    queryKey: ['public', 'forum', 'topics'],
    queryFn: getPublicForumTopics,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function usePublicForumTopic(topicId: string) {
  return useQuery({
    queryKey: ['public', 'forum', 'topic', topicId],
    queryFn: () => getPublicForumTopicById(topicId),
    enabled: !!topicId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function usePopularTags() {
  return useQuery({
    queryKey: ['public', 'forum', 'tags'],
    queryFn: getPopularTags,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
