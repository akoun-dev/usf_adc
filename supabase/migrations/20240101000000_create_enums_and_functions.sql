-- =====================================================
-- migration: create enums and utility functions
-- =====================================================
-- purpose: define all custom enum types and utility functions used throughout the database
-- affected objects: types (app_role, submission_status, ticket_status, notification_type, validation_action_type)
-- special considerations: none - non-destructive
-- =====================================================

-- =====================================================
-- 1. create enum types
-- =====================================================
-- note: enums are used to enforce data integrity at the database level
-- they provide a fixed set of allowed values for specific columns

-- app_role: defines the hierarchy of user roles in the system
-- each role has increasing permissions: point_focal < country_admin < super_admin
create type public.app_role as enum ('point_focal', 'country_admin', 'super_admin');

-- submission_status: tracks the lifecycle of fsu submissions
-- workflow: draft -> submitted -> under_review -> (approved | rejected | revision_requested)
create type public.submission_status as enum ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'revision_requested');

-- ticket_status: tracks the status of support tickets
-- workflow: open -> in_progress -> resolved -> closed
create type public.ticket_status as enum ('open', 'in_progress', 'resolved', 'closed');

-- notification_type: categorizes notifications for display and filtering
create type public.notification_type as enum ('info', 'warning', 'action_required', 'system');

-- validation_action_type: defines actions that can be taken on fsu submissions during validation
create type public.validation_action_type as enum ('approve', 'reject', 'request_revision', 'comment');

-- =====================================================
-- 2. create utility function: update_updated_at_column
-- =====================================================
-- purpose: automatically update the updated_at timestamp on any table that uses this trigger
-- usage: create a trigger that calls this function before each update
-- benefit: ensures updated_at is always maintained consistently without manual intervention

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = public;

-- =====================================================
-- 3. create user_roles table
-- =====================================================
-- note: this table must exist before profiles table is created
-- manages user role assignments for role-based access control

create table public.user_roles (
  id uuid not null default gen_random_uuid() primary key,
  -- foreign key to auth.users - deleted on cascade when user is deleted
  user_id uuid not null references auth.users(id) on delete cascade,
  -- the role assigned to the user (enum type)
  role public.app_role not null,
  created_at timestamptz not null default now(),
  -- unique constraint: a user can only have each role once
  unique (user_id, role)
);

-- =====================================================
-- 4. enable row level security (rls) on user_roles
-- =====================================================
-- warning: rls is critical for this table to prevent privilege escalation

alter table public.user_roles enable row level security;

-- =====================================================
-- 5. create indexes for user_roles
-- =====================================================
-- note: these indexes are critical for rls policy performance

create index idx_user_roles_user_id on public.user_roles(user_id);
create index idx_user_roles_role on public.user_roles(role);

-- =====================================================
-- 6. create security functions (must exist before rls policies)
-- =====================================================
-- note: these functions are used in rls policies and must be created first
-- they are created after user_roles table because has_role references it

-- function: has_role - check if a user has a specific role
-- security: security definer allows the function to read from user_roles
-- rationale: used extensively in rls policies for role-based access control
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- note: get_user_country function is created in the profiles migration (00002)
-- because it references the profiles table which doesn't exist yet

-- =====================================================
-- 7. create rls policies for user_roles
-- =====================================================
-- note: policies are granular - one per operation per role
-- note: country-based policies are added in the profiles migration (00002)
-- after the get_user_country function is created

-- policy: select - users can view their own roles
create policy "user_roles_select_own"
  on public.user_roles for select
  to authenticated
  using (user_id = auth.uid());

-- policy: select - global admins can view all roles
create policy "user_roles_select_super_admin"
  on public.user_roles for select
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));

-- policy: insert - global admins can assign any role
create policy "user_roles_insert_super_admin"
  on public.user_roles for insert
  to authenticated
  with check (
    public.has_role(auth.uid(), 'super_admin')
  );

-- policy: update - global admins can update any role assignment
create policy "user_roles_update_super_admin"
  on public.user_roles for update
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'))
  with check (public.has_role(auth.uid(), 'super_admin'));

-- policy: delete - global admins can delete any role assignment
create policy "user_roles_delete_super_admin"
  on public.user_roles for delete
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));

-- note: country admin policies are added in migration 00002 after profiles table exists

-- =====================================================
-- 8. create trigger function to auto-assign default role
-- =====================================================
-- note: this function assigns the point_focal role to new users
-- this ensures every user has at least one role upon signup

create or replace function public.assign_default_role()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.user_roles (user_id, role)
  values (new.id, 'point_focal')
  on conflict (user_id, role) do nothing;
  return new;
end;
$$;
