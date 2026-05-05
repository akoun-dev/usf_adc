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

export interface FaqArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type NewsStatus = 'draft' | 'in_review' | 'published' | 'archived';

export type EventStatus = 'draft' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'archived';

export type EventType = 'conference' | 'webinar' | 'workshop' | 'training' | 'meeting' | 'other';

export interface NewsCategory {
  id: string;
  name_fr: string;
  name_en: string;
  name_pt: string;
  slug: string;
  color?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewsGalleryImage {
  id: string;
  news_id: string;
  image_url: string;
  caption?: string;
  alt_text?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ArticleTranslation {
  id: string;
  news_id: string;
  language: string;
  title: string;
  content?: string;
  excerpt?: string;
  created_at: string;
  updated_at: string;
}

export interface EnhancedNewsArticle {
  id: string;
  title: any;
  excerpt?: any;
  content?: any;
  category?: any;
  source?: string;
  image_url?: string;
  featured_image?: string;
  published_at: string;
  is_public: boolean;
  author?: string;
  read_time?: string;
  language: string;
  status: NewsStatus;
  meta_description?: string;
  meta_keywords?: string;
  slug?: string;
  sort_order: number;
  is_featured: boolean;
  allow_comments: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  news_categories?: NewsCategory | null;
  gallery_images?: NewsGalleryImage[];
  translations?: ArticleTranslation[];
}
