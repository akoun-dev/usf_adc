-- =====================================================
-- migration: create storage bucket for partners/members logos
-- =====================================================
-- purpose: configure storage for partner and member organization logos
-- affected objects: storage.buckets, storage.objects
-- special considerations:
--   - this bucket is public (logos are displayed on public pages)
--   - file size limit is set to 5mb (5242880 bytes)
--   - only authenticated users with valid roles can upload/update
-- =====================================================

-- =====================================================
-- 1. create storage bucket for logos
-- =====================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'logos',
  'logos',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

-- =====================================================
-- 2. drop any existing policies
-- =====================================================
DROP POLICY IF EXISTS "Enable public read access for logos" ON storage.objects;
DROP POLICY IF EXISTS "Enable authenticated upload for logos" ON storage.objects;
DROP POLICY IF EXISTS "Enable authenticated update for logos" ON storage.objects;
DROP POLICY IF EXISTS "Enable authenticated delete for logos" ON storage.objects;
DROP POLICY IF EXISTS "logos_select_public" ON storage.objects;
DROP POLICY IF EXISTS "logos_insert_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "logos_update_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "logos_delete_super_admin" ON storage.objects;

-- =====================================================
-- 3. create rls policies
-- =====================================================

-- policy: select - everyone can view logos (public bucket)
CREATE POLICY "logos_select_public"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'logos');

-- policy: insert - authenticated users with valid roles can upload
CREATE POLICY "logos_insert_authenticated"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'logos'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('point_focal', 'country_admin', 'super_admin')
    )
  );

-- policy: update - authenticated users with valid roles can update
CREATE POLICY "logos_update_authenticated"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'logos'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('point_focal', 'country_admin', 'super_admin')
    )
  )
  WITH CHECK (
    bucket_id = 'logos'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('point_focal', 'country_admin', 'super_admin')
    )
  );

-- policy: delete - only super_admin can delete logos
CREATE POLICY "logos_delete_super_admin"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'logos'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );