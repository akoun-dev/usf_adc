import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsService } from '../services/projects-service';
import { toast } from 'sonner';

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectsService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Projet supprimé');
    },
    onError: () => toast.error('Erreur lors de la suppression'),
  });
}
