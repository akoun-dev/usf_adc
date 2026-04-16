import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createInvitation } from '../services/invitation-service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export function useCreateInvitation() {
  const qc = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: createInvitation,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invitations'] });
      toast.success(t('invitations.created'));
    },
    onError: (e: Error) => {
      toast.error(e.message);
    },
  });
}
