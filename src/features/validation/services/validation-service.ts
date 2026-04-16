import { supabase } from '@/integrations/supabase/client';
import type { ValidationActionType, SubmissionStatus } from '@/core/constants/roles';
import type { SubmissionFilters } from '@/features/fsu/types';
import { workflowSettingsService } from './workflow-settings-service';

const ACTION_TO_STATUS: Partial<Record<ValidationActionType, SubmissionStatus>> = {
  approve: 'approved',
  reject: 'rejected',
  request_revision: 'revision_requested',
};

export const validationService = {
  async listSubmissionsForValidation(filters?: SubmissionFilters) {
    let query = supabase
      .from('fsu_submissions')
      .select('*')
      .in('status', ['submitted', 'under_review'])
      .order('submitted_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.dateFrom) {
      query = query.gte('period_start', filters.dateFrom);
    }
    if (filters?.dateTo) {
      query = query.lte('period_end', filters.dateTo);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getActions(submissionId: string) {
    const { data, error } = await supabase
      .from('fsu_validation_actions')
      .select('*, profiles:performed_by(full_name)')
      .eq('submission_id', submissionId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  },

  async performAction(
    submissionId: string,
    action: ValidationActionType,
    comment: string | null,
    userId: string,
    isGlobalAdmin: boolean = false,
  ) {
    // Insert validation action
    const { error: actionError } = await supabase
      .from('fsu_validation_actions')
      .insert({
        submission_id: submissionId,
        action,
        comment,
        performed_by: userId,
      });
    if (actionError) throw actionError;

    // Determine new status based on workflow settings
    let newStatus = ACTION_TO_STATUS[action];
    
    if (newStatus === 'approved' && !isGlobalAdmin) {
      // Check if 2-level workflow is configured
      const { data: submission } = await supabase
        .from('fsu_submissions')
        .select('country_id')
        .eq('id', submissionId)
        .single();
      
      if (submission?.country_id) {
        const settings = await workflowSettingsService.getForCountry(submission.country_id);
        if (settings?.approval_levels === 2) {
          // Country admin pre-approves → move to under_review for global admin
          newStatus = 'under_review';
        }
      }
    }

    if (newStatus) {
      const { error: updateError } = await supabase
        .from('fsu_submissions')
        .update({
          status: newStatus,
          updated_by: userId,
        })
        .eq('id', submissionId);
      if (updateError) throw updateError;
    }
  },
};
