-- =====================================================
-- migration: convert documents fields to jsonb for multi-language support
-- =====================================================

-- 1. Drop existing defaults that might cause cast errors
ALTER TABLE public.documents 
  ALTER COLUMN title DROP DEFAULT,
  ALTER COLUMN description DROP DEFAULT,
  ALTER COLUMN category DROP DEFAULT,
  ALTER COLUMN content DROP DEFAULT;

-- 2. Update documents table columns to jsonb
ALTER TABLE public.documents 
  ALTER COLUMN title TYPE jsonb USING jsonb_build_object('fr', title, 'en', title, 'pt', title, 'ar', title),
  ALTER COLUMN description TYPE jsonb USING jsonb_build_object('fr', description, 'en', description, 'pt', description, 'ar', description),
  ALTER COLUMN category TYPE jsonb USING jsonb_build_object('fr', category, 'en', category, 'pt', category, 'ar', category),
  ALTER COLUMN content TYPE jsonb USING jsonb_build_object('fr', content, 'en', content, 'pt', content, 'ar', content);

-- 3. Set new jsonb defaults
ALTER TABLE public.documents 
  ALTER COLUMN title SET DEFAULT '{}'::jsonb,
  ALTER COLUMN description SET DEFAULT '{}'::jsonb,
  ALTER COLUMN category SET DEFAULT '{}'::jsonb,
  ALTER COLUMN content SET DEFAULT '{}'::jsonb;

-- 2. Update comments for documentation
COMMENT ON COLUMN public.documents.title IS 'Document title (multi-language JSONB)';
COMMENT ON COLUMN public.documents.description IS 'Document description (multi-language JSONB)';
COMMENT ON COLUMN public.documents.category IS 'Document category (multi-language JSONB)';
COMMENT ON COLUMN public.documents.content IS 'Document content/body (multi-language JSONB)';
