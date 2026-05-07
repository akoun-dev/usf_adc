import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { elearningService } from '../services/elearning-service';
import type { Training } from '../types';

export function useTrainings(status: string = 'published') {
    return useQuery({
        queryKey: ['trainings', status],
        queryFn: () => elearningService.getTrainings(status)
    });
}

export function useTraining(id: string) {
    return useQuery({
        queryKey: ['training', id],
        queryFn: () => elearningService.getTrainingById(id),
        enabled: !!id
    });
}

export function useCreateTraining() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (training: Partial<Training>) => elearningService.createTraining(training),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trainings'] });
        }
    });
}

export function useUpdateTraining() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string, updates: Partial<Training> }) => 
            elearningService.updateTraining(id, updates),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['trainings'] });
            queryClient.invalidateQueries({ queryKey: ['training', data.id] });
        }
    });
}
