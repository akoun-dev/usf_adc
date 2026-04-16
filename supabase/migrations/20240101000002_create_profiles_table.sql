-- =====================================================
-- migration: create profiles table
-- =====================================================
-- purpose: store extended user profile data linked to auth.users
-- affected tables: profiles
-- special considerations:
--   - profiles are created automatically via trigger when users sign up
--   - the id references auth.users(id) and is deleted on cascade
-- =====================================================

-- =====================================================
-- 1. create profiles table
-- =====================================================
-- note: extends the auth.users table with additional profile information
-- the id is the same as auth.users(id) for a 1:1 relationship

create table public.profiles (
  -- primary key references auth.users(id)
  -- on delete cascade ensures profile is deleted when user is deleted
  id uuid not null primary key references auth.users(id) on delete cascade,
  -- user's full name (optional, may come from auth metadata)
  full_name text,
  -- url to user's avatar image (stored in storage)
  avatar_url text,
  -- foreign key to countries table (optional, users may not have a country assigned)
  country_id uuid references public.countries(id),
  -- preferred language code (default: 'fr' - french)
  language text not null default 'fr',
  -- phone number (optional, for contact purposes)
  phone text,
  -- account status flag (used for soft deletion/suspension)
  is_active boolean not null default true,
  -- telegram chat id for notifications (optional)
  telegram_chat_id text,
  -- mfa method preference (email or totp)
  mfa_method text not null default 'email',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================
-- 2. create get_user_country function
-- =====================================================
-- note: this function must exist before rls policies that use it
-- it's created after the profiles table so it can reference it

create or replace function public.get_user_country(_user_id uuid)
returns uuid
language sql stable security definer
set search_path = public
as $$
  select country_id from public.profiles
  where id = _user_id
$$;

-- =====================================================
-- 3. enable row level security (rls)
-- =====================================================
-- warning: rls is mandatory for all tables containing user data
-- without rls, any authenticated user could read/update all profiles

alter table public.profiles enable row level security;

-- =====================================================
-- 4. create indexes for performance
-- =====================================================
-- note: these indexes speed up common queries and joins

create index idx_profiles_country_id on public.profiles(country_id);
create index idx_profiles_is_active on public.profiles(is_active);
create index idx_profiles_telegram_chat_id on public.profiles(telegram_chat_id);

-- =====================================================
-- 5. create rls policies
-- =====================================================
-- note: policies are granular - one per operation per role
-- the philosophy is "default deny" with explicit allow policies

-- policy: select - users can view their own profile
-- rationale: users need to see their own profile information
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

-- policy: select - global admins can view all profiles
-- rationale: global admins need access to all user profiles for administration
create policy "profiles_select_global_admin"
  on public.profiles for select
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- policy: select - country admins can view profiles in their country
-- rationale: country admins need to see users in their country for management
create policy "profiles_select_country_admin"
  on public.profiles for select
  to authenticated
  using (
    public.has_role(auth.uid(), 'country_admin')
    and country_id = public.get_user_country(auth.uid())
  );

-- policy: insert - users can insert their own profile (on signup)
-- rationale: the handle_new_user trigger inserts the profile, so this allows it
create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid());

-- policy: update - users can update their own profile
-- rationale: users should be able to edit their own profile information
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- policy: update - country admins can update profiles in their country
-- rationale: country admins need to manage user profiles within their jurisdiction
create policy "profiles_update_country_admin"
  on public.profiles for update
  to authenticated
  using (
    public.has_role(auth.uid(), 'country_admin')
    and country_id = public.get_user_country(auth.uid())
  )
  with check (
    public.has_role(auth.uid(), 'country_admin')
    and country_id = public.get_user_country(auth.uid())
  );

-- policy: update - global admins can update any profile
-- rationale: global admins need full control over all profiles
create policy "profiles_update_global_admin"
  on public.profiles for update
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'))
  with check (public.has_role(auth.uid(), 'global_admin'));

-- =====================================================
-- 6. create trigger for updated_at
-- =====================================================
-- note: automatically updates the updated_at column on any modification

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

-- =====================================================
-- 7. create trigger function to auto-create profile on signup
-- =====================================================
-- note: this function is called by a trigger on auth.users
-- it automatically creates a profile when a new user signs up
-- this ensures every user always has a profile record

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  );
  return new;
end;
$$;

-- =====================================================
-- 8. create trigger on auth.users to call handle_new_user
-- =====================================================
-- note: this trigger fires after a new user is created in auth.users
-- it calls handle_new_user to create the corresponding profile

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================
-- 10. add country admin policies to user_roles
-- =====================================================
-- note: these policies are added after profiles table and get_user_country function exist

-- policy: select - country admins can view roles in their country
create policy "user_roles_select_country_admin"
  on public.user_roles for select
  to authenticated
  using (
    public.has_role(auth.uid(), 'country_admin')
    and public.get_user_country(user_id) = public.get_user_country(auth.uid())
  );

-- policy: insert - country admins can assign limited roles in their country
create policy "user_roles_insert_country_admin"
  on public.user_roles for insert
  to authenticated
  with check (
    -- user must have a country
    public.get_user_country(user_id) is not null
    -- user must be in the same country as the admin
    and public.get_user_country(user_id) = public.get_user_country(auth.uid())
    -- admin must be a country_admin
    and public.has_role(auth.uid(), 'country_admin')
    -- can only assign limited roles (not global_admin or country_admin)
    and role not in ('global_admin', 'country_admin')
  );

-- policy: update - country admins can update limited roles in their country
create policy "user_roles_update_country_admin"
  on public.user_roles for update
  to authenticated
  using (
    -- user must have a country
    public.get_user_country(user_id) is not null
    -- user must be in the same country as the admin
    and public.get_user_country(user_id) = public.get_user_country(auth.uid())
    -- admin must be a country_admin
    and public.has_role(auth.uid(), 'country_admin')
    -- can only modify limited roles (not global_admin or country_admin)
    and role not in ('global_admin', 'country_admin')
  )
  with check (
    -- user must have a country
    public.get_user_country(user_id) is not null
    -- user must be in the same country as the admin
    and public.get_user_country(user_id) = public.get_user_country(auth.uid())
    -- admin must be a country_admin
    and public.has_role(auth.uid(), 'country_admin')
    -- can only assign limited roles (not global_admin or country_admin)
    and role not in ('global_admin', 'country_admin')
  );

-- policy: delete - country admins can delete limited roles in their country
create policy "user_roles_delete_country_admin"
  on public.user_roles for delete
  to authenticated
  using (
    -- user must have a country
    public.get_user_country(user_id) is not null
    -- user must be in the same country as the admin
    and public.get_user_country(user_id) = public.get_user_country(auth.uid())
    -- admin must be a country_admin
    and public.has_role(auth.uid(), 'country_admin')
    -- can only delete limited roles (not global_admin or country_admin)
    and role not in ('global_admin', 'country_admin')
  );
