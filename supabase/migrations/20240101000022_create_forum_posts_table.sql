-- Drop table if exists to ensure clean state
drop table if exists public.forum_posts cascade;

-- Create forum_posts table
create table public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.forum_topics(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  content text not null,
  is_solution boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes for performance
create index idx_forum_posts_topic_id on public.forum_posts(topic_id);
create index idx_forum_posts_created_by on public.forum_posts(created_by);
create index idx_forum_posts_is_solution on public.forum_posts(is_solution);
create index idx_forum_posts_created_at on public.forum_posts(created_at);

-- Enable RLS
alter table public.forum_posts enable row level security;

-- RLS policies
create policy "public_posts_are_readable" on public.forum_posts
  for select using (
    exists (
      select 1 from public.forum_topics
      where id = forum_posts.topic_id and is_public = true
    )
  );

create policy "authenticated_can_view_topic_posts" on public.forum_posts
  for select to authenticated using (true);

create policy "authenticated_can_post" on public.forum_posts
  for insert to authenticated
  with check (
    auth.uid() = created_by
  );

create policy "authors_can_update_own_posts" on public.forum_posts
  for update to authenticated
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

create policy "topic_authors_can_mark_solution" on public.forum_posts
  for update to authenticated
  using (
    exists (
      select 1 from public.forum_topics t
      where t.id = forum_posts.topic_id and t.created_by = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.forum_topics t
      where t.id = forum_posts.topic_id and t.created_by = auth.uid()
    )
  );

create policy "admins_can_manage_posts" on public.forum_posts
  for all to authenticated
  using (public.has_role(auth.uid(), 'global_admin'))
  with check (public.has_role(auth.uid(), 'global_admin'));

-- Create trigger for updated_at
create trigger update_forum_posts_updated_at
  before update on public.forum_posts
  for each row execute function public.update_updated_at_column();
