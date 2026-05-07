import { supabase } from '@/integrations/supabase/client';
import type { 
    Training, 
    TrainingRegistration, 
    TrainingEvent, 
    Announcement 
} from '../types';

export const elearningService = {
    // Trainings
    async getTrainings(status: string = 'published') {
        const query = supabase
            .from('trainings')
            .select('*')
            .order('start_date', { ascending: true });
        
        if (status !== 'all') {
            query.eq('status', status);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data as Training[];
    },

    async getTrainingById(id: string) {
        const { data, error } = await supabase
            .from('trainings')
            .select('*, training_documents(document_id, documents(*))')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    async createTraining(training: Partial<Training>) {
        const { data, error } = await supabase
            .from('trainings')
            .insert(training)
            .select()
            .single();
        if (error) throw error;
        return data as Training;
    },

    async updateTraining(id: string, updates: Partial<Training>) {
        const { data, error } = await supabase
            .from('trainings')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data as Training;
    },

    // Registrations
    async registerForTraining(trainingId: string, userId: string) {
        const { data, error } = await supabase
            .from('training_registrations')
            .insert({
                training_id: trainingId,
                user_id: userId,
                status: 'pending'
            })
            .select()
            .single();
        if (error) throw error;
        return data as TrainingRegistration;
    },

    async getUserRegistrations(userId: string) {
        const { data, error } = await supabase
            .from('training_registrations')
            .select('*, trainings(*)')
            .eq('user_id', userId);
        if (error) throw error;
        return data;
    },

    async updateRegistrationStatus(id: string, status: string) {
        const { data, error } = await supabase
            .from('training_registrations')
            .update({ status })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data as TrainingRegistration;
    },

    // Events (Calendar)
    async getEvents(start: string, end: string) {
        const { data, error } = await supabase
            .from('training_events')
            .select('*')
            .gte('start_date', start)
            .lte('end_date', end);
        if (error) throw error;
        return data as TrainingEvent[];
    },

    // Announcements
    async getAnnouncements() {
        const { data, error } = await supabase
            .from('announcements')
            .select('*')
            .order('published_at', { ascending: false });
        if (error) throw error;
        return data as Announcement[];
    },

    async createAnnouncement(announcement: Partial<Announcement>) {
        const { data, error } = await supabase
            .from('announcements')
            .insert(announcement)
            .select()
            .single();
        if (error) throw error;
        
        // In a real scenario, a Postgres trigger would create 
        // individual notifications for target roles.
        
        return data as Announcement;
    }
};
