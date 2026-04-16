-- =====================================================
-- migration: create role_promotions table
-- =====================================================
-- purpose: track role assignment history for audit and notifications
-- affected tables: role_promotions
-- special considerations:
--   - append-only table (records should never be updated or deleted)
--   - every role assignment is logged for audit trail
-- =====================================================

-- =====================================================
-- 1. create role_promotions table
-- =====================================================
-- note: stores a complete history of all role assignments
-- used for audit trails and understanding user permission changes over time

create table public.role_promotions (
  id uuid not null default gen_random_uuid() primary key,
  -- user who received the role
  user_id uuid not null references auth.users(id),
  -- the role that was assigned (stored as text for history)
  role text not null,
  -- user who assigned this role (can be null for system-assigned roles)
  promoted_by uuid references auth.users(id),
  -- when this role assignment occurred
  created_at timestamptz not null default now()
);

-- =====================================================
-- 2. enable row level security (rls)
-- =====================================================
-- warning: rls is critical - role history is sensitive audit data

alter table public.role_promotions enable row level security;

-- =====================================================
-- 3. create indexes for performance
-- =====================================================
-- note: these indexes speed up role history queries

create index idx_role_promotions_user_id on public.role_promotions(user_id);
create index idx_role_promotions_role on public.role_promotions(role);
create index idx_role_promotions_created_at on public.role_promotions(created_at);

-- =====================================================
-- 4. create rls policies
-- =====================================================
-- note: policies are granular - one per operation per role

-- policy: select - users can view their own role history
-- rationale: users should see their own role progression
create policy "role_promotions_select_own"
  on public.role_promotions for select
  to authenticated
  using (user_id = auth.uid());

-- policy: select - country admins can view role history for users in their country
-- rationale: country admins need to understand role assignments in their jurisdiction
create policy "role_promotions_select_country_admin"
  on public.role_promotions for select
  to authenticated
  using (
    public.has_role(auth.uid(), 'country_admin')
    and public.get_user_country(user_id) is not null
    and public.get_user_country(user_id) = public.get_user_country(auth.uid())
  );

-- policy: select - global admins can view all role history
-- rationale: global admins need full visibility into all role assignments
create policy "role_promotions_select_global_admin"
  on public.role_promotions for select
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- policy: insert - system/trigger can create role promotion records
-- note: this is typically called by a trigger on user_roles
-- we allow authenticated to insert since the trigger runs as the user
create policy "role_promotions_insert_authenticated"
  on public.role_promotions for insert
  to authenticated
  with check (true);
