-- Migration to make Forum Categories, Topics and Posts multilingual
-- Date: 2026-05-13

-- 1. Forum Categories
ALTER TABLE forum_categories 
  ALTER COLUMN name TYPE jsonb USING jsonb_build_object('fr', name, 'en', name, 'pt', name, 'ar', name),
  ALTER COLUMN description TYPE jsonb USING jsonb_build_object('fr', description, 'en', description, 'pt', description, 'ar', description),
  ALTER COLUMN slug TYPE jsonb USING jsonb_build_object('fr', slug, 'en', slug, 'pt', slug, 'ar', slug);

-- 2. Forum Topics
ALTER TABLE forum_topics 
  ALTER COLUMN title TYPE jsonb USING jsonb_build_object('fr', title, 'en', title, 'pt', title, 'ar', title),
  ALTER COLUMN content TYPE jsonb USING jsonb_build_object('fr', content, 'en', content, 'pt', content, 'ar', content);

-- 3. Forum Posts
ALTER TABLE forum_posts
  ALTER COLUMN content TYPE jsonb USING jsonb_build_object('fr', content, 'en', content, 'pt', content, 'ar', content);

-- Update RLS or other constraints if necessary

