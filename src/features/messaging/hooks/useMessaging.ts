import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagingService } from '../services/messaging-service';
import type { MailFolder, InternalMessage } from '../types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const useMessages = (folder: MailFolder) => {
    return useQuery({
        queryKey: ['messages', folder],
        queryFn: () => messagingService.getMessages(folder),
    });
};

export const useUnreadMessages = () => {
    return useQuery({
        queryKey: ['messages', 'unread-count'],
        queryFn: () => messagingService.getUnreadCount(),
        refetchInterval: 30000, // Refetch every 30s
    });
};

export const useSendMessage = () => {
    const queryClient = useQueryClient();
    const { t, i18n } = useTranslation();

    return useMutation({
        mutationFn: (message: Partial<InternalMessage>) => 
            messagingService.sendMessage(message, i18n.language),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            toast.success(t('messaging.successSent'));
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    });
};

export const useSaveDraft = () => {
    const queryClient = useQueryClient();
    const { t, i18n } = useTranslation();

    return useMutation({
        mutationFn: (message: Partial<InternalMessage>) => 
            messagingService.saveDraft(message, i18n.language),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages', 'drafts'] });
            toast.success(t('messaging.successDraft'));
        }
    });
};

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => messagingService.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
        }
    });
};

export const useDeleteMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, asSender }: { id: string, asSender: boolean }) => 
            messagingService.deleteMessage(id, asSender),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
        }
    });
};
