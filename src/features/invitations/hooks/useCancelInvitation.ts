import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelInvitation } from '../services/invitation-service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export function useCancelInvitation() {
  const qc = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: cancelInvitation,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invitations'] });
      toast.success(t('invitations.cancelled'));
    },
    onError: (e: Error) => {
      toast.error(e.message);
    },
  });
}
