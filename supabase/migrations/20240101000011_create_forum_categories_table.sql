-- =====================================================
-- migration: create forum tables
-- =====================================================
-- purpose: create forum categories, topics, and posts for discussions
-- affected tables: forum_categories, forum_topics, forum_posts
-- special considerations:
--   - forum supports both public and private topics
--   - topics and posts can be pinned/locked for moderation
-- =====================================================

-- =====================================================
-- 1. create forum_categories table
-- =====================================================
-- note: categories organize discussions by topic area
-- examples: 'connectivite', 'financement', 'reglementation', 'general'

create table public.forum_categories (
  id uuid not null default gen_random_uuid() primary key,
  -- category display name
  name text not null,
  -- category description
  description text,
  -- url-friendly slug (unique identifier)
  slug text unique not null,
  -- sort order for display (lower numbers appear first)
  sort_order integer default 0,
  -- icon emoji for the category
  icon text,
  -- color class for the category (e.g., 'bg-blue-500')
  color text,
  created_at timestamptz default now()
);

-- =====================================================
-- 2. enable row level security (rls) on forum_categories
-- =====================================================
-- warning: rls is required for all tables

alter table public.forum_categories enable row level security;

-- =====================================================
-- 3. create rls policies for forum_categories
-- =====================================================
-- note: categories are reference data that all authenticated users can read

-- policy: select - all authenticated users can view categories
-- rationale: categories are needed for forum navigation
create policy "forum_categories_select_authenticated"
  on public.forum_categories for select
  to authenticated
  using (true);

-- =====================================================
-- 4. create forum_topics table
-- =====================================================
-- note: topics are individual discussion threads within categories

create table public.forum_topics (
  id uuid not null default gen_random_uuid() primary key,
  -- topic title
  title text not null,
  -- topic content (first post)
  content text not null,
  -- optional category (topics can exist without a category)
  category_id uuid references public.forum_categories(id),
  -- user who created this topic (references profiles, not auth.users)
  created_by uuid not null references public.profiles(id),
  -- whether this topic is pinned to the top of the list
  is_pinned boolean default false,
  -- whether this topic is locked (no new replies allowed)
  is_locked boolean default false,
  -- whether this topic is visible to public users (read-only)
  is_public boolean default true,
  -- number of times the topic has been viewed
  views integer not null default 0,
  -- status for additional tracking (optional)
  status text,
  -- tags associated with the topic (stored as array)
  tags text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================
-- 5. enable row level security (rls) on forum_topics
-- =====================================================
-- warning: rls is critical - topics may contain sensitive discussions

alter table public.forum_topics enable row level security;

-- =====================================================
-- 6. create rls policies for forum_topics
-- =====================================================
-- note: policies respect the is_public flag for access control

-- policy: select - users can view public topics or their own topics
-- rationale: public topics are visible to all authenticated users
create policy "forum_topics_select_authenticated"
  on public.forum_topics for select
  to authenticated
  using (
    is_public = true
    or created_by = auth.uid()
    or public.has_role(auth.uid(), 'global_admin')
    or public.has_role(auth.uid(), 'country_admin')
  );

-- policy: insert - point focal and above can create topics
-- rationale: only users with elevated roles can start discussions
create policy "forum_topics_insert_authorized"
  on public.forum_topics for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and (
      public.has_role(auth.uid(), 'point_focal')
      or public.has_role(auth.uid(), 'country_admin')
      or public.has_role(auth.uid(), 'global_admin')
    )
  );

-- policy: update - authors can update their own topics
-- rationale: users should be able to edit their own discussions
create policy "forum_topics_update_author"
  on public.forum_topics for update
  to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

-- policy: update - global admins can update any topic
-- rationale: global admins need moderation capabilities
create policy "forum_topics_update_global_admin"
  on public.forum_topics for update
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'))
  with check (public.has_role(auth.uid(), 'global_admin'));

-- policy: delete - authors can delete their own topics
-- rationale: users should be able to remove their own discussions
create policy "forum_topics_delete_author"
  on public.forum_topics for delete
  to authenticated
  using (created_by = auth.uid());

-- policy: delete - global admins can delete any topic
-- rationale: global admins need moderation capabilities
create policy "forum_topics_delete_global_admin"
  on public.forum_topics for delete
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- =====================================================
-- 7. create forum_posts table
-- =====================================================
-- note: posts are replies to topics (the initial post content is stored in the topic)

