-- =====================================================
-- migration: create fsu_submission_versions table
-- =====================================================
-- purpose: track version history of fsu submissions for audit trail
-- affected tables: fsu_submission_versions
-- special considerations:
--   - append-only table (versions should never be modified or deleted)
--   - each submission has multiple versions with incrementing version_number
-- =====================================================

-- =====================================================
-- 1. create fsu_submission_versions table
-- =====================================================
-- note: this table stores a complete history of all changes to fsu submissions
-- it's used for audit trails, rollback capability, and change tracking

create table public.fsu_submission_versions (
  id uuid not null default gen_random_uuid() primary key,
  -- foreign key to fsu_submissions - deleted on cascade
  submission_id uuid not null references public.fsu_submissions(id) on delete cascade,
  -- version number (starts at 1, increments for each change)
  version_number integer not null default 1,
  -- complete snapshot of submission data at this version
  data jsonb not null default '{}'::jsonb,
  -- user who made this change
  changed_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  -- unique constraint: each submission can only have one of each version number
  unique(submission_id, version_number)
);

-- =====================================================
-- 2. enable row level security (rls)
-- =====================================================
-- warning: rls is critical - version history contains sensitive historical data
-- without proper rls, users could access historical data from other submissions

alter table public.fsu_submission_versions enable row level security;

-- =====================================================
-- 3. create indexes for performance
-- =====================================================
-- note: these indexes speed up version history queries

create index idx_fsu_submission_versions_submission_id on public.fsu_submission_versions(submission_id);
create index idx_fsu_submission_versions_version_number on public.fsu_submission_versions(version_number);

-- =====================================================
-- 4. create rls policies
-- =====================================================
-- note: policies are granular - one per operation per role
-- access to versions is derived from access to the parent submission

-- policy: select - point focal can view versions of own submissions
-- rationale: point focal users need to see the history of their own submissions
create policy "fsu_submission_versions_select_point_focal_own"
  on public.fsu_submission_versions for select
  to authenticated
  using (
    exists (
      select 1 from public.fsu_submissions s
      where s.id = fsu_submission_versions.submission_id
        and s.submitted_by = auth.uid()
    )
  );

-- policy: select - country admins can view country submission versions
-- rationale: country admins need to see the history during validation
create policy "fsu_submission_versions_select_country_admin"
  on public.fsu_submission_versions for select
  to authenticated
  using (
    exists (
      select 1 from public.fsu_submissions s
      where s.id = fsu_submission_versions.submission_id
        and public.has_role(auth.uid(), 'country_admin')
        and s.country_id = public.get_user_country(auth.uid())
    )
  );

-- policy: select - global admins can view all versions
-- rationale: global admins need full visibility into all version history
create policy "fsu_submission_versions_select_super_admin"
  on public.fsu_submission_versions for select
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));

-- policy: insert - point focal can create versions of own submissions
-- rationale: versions are automatically created when submissions are modified
-- note: this is typically called by application code or triggers
create policy "fsu_submission_versions_insert_point_focal_own"
  on public.fsu_submission_versions for insert
  to authenticated
  with check (
    exists (
      select 1 from public.fsu_submissions s
      where s.id = fsu_submission_versions.submission_id
        and s.submitted_by = auth.uid()
    )
  );

-- policy: insert - global admins can create versions for any submission
-- rationale: global admins may need to manually create version records
create policy "fsu_submission_versions_insert_super_admin"
  on public.fsu_submission_versions for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'super_admin'));
