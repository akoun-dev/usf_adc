import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { elearningService } from '../services/elearning-service';
import { toast } from 'sonner';

export function useUserRegistrations(userId: string) {
    return useQuery({
        queryKey: ['registrations', userId],
        queryFn: () => elearningService.getUserRegistrations(userId),
        enabled: !!userId
    });
}

export function useRegister(trainingId: string, userId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => elearningService.registerForTraining(trainingId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['registrations', userId] });
            toast.success('Inscription réussie !');
        },
        onError: (error: any) => {
            toast.error(`Erreur : ${error.message}`);
        }
    });
}
