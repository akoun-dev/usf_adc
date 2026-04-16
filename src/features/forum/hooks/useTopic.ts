import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { forumService } from '../services/forum-service';
import { useQueryClient } from '@tanstack/react-query';

export function useTopic(id: string) {
  const queryClient = useQueryClient();

  const topicQuery = useQuery({
    queryKey: ['forum-topic', id],
    queryFn: () => forumService.getTopic(id),
    enabled: !!id,
  });

  const postsQuery = useQuery({
    queryKey: ['forum-posts', id],
    queryFn: () => forumService.getTopicPosts(id),
    enabled: !!id,
  });

  // Realtime for new posts
  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`forum-posts-${id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'forum_posts',
        filter: `topic_id=eq.${id}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['forum-posts', id] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id, queryClient]);

  return { topic: topicQuery, posts: postsQuery };
}
