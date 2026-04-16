import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsService, type ProjectInput } from '../services/projects-service';
import { toast } from 'sonner';

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ProjectInput) => projectsService.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Projet créé avec succès');
    },
    onError: () => toast.error('Erreur lors de la création du projet'),
  });
}
