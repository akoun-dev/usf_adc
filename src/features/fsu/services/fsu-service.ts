import { supabase } from '@/integrations/supabase/client';
import type { FsuFormData, SubmissionFilters } from '../types';
import type { Json } from '@/integrations/supabase/types';

function toJson(obj: Record<string, unknown>): Json {
  return JSON.parse(JSON.stringify(obj)) as Json;
}

export const fsuService = {
  async list(filters?: SubmissionFilters) {
    let query = supabase
      .from('fsu_submissions')
      .select('*')
      .order('created_at', { ascending: false });

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

  async getById(id: string) {
    const { data, error } = await supabase
      .from('fsu_submissions')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(userId: string, countryId: string, formData: FsuFormData) {
    const { data, error } = await supabase
      .from('fsu_submissions')
      .insert({
        submitted_by: userId,
        country_id: countryId,
        period_start: formData.period_start,
        period_end: formData.period_end,
        data: toJson({
          connectivity: formData.connectivity,
          financing: formData.financing,
          quality: formData.quality,
        }),
        status: 'draft' as const,
        created_by: userId,
        updated_by: userId,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async saveDraft(id: string, userId: string, formData: Partial<FsuFormData>) {
    const update: {
      updated_by: string;
      period_start?: string;
      period_end?: string;
      data?: Json;
    } = { updated_by: userId };

    if (formData.period_start) update.period_start = formData.period_start;
    if (formData.period_end) update.period_end = formData.period_end;

    const currentData: Record<string, unknown> = {};
    if (formData.connectivity) currentData.connectivity = formData.connectivity;
    if (formData.financing) currentData.financing = formData.financing;
    if (formData.quality) currentData.quality = formData.quality;

    if (Object.keys(currentData).length > 0) {
      update.data = toJson(currentData);
    }

    const { data, error } = await supabase
      .from('fsu_submissions')
      .update(update)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async submit(id: string, userId: string, formData: FsuFormData) {
    const { data, error } = await supabase
      .from('fsu_submissions')
      .update({
        status: 'submitted' as const,
        submitted_at: new Date().toISOString(),
        updated_by: userId,
        data: toJson({
          connectivity: formData.connectivity,
          financing: formData.financing,
          quality: formData.quality,
        }),
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;

    // Create version entry
    const { error: versionError } = await supabase
      .from('fsu_submission_versions')
      .insert({
        submission_id: id,
        version_number: 1,
        data: toJson({
          connectivity: formData.connectivity,
          financing: formData.financing,
          quality: formData.quality,
        }),
        changed_by: userId,
      });
    if (versionError) throw versionError;

    // Fire-and-forget: notify admins via SMS/Email
    supabase.functions
      .invoke('notify-fsu-submission', { body: { submission_id: id } })
      .catch((err) => console.error('FSU notification failed:', err));

    return data;
  },

  async getAttachments(submissionId: string) {
    const { data, error } = await supabase
      .from('fsu_submission_attachments')
      .select('*')
      .eq('submission_id', submissionId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async uploadAttachment(submissionId: string, userId: string, file: File) {
    const filePath = `fsu/${submissionId}/${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('attachments')
      .upload(filePath, file, { upsert: true });
    if (uploadError) throw uploadError;

    const { data, error } = await supabase
      .from('fsu_submission_attachments')
      .insert({
        submission_id: submissionId,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: userId,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteAttachment(attachmentId: string, filePath: string) {
    const { error: storageError } = await supabase.storage
      .from('attachments')
      .remove([filePath]);
    if (storageError) throw storageError;

    const { error } = await supabase
      .from('fsu_submission_attachments')
      .delete()
      .eq('id', attachmentId);
    if (error) throw error;
  },

  async getVersions(submissionId: string) {
    const { data, error } = await supabase
      .from('fsu_submission_versions')
      .select('*')
      .eq('submission_id', submissionId)
      .order('version_number', { ascending: false });
    if (error) throw error;
    return data;
  },
};
