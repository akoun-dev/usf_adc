-- =====================================================
-- migration: create invitations table
-- =====================================================
-- purpose: manage user invitations for role-based onboarding
-- affected tables: invitations
-- special considerations:
--   - invitations contain tokens that must be kept secure
--   - expired invitations should be cleaned up periodically
-- =====================================================

-- =====================================================
-- 1. create invitation_status enum
-- =====================================================
-- note: defines the lifecycle states of an invitation

create type public.invitation_status as enum ('pending', 'accepted', 'expired', 'cancelled');

-- =====================================================
-- 2. create invitations table
-- =====================================================
-- note: stores invitations sent to potential users
-- invitations can include a country assignment and a pre-configured role

create table public.invitations (
  id uuid not null default gen_random_uuid() primary key,
  -- email address of the invitee
  email text not null,
  -- role that will be assigned when invitation is accepted
  role public.app_role not null,
  -- optional country to assign to the user
  country_id uuid references public.countries(id),
  -- unique token for invitation acceptance (used in signup flow)
  token uuid not null default gen_random_uuid() unique,
  -- when the invitation expires (default: 48 hours from creation)
  expires_at timestamptz not null default (now() + interval '48 hours'),
  -- current status of the invitation
  status public.invitation_status not null default 'pending',
  -- user who created this invitation
  invited_by uuid not null references auth.users(id),
  -- when the invitation was accepted
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================
-- 3. enable row level security (rls)
-- =====================================================
-- warning: rls is critical - invitations contain sensitive tokens

alter table public.invitations enable row level security;

-- =====================================================
-- 4. create indexes for performance
-- =====================================================
-- note: these indexes speed up invitation lookups and validation

create index idx_invitations_email on public.invitations(email);
create index idx_invitations_token on public.invitations(token);
create index idx_invitations_status on public.invitations(status);
create index idx_invitations_expires_at on public.invitations(expires_at);

-- =====================================================
-- 5. create rls policies
-- =====================================================
-- note: policies are granular - one per operation per role

-- policy: select - global admins can view all invitations
-- rationale: global admins need full visibility into invitations
create policy "invitations_select_global_admin"
  on public.invitations for select
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- policy: select - country admins can view invitations for their country
-- rationale: country admins need to see invitations they sent
create policy "invitations_select_country_admin"
  on public.invitations for select
  to authenticated
  using (
    public.has_role(auth.uid(), 'country_admin')
    and country_id = public.get_user_country(auth.uid())
  );

-- policy: insert - global admins can create invitations for any role/country
-- rationale: global admins can invite anyone with any role
create policy "invitations_insert_global_admin"
  on public.invitations for insert
  to authenticated
  with check (
    invited_by = auth.uid()
    and public.has_role(auth.uid(), 'global_admin')
  );

-- policy: insert - country admins can create limited invitations for their country
-- rationale: country admins can invite point_focal users
-- warning: country admins cannot invite other admins (privilege escalation protection)
create policy "invitations_insert_country_admin"
  on public.invitations for insert
  to authenticated
  with check (
    invited_by = auth.uid()
    and public.has_role(auth.uid(), 'country_admin')
    and country_id = public.get_user_country(auth.uid())
    and role in ('point_focal')
  );

-- policy: update - global admins can update any invitation
-- rationale: global admins have full control over invitations
create policy "invitations_update_global_admin"
  on public.invitations for update
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'))
  with check (public.has_role(auth.uid(), 'global_admin'));

-- policy: delete - global admins can delete invitations
-- rationale: global admins may need to revoke invitations
create policy "invitations_delete_global_admin"
  on public.invitations for delete
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- =====================================================
-- 6. create trigger for updated_at
-- =====================================================
-- note: automatically updates the updated_at column on any modification

create trigger update_invitations_updated_at
  before update on public.invitations
  for each row execute function public.update_updated_at_column();

-- =====================================================
-- 7. create function to accept invitation
-- =====================================================
-- note: this function is called during the signup flow
-- it assigns the role and optionally the country from the invitation

create or replace function public.accept_invitation(_token uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  _invitation record;
  _user_id uuid;
begin
  -- get the authenticated user id
  _user_id := auth.uid();
  if _user_id is null then
    return jsonb_build_object('success', false, 'error', 'not authenticated');
  end if;

  -- find the invitation
  select * into _invitation from public.invitations
  where token = _token
    and status = 'pending'
    and expires_at > now();

  if _invitation is null then
    return jsonb_build_object('success', false, 'error', 'invalid or expired invitation');
  end if;

  -- assign the role to the user
  insert into public.user_roles (user_id, role)
  values (_user_id, _invitation.role)
  on conflict (user_id, role) do nothing;

  -- set country if provided in invitation
  if _invitation.country_id is not null then
    update public.profiles
    set country_id = _invitation.country_id
    where id = _user_id;
  end if;

  -- mark invitation as accepted
  update public.invitations
  set status = 'accepted', accepted_at = now()
  where id = _invitation.id;

  return jsonb_build_object('success', true, 'role', _invitation.role::text);
end;
$$;
