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
-- 2. create rls policies for storage objects
-- =====================================================
-- note: storage rls policies control who can upload, view, and delete logo files
-- only super_admin should be able to manage logos

-- policy: select - everyone can view logos (public bucket)
-- rationale: logos are displayed on public pages
create policy "countries_logos_select_public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'countries-logos');

-- policy: insert - only super_admin can upload logos
-- rationale: country management is restricted to super_admin
create policy "countries_logos_insert_super_admin"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'countries-logos'
    and public.has_role(auth.uid(), 'super_admin')
  );

-- policy: update - only super_admin can update logos
-- rationale: country management is restricted to super_admin
create policy "countries_logos_update_super_admin"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'countries-logos'
    and public.has_role(auth.uid(), 'super_admin')
  )
  with check (
    bucket_id = 'countries-logos'
    and public.has_role(auth.uid(), 'super_admin')
  );

-- policy: delete - only super_admin can delete logos
-- rationale: country management is restricted to super_admin
create policy "countries_logos_delete_super_admin"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'countries-logos'
    and public.has_role(auth.uid(), 'super_admin')
  );
