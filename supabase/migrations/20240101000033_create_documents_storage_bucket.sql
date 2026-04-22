-- =====================================================
-- migration: create storage bucket for documents
-- =====================================================
-- purpose: configure storage for document files
-- affected objects: storage.buckets, storage.objects
-- special considerations:
--   - this bucket is public (documents are displayed on public pages)
--   - file size limit is set to 10mb (10485760 bytes)
--   - only authenticated users with valid roles can upload/update
-- =====================================================

-- =====================================================
-- 1. create storage bucket for documents
-- =====================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  true,
  10485760,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/png', 'image/jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/png', 'image/jpeg'];

-- =====================================================
-- 2. drop any existing policies
-- =====================================================
DROP POLICY IF EXISTS "Enable public read access for documents" ON storage.objects;
DROP POLICY IF EXISTS "Enable authenticated upload for documents" ON storage.objects;
DROP POLICY IF EXISTS "Enable authenticated update for documents" ON storage.objects;
DROP POLICY IF EXISTS "Enable authenticated delete for documents" ON storage.objects;
DROP POLICY IF EXISTS "documents_select_public" ON storage.objects;
DROP POLICY IF EXISTS "documents_insert_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "documents_update_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "documents_delete_super_admin" ON storage.objects;

-- =====================================================
-- 3. create rls policies
-- =====================================================

-- policy: select - everyone can view documents (public bucket)
CREATE POLICY "documents_select_public"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'documents');

-- policy: insert - authenticated users with valid roles can upload
CREATE POLICY "documents_insert_authenticated"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('point_focal', 'country_admin', 'super_admin')
    )
  );

-- policy: update - authenticated users with valid roles can update
CREATE POLICY "documents_update_authenticated"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'documents'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('point_focal', 'country_admin', 'super_admin')
    )
  )
  WITH CHECK (
    bucket_id = 'documents'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('point_focal', 'country_admin', 'super_admin')
    )
  );

-- policy: delete - only super_admin can delete documents
CREATE POLICY "documents_delete_super_admin"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documents'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );