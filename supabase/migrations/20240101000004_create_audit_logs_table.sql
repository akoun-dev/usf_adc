-- =====================================================
-- migration: create audit_logs table
-- =====================================================
-- purpose: track all important actions for compliance and security auditing
-- affected tables: audit_logs
-- special considerations:
--   - append-only table (records should never be updated or deleted)
--   - access is restricted to admins only
-- =====================================================

-- =====================================================
-- 1. create audit_logs table
-- =====================================================
-- note: this table stores an immutable log of important actions
-- it is used for compliance, security auditing, and troubleshooting

create table public.audit_logs (
  id uuid not null default gen_random_uuid() primary key,
  -- the user who performed the action (nullable for system actions)
  user_id uuid references auth.users(id),
  -- description of the action performed (e.g., 'create_submission', 'approve_submission')
  action text not null,
  -- the table that was affected (e.g., 'fsu_submissions', 'user_roles')
  target_table text,
  -- the id of the affected row
  target_id uuid,
  -- additional context data stored as jsonb
  metadata jsonb default '{}',
  -- ip address of the user (for security investigations)
  ip_address inet,
  created_at timestamptz not null default now()
);

-- =====================================================
-- 2. enable row level security (rls)
-- =====================================================
-- warning: rls is critical for this table to prevent unauthorized access to audit logs
-- audit logs contain sensitive information about all system activity

alter table public.audit_logs enable row level security;

-- =====================================================
-- 3. create indexes for performance
-- =====================================================
-- note: these indexes speed up common audit log queries

create index idx_audit_logs_user_id on public.audit_logs(user_id);
create index idx_audit_logs_action on public.audit_logs(action);
create index idx_audit_logs_target_table on public.audit_logs(target_table);
create index idx_audit_logs_created_at on public.audit_logs(created_at);

-- =====================================================
-- 4. create rls policies
-- =====================================================
-- note: policies are granular - one per operation per role
-- audit logs are sensitive, so access is restricted to admins only

-- policy: select - global admins can view all audit logs
-- rationale: global admins need full visibility into all system activity
create policy "audit_logs_select_super_admin"
  on public.audit_logs for select
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));

-- policy: select - country admins can view audit logs for their country users
-- rationale: country admins need visibility into activity within their jurisdiction
create policy "audit_logs_select_country_admin"
  on public.audit_logs for select
  to authenticated
  using (
    public.has_role(auth.uid(), 'country_admin')
    and public.get_user_country(user_id) = public.get_user_country(auth.uid())
  );

-- =====================================================
-- 5. create rls policies for insert
-- =====================================================
-- note: audit logs are typically inserted by application code or triggers
-- these policies allow admins to manually create audit entries if needed

-- policy: insert - global admins can create audit logs
-- rationale: global admins may need to create manual audit entries
create policy "audit_logs_insert_super_admin"
  on public.audit_logs for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'super_admin'));
