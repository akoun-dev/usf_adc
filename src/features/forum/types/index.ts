export interface ForumCategory {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  sort_order: number;
  created_at: string;
}

export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  category_id: string | null;
  created_by: string;
  is_pinned: boolean;
  is_locked: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  category?: ForumCategory;
  author?: { full_name: string | null; avatar_url: string | null };
  post_count?: number;
  latest_post_at?: string | null;
}

export interface ForumPost {
  id: string;
  topic_id: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  // Joined
  author?: { full_name: string | null; avatar_url: string | null };
}
