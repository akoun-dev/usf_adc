-- =====================================================
-- migration: create fsu_submissions table
-- =====================================================
-- purpose: store fsu (fonds de service universel) submission data
-- affected tables: fsu_submissions
-- special considerations:
--   - data column stores jsonb with flexible submission form data
--   - workflow states enforce the validation process
-- =====================================================

-- =====================================================
-- 1. create fsu_submissions table
-- =====================================================
-- note: fsu submissions are the core entity for universal service fund reporting
-- they contain structured data in the data column (jsonb format)

create table public.fsu_submissions (
  id uuid not null default gen_random_uuid() primary key,
  -- foreign key to countries - submission belongs to a specific country
  country_id uuid not null references public.countries(id),
  -- the user who created/owns this submission
  submitted_by uuid not null references auth.users(id),
  -- current status in the validation workflow
  status public.submission_status not null default 'draft',
  -- reporting period start date
  period_start date not null,
  -- reporting period end date
  period_end date not null,
  -- submission data stored as jsonb (flexible schema)
  -- contains all form fields, indicators, metrics, etc.
  data jsonb not null default '{}'::jsonb,
  -- timestamp when submission was moved out of draft status
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- audit fields: who created and last modified the record
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id)
);

-- =====================================================
-- 2. enable row level security (rls)
-- =====================================================
-- warning: rls is critical - fsu data is sensitive and country-specific
-- without proper rls, users could access submissions from other countries

alter table public.fsu_submissions enable row level security;

-- =====================================================
-- 3. create indexes for performance
-- =====================================================
-- note: these indexes speed up common queries and dashboard views

create index idx_fsu_submissions_country_id on public.fsu_submissions(country_id);
create index idx_fsu_submissions_submitted_by on public.fsu_submissions(submitted_by);
create index idx_fsu_submissions_status on public.fsu_submissions(status);
create index idx_fsu_submissions_period on public.fsu_submissions(period_start, period_end);

-- =====================================================
-- 4. create rls policies
-- =====================================================
-- note: policies are granular - one per operation per role
-- the philosophy is "default deny" with explicit allow policies

-- policy: select - point focal can view own submissions
-- rationale: point focal users need to see their own submissions
create policy "fsu_submissions_select_point_focal_own"
  on public.fsu_submissions for select
  to authenticated
  using (
    submitted_by = auth.uid()
    and public.has_role(auth.uid(), 'point_focal')
  );

-- policy: select - country admins can view country submissions
-- rationale: country admins need to review submissions from their country
create policy "fsu_submissions_select_country_admin"
  on public.fsu_submissions for select
  to authenticated
  using (
    public.has_role(auth.uid(), 'country_admin')
    and country_id = public.get_user_country(auth.uid())
  );

-- policy: select - global admins can view all submissions
-- rationale: global admins need visibility into all submissions
create policy "fsu_submissions_select_global_admin"
  on public.fsu_submissions for select
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- policy: insert - point focal can create submissions for their country
-- rationale: point focal users submit fsu data on behalf of their country
create policy "fsu_submissions_insert_point_focal"
  on public.fsu_submissions for insert
  to authenticated
  with check (
    submitted_by = auth.uid()
    and public.has_role(auth.uid(), 'point_focal')
    and country_id = public.get_user_country(auth.uid())
  );

-- policy: update - point focal can update own draft submissions
-- rationale: point focal users can edit their submissions while in draft status
-- warning: once submitted, the submission cannot be modified by the author
create policy "fsu_submissions_update_point_focal_draft"
  on public.fsu_submissions for update
  to authenticated
  using (
    submitted_by = auth.uid()
    and public.has_role(auth.uid(), 'point_focal')
    and status = 'draft'
  )
  with check (
    submitted_by = auth.uid()
    and public.has_role(auth.uid(), 'point_focal')
  );

-- policy: update - country admins can update country submissions
-- rationale: country admins need to change status during validation
create policy "fsu_submissions_update_country_admin"
  on public.fsu_submissions for update
  to authenticated
  using (
    public.has_role(auth.uid(), 'country_admin')
    and country_id = public.get_user_country(auth.uid())
  )
  with check (
    public.has_role(auth.uid(), 'country_admin')
    and country_id = public.get_user_country(auth.uid())
  );

-- policy: update - global admins can update any submission
-- rationale: global admins need full control over all submissions
create policy "fsu_submissions_update_global_admin"
  on public.fsu_submissions for update
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'))
  with check (public.has_role(auth.uid(), 'global_admin'));

-- policy: delete - point focal can delete own draft submissions
-- rationale: point focal users can discard draft submissions
-- warning: once submitted, submissions cannot be deleted (must go through rejection workflow)
create policy "fsu_submissions_delete_point_focal_draft"
  on public.fsu_submissions for delete
  to authenticated
  using (
    submitted_by = auth.uid()
    and public.has_role(auth.uid(), 'point_focal')
    and status = 'draft'
  );

-- policy: delete - global admins can delete any submission
-- rationale: global admins may need to remove test or erroneous data
create policy "fsu_submissions_delete_global_admin"
  on public.fsu_submissions for delete
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- =====================================================
-- 5. create trigger for updated_at
-- =====================================================
-- note: automatically updates the updated_at column on any modification

create trigger update_fsu_submissions_updated_at
  before update on public.fsu_submissions
  for each row execute function public.update_updated_at_column();

-- =====================================================
-- 6. enable realtime for live updates
-- =====================================================
-- note: realtime allows the frontend to receive live updates when submissions change
-- this is useful for collaborative review and dashboard views

alter publication supabase_realtime add table public.fsu_submissions;
