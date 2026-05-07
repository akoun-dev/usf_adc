import type { Database } from '@/integrations/supabase/types';
import type { AppRole } from '@/core/constants/roles';

export type Training = {
    id: string;
    title: string;
    description: string | null;
    type: 'online' | 'onsite';
    start_date: string | null;
    end_date: string | null;
    trainer: string | null;
    capacity: number | null;
    location: string | null;
    content: any;
    status: 'draft' | 'published' | 'archived';
    image_url: string | null;
    created_at: string;
    updated_at: string;
};

export type TrainingRegistration = {
    id: string;
    training_id: string;
    user_id: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'attended';
    registered_at: string;
};

export type TrainingDocument = {
    id: string;
    training_id: string;
    document_id: string;
    access_roles: AppRole[];
};

export type TrainingEvent = {
    id: string;
    training_id: string | null;
    title: string;
    description: string | null;
    start_date: string;
    end_date: string;
    type: 'online' | 'onsite';
    created_at: string;
};

export type Announcement = {
    id: string;
    title: string;
    content: string;
    training_id: string | null;
    type: string;
    published_at: string;
    expires_at: string | null;
    target_roles: AppRole[];
    created_by: string | null;
};
