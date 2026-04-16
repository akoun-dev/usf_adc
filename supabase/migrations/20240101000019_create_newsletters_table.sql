-- =====================================================
-- migration: create newsletters table
-- =====================================================
-- purpose: store newsletters and announcements for targeted distribution
-- affected tables: newsletters
-- special considerations:
--   - target_roles is an array allowing multi-role targeting
--   - is_published controls visibility to end users
-- =====================================================

-- =====================================================
-- 1. create newsletters table
-- =====================================================
-- note: stores newsletters and platform announcements
-- can be targeted to specific user roles for relevance

create table public.newsletters (
  id uuid not null default gen_random_uuid() primary key,
  -- newsletter title
  title text not null,
  -- brief summary or excerpt
  summary text,
  -- full newsletter content
  content text not null,
  -- which roles should see this newsletter (array for multi-targeting)
  target_roles public.app_role[] not null default '{point_focal,country_admin,global_admin}',
  -- whether this newsletter is visible to users
  is_published boolean not null default false,
  -- when this newsletter was published
  published_at timestamptz,
  -- whether email notifications have been sent
  email_sent boolean not null default false,
  -- user who created this newsletter
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================
-- 2. enable row level security (rls)
-- =====================================================
-- warning: rls is critical - draft newsletters should not be visible

alter table public.newsletters enable row level security;

-- =====================================================
-- 3. create indexes for performance
-- =====================================================
-- note: these indexes speed up newsletter queries

create index idx_newsletters_is_published on public.newsletters(is_published);
create index idx_newsletters_published_at on public.newsletters(published_at);

-- =====================================================
-- 4. create rls policies
-- =====================================================
-- note: policies are granular - one per operation per role
-- importantly, users can only see newsletters targeted at their roles

-- policy: select - users can view published newsletters targeting their roles
-- rationale: newsletters are role-targeted communications
create policy "newsletters_select_targeted"
  on public.newsletters for select
  to authenticated
  using (
    is_published = true
    and exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid()
        and ur.role = any(target_roles)
    )
  );

-- policy: select - global admins can view all newsletters
-- rationale: global admins need to see draft newsletters
create policy "newsletters_select_global_admin"
  on public.newsletters for select
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- policy: insert - global admins can create newsletters
-- rationale: only global admins should create newsletters
create policy "newsletters_insert_global_admin"
  on public.newsletters for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and public.has_role(auth.uid(), 'global_admin')
  );

-- policy: update - global admins can update any newsletter
-- rationale: global admins manage all newsletter content
create policy "newsletters_update_global_admin"
  on public.newsletters for update
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'))
  with check (public.has_role(auth.uid(), 'global_admin'));

-- policy: delete - global admins can delete newsletters
-- rationale: only global admins should remove newsletters
create policy "newsletters_delete_global_admin"
  on public.newsletters for delete
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- =====================================================
-- 5. create trigger for updated_at
-- =====================================================
-- note: automatically updates the updated_at column on any modification

create trigger update_newsletters_updated_at
  before update on public.newsletters
  for each row execute function public.update_updated_at_column();
