-- =====================================================
-- migration: create mfa (multi-factor authentication) tables
-- =====================================================
-- purpose: support multi-factor authentication for enhanced security
-- affected tables: mfa_challenges
-- special considerations:
--   - codes are short-lived and should be cleaned up after expiration
--   - verified_at timestamp tracks completed challenges
-- =====================================================

-- =====================================================
-- 1. add mfa_method column to profiles
-- =====================================================
-- note: stores user's preferred mfa method (email, totp, etc.)
-- this column was added in a separate migration, now included here

alter table public.profiles add column if not exists mfa_method text not null default 'email';

-- =====================================================
-- 2. create mfa_challenges table
-- =====================================================
-- note: stores mfa codes sent to users for verification
-- codes are short-lived (5 minutes) and single-use

create table public.mfa_challenges (
  id uuid not null default gen_random_uuid() primary key,
  -- user who is attempting to authenticate
  user_id uuid not null references auth.users(id),
  -- the verification code (6 digits for email, longer for backup codes)
  code text not null,
  -- method used to send the code (email, sms, totp)
  method text not null default 'email',
  -- when this code expires
  expires_at timestamptz not null default (now() + interval '5 minutes'),
  -- when this code was successfully verified
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

-- =====================================================
-- 3. enable row level security (rls)
-- =====================================================
-- warning: rls is critical - mfa codes must not be visible to other users

alter table public.mfa_challenges enable row level security;

-- =====================================================
-- 4. create indexes for performance
-- =====================================================
-- note: these indexes speed up challenge lookups and cleanup

create index idx_mfa_challenges_user_id on public.mfa_challenges(user_id);
create index idx_mfa_challenges_expires_at on public.mfa_challenges(expires_at);

-- =====================================================
-- 5. create rls policies
-- =====================================================
-- note: policies are granular - one per operation per role

-- policy: select - users can view their own challenges
-- rationale: users need to access their own mfa codes
create policy "mfa_challenges_select_own"
  on public.mfa_challenges for select
  to authenticated
  using (user_id = auth.uid());

-- policy: insert - users can create their own challenges
-- rationale: users initiate mfa by requesting a code
create policy "mfa_challenges_insert_own"
  on public.mfa_challenges for insert
  to authenticated
  with check (user_id = auth.uid());

-- policy: update - users can update their own challenges (for verification)
-- rationale: verification is done by updating verified_at
create policy "mfa_challenges_update_own"
  on public.mfa_challenges for update
  to authenticated
  using (user_id = auth.uid());

-- policy: delete - users can delete their own challenges
-- rationale: cleanup is done after successful verification
create policy "mfa_challenges_delete_own"
  on public.mfa_challenges for delete
  to authenticated
  using (user_id = auth.uid());

-- =====================================================
-- 6. create function to generate mfa code
-- =====================================================
-- note: generates a random 6-digit code
-- invalidates any previous pending codes for the user

create or replace function public.generate_mfa_code(_user_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  _code text;
begin
  -- generate a random 6-digit code
  _code := lpad(floor(random() * 1000000)::text, 6, '0');

  -- invalidate previous pending codes (security: prevent code reuse)
  delete from public.mfa_challenges
  where user_id = _user_id and verified_at is null;

  -- insert the new code
  insert into public.mfa_challenges (user_id, code, method)
  values (
    _user_id,
    _code,
    coalesce(
      (select mfa_method from public.profiles where id = _user_id),
      'email'
    )
  );

  return _code;
end;
$$;

-- =====================================================
-- 7. create function to verify mfa code
-- =====================================================
-- note: verifies a code against the most recent unverified challenge
-- marks the challenge as verified if the code matches

create or replace function public.verify_mfa_code(_user_id uuid, _code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  _challenge record;
begin
  -- find the most recent unverified challenge
  select * into _challenge from public.mfa_challenges
  where user_id = _user_id
    and code = _code
    and verified_at is null
    and expires_at > now()
  order by created_at desc
  limit 1;

  if _challenge is null then
    return false;
  end if;

  -- mark the challenge as verified
  update public.mfa_challenges
  set verified_at = now()
  where id = _challenge.id;

  return true;
end;
$$;
