-- =====================================================
-- migration: configure all storage buckets and policies
-- =====================================================
-- purpose: ensure all storage buckets exist with proper config and RLS policies
-- affected buckets: logos, documents, article-images, article-gallery, countries-logos, country-flags, attachments
-- =====================================================

-- =====================================================
-- 1. create/update logos bucket
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
-- 2. create/update documents bucket
-- =====================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  true,
  52428800,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'image/png', 'image/jpeg', 'image/webp'];

-- =====================================================
-- 3. create/update article-images bucket
-- =====================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'article-images',
  'article-images',
  true,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

-- =====================================================
-- 4. create/update article-gallery bucket
-- =====================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'article-gallery',
  'article-gallery',
  true,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

-- =====================================================
-- 5. create/update countries-logos bucket
-- =====================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'countries-logos',
  'countries-logos',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

-- =====================================================
-- 6. create/update country-flags bucket
-- =====================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'country-flags',
  'country-flags',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

-- =====================================================
-- 7. create/update attachments bucket (private)
-- =====================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES (
  'attachments',
  'attachments',
  false,
  52428800
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 52428800;

-- =====================================================
-- 8. drop existing policies for logos
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
-- 9. create RLS policies for logos bucket
-- =====================================================
CREATE POLICY "logos_select_public"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'logos');

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

-- =====================================================
-- 10. drop existing policies for documents
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
-- 11. create RLS policies for documents bucket
-- =====================================================
CREATE POLICY "documents_select_public"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'documents');

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

-- =====================================================
-- 12. drop existing policies for article-images
-- =====================================================
DROP POLICY IF EXISTS "article_images_public_read_policy" ON storage.objects;
DROP POLICY IF EXISTS "article_images_admin_insert_policy" ON storage.objects;
DROP POLICY IF EXISTS "article_images_admin_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "article_images_admin_delete_policy" ON storage.objects;

-- =====================================================
-- 13. create RLS policies for article-images bucket
-- =====================================================
CREATE POLICY "article_images_public_read_policy"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'article-images');

CREATE POLICY "article_images_admin_insert_policy"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'article-images'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('country_admin', 'super_admin')
    )
  );

CREATE POLICY "article_images_admin_update_policy"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'article-images'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('country_admin', 'super_admin')
    )
  )
  WITH CHECK (
    bucket_id = 'article-images'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('country_admin', 'super_admin')
    )
  );

CREATE POLICY "article_images_admin_delete_policy"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'article-images'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- =====================================================
-- 14. drop existing policies for article-gallery
-- =====================================================
DROP POLICY IF EXISTS "article_gallery_public_read_policy" ON storage.objects;
DROP POLICY IF EXISTS "article_gallery_admin_insert_policy" ON storage.objects;
DROP POLICY IF EXISTS "article_gallery_admin_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "article_gallery_admin_delete_policy" ON storage.objects;

-- =====================================================
-- 15. create RLS policies for article-gallery bucket
-- =====================================================
CREATE POLICY "article_gallery_public_read_policy"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'article-gallery');

CREATE POLICY "article_gallery_admin_insert_policy"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'article-gallery'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('country_admin', 'super_admin')
    )
  );

CREATE POLICY "article_gallery_admin_update_policy"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'article-gallery'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('country_admin', 'super_admin')
    )
  )
  WITH CHECK (
    bucket_id = 'article-gallery'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('country_admin', 'super_admin')
    )
  );

CREATE POLICY "article_gallery_admin_delete_policy"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'article-gallery'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- =====================================================
-- 16. drop existing policies for countries-logos
-- =====================================================
DROP POLICY IF EXISTS "countries_logos_select_public" ON storage.objects;
DROP POLICY IF EXISTS "countries_logos_insert_super_admin" ON storage.objects;
DROP POLICY IF EXISTS "countries_logos_insert_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "countries_logos_update_super_admin" ON storage.objects;
DROP POLICY IF EXISTS "countries_logos_update_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "countries_logos_delete_super_admin" ON storage.objects;

-- =====================================================
-- 17. create RLS policies for countries-logos bucket
-- =====================================================
CREATE POLICY "countries_logos_select_public"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'countries-logos');

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

-- =====================================================
-- 18. drop existing policies for country-flags
-- =====================================================
DROP POLICY IF EXISTS "Public can view country flags" ON storage.objects;
DROP POLICY IF EXISTS "Super admins can manage country flags" ON storage.objects;

-- =====================================================
-- 19. create RLS policies for country-flags bucket
-- =====================================================
CREATE POLICY "country_flags_select_public"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'country-flags');

CREATE POLICY "country_flags_insert_authenticated"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'country-flags'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "country_flags_update_authenticated"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'country-flags'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  )
  WITH CHECK (
    bucket_id = 'country-flags'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "country_flags_delete_super_admin"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'country-flags'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- =====================================================
-- 20. drop existing policies for attachments
-- =====================================================
DROP POLICY IF EXISTS "attachments_insert_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "attachments_select_own" ON storage.objects;
DROP POLICY IF EXISTS "attachments_select_super_admin" ON storage.objects;
DROP POLICY IF EXISTS "attachments_delete_own" ON storage.objects;
DROP POLICY IF EXISTS "attachments_delete_super_admin" ON storage.objects;

-- =====================================================
-- 21. create RLS policies for attachments bucket
-- =====================================================
CREATE POLICY "attachments_insert_authenticated"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'attachments');

CREATE POLICY "attachments_select_own"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'attachments'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "attachments_select_super_admin"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'attachments'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "attachments_delete_own"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'attachments'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "attachments_delete_super_admin"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'attachments'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );