export type MessageStatus = 'draft' | 'sent';

export interface InternalMessage {
    id: string;
    sender_id: string;
    recipient_id: string | null;
    subject: Record<string, string> | null;
    content: Record<string, string> | null;
    language: string;
    status: MessageStatus;
    read_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at_sender: string | null;
    deleted_at_recipient: string | null;
    parent_message_id: string | null;
    thread_id: string;
    
    // Joined data
    sender?: {
        full_name: string | null;
        avatar_url: string | null;
    };
    recipient?: {
        full_name: string | null;
        avatar_url: string | null;
    };
}

export type MailFolder = 'inbox' | 'sent' | 'drafts' | 'trash';
