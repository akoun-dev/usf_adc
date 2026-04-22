-- =====================================================
-- migration: create storage bucket for country logos
-- =====================================================
-- purpose: configure storage for country logo images
-- affected objects: storage.buckets, storage.objects
-- special considerations:
--   - this bucket is public (logos are displayed on public pages)
--   - file size limit is set to 5mb (5242880 bytes)
--   - only super_admin can upload/update/delete logos
-- =====================================================

-- =====================================================
-- 1. create storage bucket for country logos
-- =====================================================
-- note: this bucket stores country flag/logo images
-- the bucket is public so images can be displayed on public pages without authentication

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'countries-logos',
  'countries-logos',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
on conflict (id) do nothing;

-- =====================================================
-- 2. drop any existing policies from this bucket
-- =====================================================
-- note: clean up any policies that may exist from previous migrations
DROP POLICY IF EXISTS "countries_logos_select_public" ON storage.objects;
DROP POLICY IF EXISTS "countries_logos_insert_super_admin" ON storage.objects;
DROP POLICY IF EXISTS "countries_logos_insert_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "countries_logos_update_super_admin" ON storage.objects;
DROP POLICY IF EXISTS "countries_logos_update_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "countries_logos_delete_super_admin" ON storage.objects;

-- =====================================================
-- 3. create rls policies for storage objects
-- =====================================================
-- note: storage rls policies control who can upload, view, and delete logo files
-- using direct subquery instead of has_role() for better reliability

-- policy: select - everyone can view logos (public bucket)
-- rationale: logos are displayed on public pages
CREATE POLICY "countries_logos_select_public"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'countries-logos');

-- policy: insert - authenticated users with valid roles can upload logos
-- rationale: point_focal, country_admin, and super_admin can manage logos
CREATE POLICY "countries_logos_insert_authenticated"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'countries-logos'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('point_focal', 'country_admin', 'super_admin')
    )
  );

-- policy: update - authenticated users with valid roles can update logos
CREATE POLICY "countries_logos_update_authenticated"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'countries-logos'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('point_focal', 'country_admin', 'super_admin')
    )
  )
  WITH CHECK (
    bucket_id = 'countries-logos'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('point_focal', 'country_admin', 'super_admin')
    )
  );

-- policy: delete - only super_admin can delete logos
-- rationale: country management is restricted to super_admin
CREATE POLICY "countries_logos_delete_super_admin"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'countries-logos'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );
