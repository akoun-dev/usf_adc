import { useQuery } from '@tanstack/react-query';
import { elearningService } from '../services/elearning-service';

export function useAnnouncements() {
    return useQuery({
        queryKey: ['announcements'],
        queryFn: () => elearningService.getAnnouncements()
    });
}