create table public.forum_posts (
  id uuid not null default gen_random_uuid() primary key,
  -- foreign key to forum_topics - deleted on cascade
  topic_id uuid not null references public.forum_topics(id) on delete cascade,
  -- post content
  content text not null,
  -- user who wrote this post (references profiles, not auth.users)
  author_id uuid not null references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================
-- 8. enable row level security (rls) on forum_posts
-- =====================================================
-- warning: rls is critical - posts may contain sensitive discussions

alter table public.forum_posts enable row level security;

-- =====================================================
-- 9. create rls policies for forum_posts
-- =====================================================
-- note: access to posts is derived from access to the parent topic

-- policy: select - all authenticated users can view posts
-- rationale: posts are needed to read forum discussions
create policy "forum_posts_select_authenticated"
  on public.forum_posts for select
  to authenticated
  using (true);

-- policy: insert - all authenticated users can create posts
-- rationale: any authenticated user can participate in discussions
create policy "forum_posts_insert_authenticated"
  on public.forum_posts for insert
  to authenticated
  with check (author_id = auth.uid());

-- policy: update - authors can update their own posts
-- rationale: users should be able to edit their own replies
create policy "forum_posts_update_author"
  on public.forum_posts for update
  to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

-- policy: update - global admins can update any post
-- rationale: global admins need moderation capabilities
create policy "forum_posts_update_global_admin"
  on public.forum_posts for update
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'))
  with check (public.has_role(auth.uid(), 'global_admin'));

-- policy: delete - authors can delete their own posts
-- rationale: users should be able to remove their own replies
create policy "forum_posts_delete_author"
  on public.forum_posts for delete
  to authenticated
  using (author_id = auth.uid());

-- policy: delete - global admins can delete any post
-- rationale: global admins need moderation capabilities
create policy "forum_posts_delete_global_admin"
  on public.forum_posts for delete
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- =====================================================
-- 10. create triggers for updated_at
-- =====================================================
-- note: automatically updates the updated_at column on any modification

create trigger update_forum_topics_updated_at
  before update on public.forum_topics
  for each row execute function public.update_updated_at_column();

create trigger update_forum_posts_updated_at
  before update on public.forum_posts
  for each row execute function public.update_updated_at_column();

-- =====================================================
-- 11. enable realtime for live updates
-- =====================================================
-- note: realtime allows the frontend to receive live updates when new posts are made
-- this is useful for showing live forum activity

alter publication supabase_realtime add table public.forum_topics;
alter publication supabase_realtime add table public.forum_posts;

-- =====================================================
-- 12. insert demo category data
-- =====================================================
-- note: these demo categories are used for development and testing

insert into public.forum_categories (name, description, slug, sort_order) values
  ('Connectivité', 'Discussions sur les infrastructures de connectivité et accès Internet', 'connectivite', 1),
  ('Financement', 'Échanges sur les mécanismes de financement et budgets', 'financement', 2),
  ('Réglementation', 'Cadre réglementaire et politiques numériques', 'reglementation', 3),
  ('Général', 'Discussions générales et sujets divers', 'general', 4);

-- =====================================================
-- 13. create forum_topic_tags table (for many-to-many relationship)
-- =====================================================
-- note: stores tags associated with forum topics
-- this is a more flexible approach than storing tags as an array

create table public.forum_topic_tags (
  id uuid not null default gen_random_uuid() primary key,
  topic_id uuid not null references public.forum_topics(id) on delete cascade,
  tag text not null,
  unique(topic_id, tag)
);

-- =====================================================
-- 14. enable rls on forum_topic_tags
-- =====================================================

alter table public.forum_topic_tags enable row level security;

-- =====================================================
-- 15. create rls policies for forum_topic_tags
-- =====================================================
-- note: access to tags is derived from access to the parent topic

-- policy: select - users can view tags of topics they can access
create policy "forum_topic_tags_select_from_topics"
  on public.forum_topic_tags for select
  to authenticated
  using (
    exists (
      select 1 from public.forum_topics t
      where t.id = forum_topic_tags.topic_id
        and (
          t.is_public = true
          or t.created_by = auth.uid()
          or public.has_role(auth.uid(), 'global_admin')
          or public.has_role(auth.uid(), 'country_admin')
        )
    )
  );

-- policy: insert - users can insert tags for topics they created
create policy "forum_topic_tags_insert_owners"
  on public.forum_topic_tags for insert
  to authenticated
  with check (
    exists (
      select 1 from public.forum_topics t
      where t.id = forum_topic_tags.topic_id
        and t.created_by = auth.uid()
    )
  );

-- policy: delete - topic authors can delete their topic tags
create policy "forum_topic_tags_delete_owners"
  on public.forum_topic_tags for delete
  to authenticated
  using (
    exists (
      select 1 from public.forum_topics t
      where t.id = forum_topic_tags.topic_id
        and t.created_by = auth.uid()
    )
  );

-- policy: delete - global admins can delete any topic tags
create policy "forum_topic_tags_delete_global_admin"
  on public.forum_topic_tags for delete
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- =====================================================
-- 16. add public read access policies (anon users)
-- =====================================================
-- note: anonymous users can read public forum content

-- policy: select - anon users can view categories
create policy "forum_categories_select_anon"
  on public.forum_categories for select
  to anon
  using (true);

-- policy: select - anon users can view public topics
create policy "forum_topics_select_anon"
  on public.forum_topics for select
  to anon
  using (is_public = true);

-- policy: select - anon users can view posts in public topics
create policy "forum_posts_select_anon"
  on public.forum_posts for select
  to anon
  using (
    exists (
      select 1 from public.forum_topics t
      where t.id = forum_posts.topic_id
        and t.is_public = true
    )
  );

-- policy: select - anon users can view tags of public topics
create policy "forum_topic_tags_select_anon"
  on public.forum_topic_tags for select
  to anon
  using (
    exists (
      select 1 from public.forum_topics t
      where t.id = forum_topic_tags.topic_id
        and t.is_public = true
    )
  );

-- =====================================================
-- 17. create view counter function
-- =====================================================
-- note: function to increment topic views counter

create or replace function increment_forum_topic_views(topic_id uuid)
returns void as $$
begin
  update public.forum_topics
  set views = views + 1
  where id = topic_id;
end;
$$ language plpgsql security definer;

-- grant execute on view counter function
grant execute on function public.increment_forum_topic_views to authenticated;
grant execute on function public.increment_forum_topic_views to anon;
