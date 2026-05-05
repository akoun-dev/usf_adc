import { supabase } from '@/integrations/supabase/client';
import type { InternalMessage, MailFolder, MessageStatus } from '../types';

export const messagingService = {
    async getMessages(folder: MailFolder): Promise<InternalMessage[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        let query = (supabase as any)
            .from('internal_messages')
            .select(`
                *,
                sender:profiles!internal_messages_sender_id_fkey(full_name, avatar_url),
                recipient:profiles!internal_messages_recipient_id_fkey(full_name, avatar_url)
            `);

        switch (folder) {
            case 'inbox':
                query = query
                    .eq('recipient_id', user.id)
                    .eq('status', 'sent')
                    .is('deleted_at_recipient', null);
                break;
            case 'sent':
                query = query
                    .eq('sender_id', user.id)
                    .eq('status', 'sent')
                    .is('deleted_at_sender', null);
                break;
            case 'drafts':
                query = query
                    .eq('sender_id', user.id)
                    .eq('status', 'draft')
                    .is('deleted_at_sender', null);
                break;
            case 'trash':
                query = query
                    .or(`and(sender_id.eq.${user.id},deleted_at_sender.not.is.null),and(recipient_id.eq.${user.id},deleted_at_recipient.not.is.null)`);
                break;
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return (data ?? []) as any[];
    },

    async getUnreadCount(): Promise<number> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return 0;

        const { count, error } = await (supabase as any)
            .from('internal_messages')
            .select('*', { count: 'exact', head: true })
            .eq('recipient_id', user.id)
            .eq('status', 'sent')
            .is('read_at', null)
            .is('deleted_at_recipient', null);
        
        if (error) throw error;
        return count ?? 0;
    },

    async sendMessage(message: Partial<InternalMessage>, language: string = 'fr'): Promise<void> {
        const payload = {
            ...message,
            status: 'sent',
            language,
            subject: typeof message.subject === 'string' ? { [language]: message.subject } : message.subject,
            content: typeof message.content === 'string' ? { [language]: message.content } : message.content
        };
        const { error } = await (supabase as any)
            .from('internal_messages')
            .insert([payload]);
        if (error) throw error;
    },

    async saveDraft(message: Partial<InternalMessage>, language: string = 'fr'): Promise<void> {
        const payload = {
            ...message,
            status: 'draft',
            language,
            subject: typeof message.subject === 'string' ? { [language]: message.subject } : message.subject,
            content: typeof message.content === 'string' ? { [language]: message.content } : message.content
        };

        if (message.id) {
            const { error } = await (supabase as any)
                .from('internal_messages')
                .update(payload)
                .eq('id', message.id);
            if (error) throw error;
        } else {
            const { error } = await (supabase as any)
                .from('internal_messages')
                .insert([payload]);
            if (error) throw error;
        }
    },

    async markAsRead(id: string): Promise<void> {
        const { error } = await (supabase as any)
            .from('internal_messages')
            .update({ read_at: new Date().toISOString() })
            .eq('id', id);
        if (error) throw error;
    },

    async deleteMessage(id: string, asSender: boolean): Promise<void> {
        const update = asSender 
            ? { deleted_at_sender: new Date().toISOString() } 
            : { deleted_at_recipient: new Date().toISOString() };
        
        const { error } = await (supabase as any)
            .from('internal_messages')
            .update(update)
            .eq('id', id);
        if (error) throw error;
    }
};
