import { supabase } from '@/integrations/supabase/client';

export interface PlatformSetting {
  id: string;
  key: string;
  value: unknown;
  label: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface SubmissionPeriod {
  id: string;
  label: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  reminder_days_before: number;
  created_at: string;
  updated_at: string;
}

export interface Country {
  id: string;
  name_fr: string;
  name_en: string;
  code_iso: string;
  region: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLogEntry {
  id: string;
  user_id: string | null;
  action: string;
  target_table: string | null;
  target_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}
