-- =====================================================
-- migration: create storage bucket for attachments
-- =====================================================
-- purpose: configure storage for file attachments (fsu submissions, tickets, etc.)
-- affected objects: storage.buckets, storage.objects
-- special considerations:
--   - storage bucket must be created before rls policies can be added
--   - file size limit is set to 5mb (5242880 bytes)
-- =====================================================

-- =====================================================
-- 1. create storage bucket for attachments
-- =====================================================
-- note: this bucket stores user-uploaded files for various features
-- the bucket is private (not publicly accessible) - files are served via signed urls

insert into storage.buckets (id, name, public, file_size_limit)
values ('attachments', 'attachments', false, 5242880)
on conflict (id) do nothing;

-- =====================================================
-- 2. create rls policies for storage objects
-- =====================================================
-- note: storage rls policies control who can upload, view, and delete files
-- these policies work in conjunction with the application to manage file access

-- policy: insert - authenticated users can upload files
-- rationale: any authenticated user may need to upload attachments
-- note: the application should validate the context (e.g., fsu submission ownership)
create policy "attachments_insert_authenticated"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'attachments');

-- policy: select - users can view their own attachments
-- rationale: users should only see files they have uploaded
-- note: this uses foldername convention where user id is the first folder level
create policy "attachments_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- policy: select - global admins can view all attachments
-- rationale: global admins need full access to all files for administration
create policy "attachments_select_global_admin"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'attachments'
    and public.has_role(auth.uid(), 'global_admin')
  );

-- policy: delete - users can delete their own attachments
-- rationale: users should be able to delete files they have uploaded
create policy "attachments_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- policy: delete - global admins can delete any attachment
-- rationale: global admins need full control over all files
create policy "attachments_delete_global_admin"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'attachments'
    and public.has_role(auth.uid(), 'global_admin')
  );
