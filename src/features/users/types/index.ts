import type { AppRole } from '@/core/constants/roles';

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  country_id: string | null;
  language: string;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  country?: { name_fr: string; code_iso: string } | null;
  roles: AppRole[];
}
