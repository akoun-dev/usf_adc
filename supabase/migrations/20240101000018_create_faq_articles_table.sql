-- =====================================================
-- migration: create faq articles table
-- =====================================================
-- purpose: store frequently asked questions and answers
-- affected tables: faq_articles
-- special considerations:
--   - articles can be organized by category
--   - is_published controls visibility to end users
-- =====================================================

-- =====================================================
-- 1. create faq_articles table
-- =====================================================
-- note: stores faq content for user self-service
-- articles can be categorized and sorted for display

create table public.faq_articles (
  id uuid not null default gen_random_uuid() primary key,
  -- article title/question
  title text not null,
  -- article content/answer
  content text not null,
  -- category for grouping related articles
  category text not null default 'general',
  -- sort order for display (lower numbers appear first)
  sort_order integer not null default 0,
  -- whether this article is visible to users
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================
-- 2. enable row level security (rls)
-- =====================================================
-- warning: rls is required - draft articles should not be visible

alter table public.faq_articles enable row level security;

-- =====================================================
-- 3. create indexes for performance
-- =====================================================
-- note: these indexes speed up faq queries

create index idx_faq_articles_category on public.faq_articles(category);
create index idx_faq_articles_is_published on public.faq_articles(is_published);
create index idx_faq_articles_sort_order on public.faq_articles(sort_order);

-- =====================================================
-- 4. create rls policies
-- =====================================================
-- note: policies are granular - one per operation per role

-- policy: select - all authenticated users can view published articles
-- rationale: faq articles are meant to be publicly accessible
create policy "faq_articles_select_published"
  on public.faq_articles for select
  to authenticated
  using (is_published = true);

-- policy: select - global admins can view all articles
-- rationale: global admins need to see draft articles
create policy "faq_articles_select_global_admin"
  on public.faq_articles for select
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- policy: insert - global admins can create articles
-- rationale: only global admins should create faq content
create policy "faq_articles_insert_global_admin"
  on public.faq_articles for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'global_admin'));

-- policy: update - global admins can update any article
-- rationale: global admins manage all faq content
create policy "faq_articles_update_global_admin"
  on public.faq_articles for update
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'))
  with check (public.has_role(auth.uid(), 'global_admin'));

-- policy: delete - global admins can delete articles
-- rationale: only global admins should remove faq content
create policy "faq_articles_delete_global_admin"
  on public.faq_articles for delete
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- =====================================================
-- 5. create trigger for updated_at
-- =====================================================
-- note: automatically updates the updated_at column on any modification

create trigger update_faq_articles_updated_at
  before update on public.faq_articles
  for each row execute function public.update_updated_at_column();
