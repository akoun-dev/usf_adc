-- Drop table if exists to ensure clean state
drop table if exists public.forum_topics cascade;

-- Create forum_topics table
create table public.forum_topics (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  category_id uuid not null references public.forum_categories(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  is_pinned boolean default false,
  is_locked boolean default false,
  is_public boolean default true,
  views integer default 0,
  status text default 'open', -- 'open', 'closed', 'solved'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes for performance
create index idx_forum_topics_category_id on public.forum_topics(category_id);
create index idx_forum_topics_created_by on public.forum_topics(created_by);
create index idx_forum_topics_is_public on public.forum_topics(is_public);
create index idx_forum_topics_is_pinned on public.forum_topics(is_pinned);
create index idx_forum_topics_created_at on public.forum_topics(created_at);

-- Enable RLS
alter table public.forum_topics enable row level security;

-- RLS policies
create policy "public_topics_are_readable" on public.forum_topics
  for select using (is_public = true);

create policy "authenticated_can_view_all_topics" on public.forum_topics
  for select to authenticated using (true);

create policy "authenticated_can_create_topics" on public.forum_topics
  for insert to authenticated
  with check (
    auth.uid() = created_by
  );

create policy "authors_can_update_own_topics" on public.forum_topics
  for update to authenticated
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

create policy "admins_can_manage_topics" on public.forum_topics
  for all to authenticated
  using (public.has_role(auth.uid(), 'super_admin'))
  with check (public.has_role(auth.uid(), 'super_admin'));

-- Create trigger for updated_at
create trigger update_forum_topics_updated_at
  before update on public.forum_topics
  for each row execute function public.update_updated_at_column();
