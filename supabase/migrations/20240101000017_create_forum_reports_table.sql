-- =====================================================
-- migration: create forum moderation and workflow tables
-- =====================================================
-- purpose: support forum moderation and custom validation workflows
-- affected tables: forum_reports, validation_workflow_settings
-- special considerations:
--   - forum_reports allow users to flag inappropriate content
--   - validation_workflow_settings allow per-country workflow customization
-- =====================================================

-- =====================================================
-- 1. create forum_reports table
-- =====================================================
-- note: stores user reports of inappropriate forum content
-- moderators review reports and take action as needed

create table public.forum_reports (
  id uuid not null default gen_random_uuid() primary key,
  -- user who filed the report
  reporter_id uuid not null references auth.users(id),
  -- type of content being reported ('post' or 'topic')
  target_type text not null check (target_type in ('post', 'topic')),
  -- id of the content being reported
  target_id uuid not null,
  -- reason for the report
  reason text not null,
  -- current status of the report
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'dismissed')),
  -- moderator who reviewed this report
  reviewed_by uuid references auth.users(id),
  -- when the report was reviewed
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- =====================================================
-- 2. enable row level security (rls) on forum_reports
-- =====================================================
-- warning: rls is critical - reports contain sensitive moderation data

alter table public.forum_reports enable row level security;

-- =====================================================
-- 3. create indexes for performance
-- =====================================================
-- note: these indexes speed up moderation queue queries

create index idx_forum_reports_reporter_id on public.forum_reports(reporter_id);
create index idx_forum_reports_target on public.forum_reports(target_type, target_id);
create index idx_forum_reports_status on public.forum_reports(status);

-- =====================================================
-- 4. create rls policies for forum_reports
-- =====================================================
-- note: policies are granular - one per operation per role

-- policy: select - users can view their own reports
-- rationale: users need to see the status of reports they filed
create policy "forum_reports_select_own"
  on public.forum_reports for select
  to authenticated
  using (reporter_id = auth.uid());

-- policy: select - country admins can view reports from their country users
-- rationale: country admins moderate content from their jurisdiction
create policy "forum_reports_select_country_admin"
  on public.forum_reports for select
  to authenticated
  using (
    public.has_role(auth.uid(), 'country_admin')
    and public.get_user_country(reporter_id) = public.get_user_country(auth.uid())
  );

-- policy: select - global admins can view all reports
-- rationale: global admins need full visibility for moderation oversight
create policy "forum_reports_select_global_admin"
  on public.forum_reports for select
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- policy: insert - all authenticated users can create reports
-- rationale: any user should be able to flag inappropriate content
create policy "forum_reports_insert_authenticated"
  on public.forum_reports for insert
  to authenticated
  with check (reporter_id = auth.uid());

-- policy: update - country admins can update reports from their country
-- rationale: country admins moderate and resolve reports
create policy "forum_reports_update_country_admin"
  on public.forum_reports for update
  to authenticated
  using (
    public.has_role(auth.uid(), 'country_admin')
    and public.get_user_country(reporter_id) = public.get_user_country(auth.uid())
  )
  with check (
    public.has_role(auth.uid(), 'country_admin')
    and public.get_user_country(reporter_id) = public.get_user_country(auth.uid())
  );

-- policy: update - global admins can update any report
-- rationale: global admins have full moderation control
create policy "forum_reports_update_global_admin"
  on public.forum_reports for update
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'))
  with check (public.has_role(auth.uid(), 'global_admin'));

-- =====================================================
-- 5. create validation_workflow_settings table
-- =====================================================
-- note: allows per-country customization of the fsu validation workflow
-- for example, some countries may require 2-level approval

create table public.validation_workflow_settings (
  id uuid not null default gen_random_uuid() primary key,
  -- foreign key to countries (one setting record per country)
  country_id uuid not null unique references public.countries(id) on delete cascade,
  -- number of approval levels required (1 or 2)
  approval_levels integer not null default 1 check (approval_levels in (1, 2)),
  -- default deadline in days for submission review
  default_deadline_days integer not null default 14,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================
-- 6. enable row level security (rls) on validation_workflow_settings
-- =====================================================
-- warning: rls is required - workflow settings affect country operations

alter table public.validation_workflow_settings enable row level security;

-- =====================================================
-- 7. create rls policies for validation_workflow_settings
-- =====================================================
-- note: policies are granular - one per operation per role

-- policy: select - country admins can view their country's workflow settings
-- rationale: country admins need to know their validation requirements
create policy "validation_workflow_settings_select_country_admin"
  on public.validation_workflow_settings for select
  to authenticated
  using (
    public.has_role(auth.uid(), 'country_admin')
    and country_id = public.get_user_country(auth.uid())
  );

-- policy: select - global admins can view all workflow settings
-- rationale: global admins need full visibility for configuration oversight
create policy "validation_workflow_settings_select_global_admin"
  on public.validation_workflow_settings for select
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- policy: update - country admins can update their country's workflow settings
-- rationale: country admins can customize their validation process within limits
create policy "validation_workflow_settings_update_country_admin"
  on public.validation_workflow_settings for update
  to authenticated
  using (
    public.has_role(auth.uid(), 'country_admin')
    and country_id = public.get_user_country(auth.uid())
  )
  with check (
    public.has_role(auth.uid(), 'country_admin')
    and country_id = public.get_user_country(auth.uid())
  );

-- policy: insert - global admins can create workflow settings
-- rationale: global admins set up initial workflow configuration
create policy "validation_workflow_settings_insert_global_admin"
  on public.validation_workflow_settings for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'global_admin'));

-- policy: update - global admins can update any workflow settings
-- rationale: global admins have full control over workflow configuration
create policy "validation_workflow_settings_update_global_admin"
  on public.validation_workflow_settings for update
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'))
  with check (public.has_role(auth.uid(), 'global_admin'));

-- policy: delete - global admins can delete workflow settings
-- rationale: global admins may remove workflow settings if needed
create policy "validation_workflow_settings_delete_global_admin"
  on public.validation_workflow_settings for delete
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- =====================================================
-- 8. create trigger for updated_at
-- =====================================================
-- note: automatically updates the updated_at column on any modification

create trigger update_validation_workflow_settings_updated_at
  before update on public.validation_workflow_settings
  for each row execute function public.update_updated_at_column();
