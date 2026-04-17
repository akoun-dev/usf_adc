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
  official_name?: string;
  flag_url?: string;
  description?: string;
  population?: string;
  capital?: string;
  fsu_established?: string;
  fsu_budget?: string;
  fsu_coordinator_name?: string;
  fsu_coordinator_email?: string;
  fsu_coordinator_phone?: string;
  logo_path?: string;
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
