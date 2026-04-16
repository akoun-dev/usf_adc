import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsService, type ProjectInput } from '../services/projects-service';
import { toast } from 'sonner';

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ProjectInput> }) =>
      projectsService.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Projet mis à jour');
    },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  });
}
