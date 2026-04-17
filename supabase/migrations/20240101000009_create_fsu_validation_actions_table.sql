-- =====================================================
-- migration: create fsu_validation_actions table
-- =====================================================
-- purpose: track validation actions taken on fsu submissions
-- affected tables: fsu_validation_actions
-- special considerations:
--   - append-only table (validation actions are immutable)
--   - records the complete audit trail of the validation process
-- =====================================================

-- =====================================================
-- 1. create fsu_validation_actions table
-- =====================================================
-- note: this table records every action taken during the validation workflow
-- it provides a complete audit trail of who did what and when

create table public.fsu_validation_actions (
  id uuid not null default gen_random_uuid() primary key,
  -- foreign key to fsu_submissions - deleted on cascade
  submission_id uuid not null references public.fsu_submissions(id) on delete cascade,
  -- the type of action taken (approve, reject, request_revision, comment)
  action public.validation_action_type not null,
  -- optional comment explaining the action or providing feedback
  comment text,
  -- the user who performed this action
  performed_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

-- =====================================================
-- 2. enable row level security (rls)
-- =====================================================
-- warning: rls is critical - validation actions contain sensitive decision data
-- without proper rls, users could access validation decisions from other countries

alter table public.fsu_validation_actions enable row level security;

-- =====================================================
-- 3. create indexes for performance
-- =====================================================
-- note: these indexes speed up validation history queries

create index idx_fsu_validation_actions_submission_id on public.fsu_validation_actions(submission_id);
create index idx_fsu_validation_actions_performed_by on public.fsu_validation_actions(performed_by);
create index idx_fsu_validation_actions_action on public.fsu_validation_actions(action);

-- =====================================================
-- 4. create rls policies
-- =====================================================
-- note: policies are granular - one per operation per role
-- access to validation actions is derived from access to the parent submission

-- policy: select - submission authors can view actions on their submissions
-- rationale: point focal users need to see the validation history of their submissions
create policy "fsu_validation_actions_select_author"
  on public.fsu_validation_actions for select
  to authenticated
  using (
    exists (
      select 1 from public.fsu_submissions s
      where s.id = fsu_validation_actions.submission_id
        and s.submitted_by = auth.uid()
    )
  );

-- policy: select - country admins can view actions on country submissions
-- rationale: country admins need to see the validation history they performed
create policy "fsu_validation_actions_select_country_admin"
  on public.fsu_validation_actions for select
  to authenticated
  using (
    exists (
      select 1 from public.fsu_submissions s
      where s.id = fsu_validation_actions.submission_id
        and public.has_role(auth.uid(), 'country_admin')
        and s.country_id = public.get_user_country(auth.uid())
    )
  );

-- policy: select - global admins can view all actions
-- rationale: global admins need full visibility into all validation activity
create policy "fsu_validation_actions_select_super_admin"
  on public.fsu_validation_actions for select
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));

-- policy: insert - country admins can create validation actions for country submissions
-- rationale: country admins perform validation actions on submissions from their country
create policy "fsu_validation_actions_insert_country_admin"
  on public.fsu_validation_actions for insert
  to authenticated
  with check (
    performed_by = auth.uid()
    and public.has_role(auth.uid(), 'country_admin')
    and exists (
      select 1 from public.fsu_submissions s
      where s.id = fsu_validation_actions.submission_id
        and s.country_id = public.get_user_country(auth.uid())
    )
  );

-- policy: insert - global admins can create validation actions for any submission
-- rationale: global admins may perform validation actions on any submission
create policy "fsu_validation_actions_insert_super_admin"
  on public.fsu_validation_actions for insert
  to authenticated
  with check (
    performed_by = auth.uid()
    and public.has_role(auth.uid(), 'super_admin')
  );

-- =====================================================
-- 5. enable realtime for live updates
-- =====================================================
-- note: realtime allows the frontend to receive live updates when validation actions occur
-- this is useful for showing the validation progress to submission authors

alter publication supabase_realtime add table public.fsu_validation_actions;
