-- =====================================================
-- migration: convert events and news fields to jsonb for multi-language support
-- =====================================================

-- 1. Update events table
ALTER TABLE public.events 
  ALTER COLUMN title TYPE jsonb USING jsonb_build_object('fr', title, 'en', title, 'pt', title, 'ar', title),
  ALTER COLUMN description TYPE jsonb USING jsonb_build_object('fr', description, 'en', description, 'pt', description, 'ar', description),
  ALTER COLUMN location TYPE jsonb USING jsonb_build_object('fr', location, 'en', location, 'pt', location, 'ar', location);

-- 2. Update news table
ALTER TABLE public.news 
  ALTER COLUMN title TYPE jsonb USING jsonb_build_object('fr', title, 'en', title, 'pt', title, 'ar', title),
  ALTER COLUMN excerpt TYPE jsonb USING jsonb_build_object('fr', excerpt, 'en', excerpt, 'pt', excerpt, 'ar', excerpt),
  ALTER COLUMN content TYPE jsonb USING jsonb_build_object('fr', content, 'en', content, 'pt', content, 'ar', content),
  ALTER COLUMN category TYPE jsonb USING jsonb_build_object('fr', category, 'en', category, 'pt', category, 'ar', category);

-- 3. Update comments/hints (optional but good for documentation)
COMMENT ON COLUMN public.events.title IS 'Event title (multi-language JSONB)';
COMMENT ON COLUMN public.events.description IS 'Detailed event description (multi-language JSONB)';
COMMENT ON COLUMN public.events.location IS 'Location or platform (multi-language JSONB)';

COMMENT ON COLUMN public.news.title IS 'Article title (multi-language JSONB)';
COMMENT ON COLUMN public.news.excerpt IS 'Brief summary or excerpt (multi-language JSONB)';
COMMENT ON COLUMN public.news.content IS 'Full article content (multi-language JSONB)';
COMMENT ON COLUMN public.news.category IS 'Category for grouping (multi-language JSONB)';
