-- Migration to refactor projects fields to JSONB for multilingual support

-- Change column types and migrate existing data
ALTER TABLE public.projects
ALTER COLUMN title TYPE jsonb USING jsonb_build_object('fr', title::text, 'en', '', 'pt', '', 'ar', ''),
ALTER COLUMN description TYPE jsonb USING CASE WHEN description IS NOT NULL THEN jsonb_build_object('fr', description::text, 'en', '', 'pt', '', 'ar', '') ELSE '{"fr":"","en":"","pt":"","ar":""}'::jsonb END,
ALTER COLUMN region TYPE jsonb USING CASE WHEN region IS NOT NULL THEN jsonb_build_object('fr', region::text, 'en', '', 'pt', '', 'ar', '') ELSE '{"fr":"","en":"","pt":"","ar":""}'::jsonb END,
ALTER COLUMN beneficiaries TYPE jsonb USING CASE WHEN beneficiaries IS NOT NULL THEN jsonb_build_object('fr', beneficiaries::text, 'en', '', 'pt', '', 'ar', '') ELSE '{"fr":"","en":"","pt":"","ar":""}'::jsonb END,
ALTER COLUMN thematic TYPE jsonb USING CASE WHEN thematic IS NOT NULL THEN jsonb_build_object('fr', thematic::text, 'en', '', 'pt', '', 'ar', '') ELSE '{"fr":"","en":"","pt":"","ar":""}'::jsonb END;

-- Update the default values for these columns to be a JSONB object
ALTER TABLE public.projects
ALTER COLUMN description SET DEFAULT '{"fr":"","en":"","pt":"","ar":""}'::jsonb,
ALTER COLUMN region SET DEFAULT '{"fr":"","en":"","pt":"","ar":""}'::jsonb,
ALTER COLUMN beneficiaries SET DEFAULT '{"fr":"","en":"","pt":"","ar":""}'::jsonb,
ALTER COLUMN thematic SET DEFAULT '{"fr":"","en":"","pt":"","ar":""}'::jsonb;
