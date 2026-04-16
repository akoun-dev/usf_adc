import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user-service';
import { toast } from 'sonner';
import type { AppRole } from '@/core/constants/roles';

export function useManageRole() {
  const queryClient = useQueryClient();

  const addRole = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: AppRole }) =>
      userService.addRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Rôle ajouté');
    },
    onError: () => toast.error("Erreur lors de l'ajout du rôle"),
  });

  const removeRole = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: AppRole }) =>
      userService.removeRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Rôle retiré');
    },
    onError: () => toast.error('Erreur lors du retrait du rôle'),
  });

  return { addRole, removeRole };
}
