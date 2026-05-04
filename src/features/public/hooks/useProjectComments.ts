import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProjectComments, addProjectComment } from '../services/project-comments.service';

export function useProjectComments(projectId: string) {
  const queryClient = useQueryClient();

  const commentsQuery = useQuery({
    queryKey: ['project-comments', projectId],
    queryFn: () => fetchProjectComments(projectId),
    enabled: !!projectId,
  });

  const addCommentMutation = useMutation({
    mutationFn: ({ content }: { content: string }) => addProjectComment(projectId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-comments', projectId] });
    },
  });

  return {
    comments: commentsQuery.data || [],
    isLoading: commentsQuery.isLoading,
    isError: commentsQuery.isError,
    addComment: addCommentMutation.mutateAsync,
    isSubmitting: addCommentMutation.isPending,
  };
}
