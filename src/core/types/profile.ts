/** Typed representation of a user profile from the `profiles` table. */
export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  country_id: string | null;
  language: string;
  phone: string | null;
  mfa_method: string;
  telegram_chat_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
