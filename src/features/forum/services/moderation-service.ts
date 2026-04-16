import { supabase } from '@/integrations/supabase/client';

export interface ForumReport {
  id: string;
  reporter_id: string;
  target_type: 'post' | 'topic';
  target_id: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export const moderationService = {
  async reportContent(input: {
    reporter_id: string;
    target_type: 'post' | 'topic';
    target_id: string;
    reason: string;
  }): Promise<void> {
    const { error } = await supabase
      .from('forum_reports')
      .insert(input);
    if (error) throw error;
  },

  async getReports(statusFilter?: string): Promise<ForumReport[]> {
    let query = supabase
      .from('forum_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as ForumReport[];
  },

  async reviewReport(reportId: string, status: 'reviewed' | 'dismissed', reviewerId: string): Promise<void> {
    const { error } = await supabase
      .from('forum_reports')
      .update({
        status,
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', reportId);
    if (error) throw error;
  },
};
