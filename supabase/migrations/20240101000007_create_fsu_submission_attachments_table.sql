-- =====================================================
-- migration: create fsu_submission_attachments table
-- =====================================================
-- purpose: store file attachments for fsu submissions
-- affected tables: fsu_submission_attachments
-- special considerations:
--   - references storage.objects for actual file storage
--   - cascade deletes when submission is deleted
-- =====================================================

-- =====================================================
-- 1. create fsu_submission_attachments table
-- =====================================================
-- note: stores metadata for files attached to fsu submissions
-- actual files are stored in the 'attachments' storage bucket

create table public.fsu_submission_attachments (
  id uuid not null default gen_random_uuid() primary key,
  -- foreign key to fsu_submissions - deleted on cascade
  submission_id uuid not null references public.fsu_submissions(id) on delete cascade,
  -- original file name from upload
  file_name text not null,
  -- path to the file in storage (e.g., 'attachments/user_id/filename.ext')
  file_path text not null,
  -- file size in bytes
  file_size integer not null default 0,
  -- mime type of the file (e.g., 'application/pdf')
  mime_type text not null,
  -- user who uploaded this attachment
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- =====================================================
-- 2. enable row level security (rls)
-- =====================================================
-- warning: rls is critical - attachments are sensitive submission data
-- without proper rls, users could access attachments from other submissions

alter table public.fsu_submission_attachments enable row level security;

-- =====================================================
-- 3. create indexes for performance
-- =====================================================
-- note: these indexes speed up queries for submission attachments

create index idx_fsu_submission_attachments_submission_id on public.fsu_submission_attachments(submission_id);
create index idx_fsu_submission_attachments_uploaded_by on public.fsu_submission_attachments(uploaded_by);

-- =====================================================
-- 4. create rls policies
-- =====================================================
-- note: policies are granular - one per operation per role
-- access to attachments is derived from access to the parent submission

-- policy: select - point focal can view attachments of own submissions
-- rationale: point focal users need to see attachments on their own submissions
create policy "fsu_submission_attachments_select_point_focal_own"
  on public.fsu_submission_attachments for select
  to authenticated
  using (
    exists (
      select 1 from public.fsu_submissions s
      where s.id = fsu_submission_attachments.submission_id
        and s.submitted_by = auth.uid()
    )
  );

-- policy: select - country admins can view country submission attachments
-- rationale: country admins need to review attachments during validation
create policy "fsu_submission_attachments_select_country_admin"
  on public.fsu_submission_attachments for select
  to authenticated
  using (
    exists (
      select 1 from public.fsu_submissions s
      where s.id = fsu_submission_attachments.submission_id
        and public.has_role(auth.uid(), 'country_admin')
        and s.country_id = public.get_user_country(auth.uid())
    )
  );

-- policy: select - global admins can view all attachments
-- rationale: global admins need full visibility into all attachments
create policy "fsu_submission_attachments_select_super_admin"
  on public.fsu_submission_attachments for select
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));

-- policy: insert - point focal can attach files to own draft submissions
-- rationale: point focal users can upload files while working on submissions
-- warning: attachments can only be added to draft submissions
create policy "fsu_submission_attachments_insert_point_focal_draft"
  on public.fsu_submission_attachments for insert
  to authenticated
  with check (
    uploaded_by = auth.uid()
    and exists (
      select 1 from public.fsu_submissions s
      where s.id = fsu_submission_attachments.submission_id
        and s.submitted_by = auth.uid()
        and s.status = 'draft'
    )
  );

-- policy: delete - point focal can delete attachments from own draft submissions
-- rationale: point focal users can remove files while working on submissions
-- warning: attachments can only be removed from draft submissions
create policy "fsu_submission_attachments_delete_point_focal_draft"
  on public.fsu_submission_attachments for delete
  to authenticated
  using (
    exists (
      select 1 from public.fsu_submissions s
      where s.id = fsu_submission_attachments.submission_id
        and s.submitted_by = auth.uid()
        and s.status = 'draft'
    )
  );

-- policy: delete - global admins can delete any attachment
-- rationale: global admins may need to remove inappropriate or erroneous files
create policy "fsu_submission_attachments_delete_super_admin"
  on public.fsu_submission_attachments for delete
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));
