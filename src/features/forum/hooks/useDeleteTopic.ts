import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { forumService } from '../services/forum-service';
import { toast } from 'sonner';

export function useDeleteTopic() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (id: string) => forumService.deleteTopic(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-topics'] });
      toast.success('Sujet supprimé');
      navigate('/forum');
    },
    onError: () => toast.error('Erreur lors de la suppression du sujet'),
  });
}
