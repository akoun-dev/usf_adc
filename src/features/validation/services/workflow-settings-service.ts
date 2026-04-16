import { supabase } from '@/integrations/supabase/client';

export interface WorkflowSettings {
  id: string;
  country_id: string;
  approval_levels: number;
  default_deadline_days: number;
  created_at: string;
  updated_at: string;
}

export const workflowSettingsService = {
  async getForCountry(countryId: string): Promise<WorkflowSettings | null> {
    const { data, error } = await supabase
      .from('validation_workflow_settings')
      .select('*')
      .eq('country_id', countryId)
      .maybeSingle();
    if (error) throw error;
    return data as WorkflowSettings | null;
  },

  async upsert(countryId: string, settings: { approval_levels: number; default_deadline_days: number }): Promise<void> {
    const { error } = await supabase
      .from('validation_workflow_settings')
      .upsert(
        { country_id: countryId, ...settings },
        { onConflict: 'country_id' },
      );
    if (error) throw error;
  },
};
