-- =====================================================
-- migration: create news table
-- =====================================================
-- purpose: store news articles and press releases
-- affected tables: news
-- special considerations:
--   - news articles are typically public but may have targeting by role
--   - supports multi-language content
-- =====================================================

-- =====================================================
-- 1. create news table
-- =====================================================
-- note: stores news articles, press releases, and announcements
-- supports categorization and tagging

create table public.news (
  id uuid not null default gen_random_uuid() primary key,
  -- article title
  title text not null,
  -- brief summary or excerpt
  excerpt text,
  -- full article content
  content text,
  -- category for grouping (e.g., 'financement', 'partenariat', 'evenement', 'certification', 'innovation')
  category text,
  -- source attribution (e.g., 'uat', 'ansut', 'reuters')
  source text,
  -- article image url
  image_url text,
  -- when this was published
  published_at timestamptz not null default now(),
  -- whether this article is visible to public
  is_public boolean not null default true,
  -- author or creator
  author text,
  -- estimated reading time (e.g., '5 min')
  read_time text,
  -- language code (default: 'fr')
  language text not null default 'fr',
  -- created by user
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================
-- 2. enable row level security (rls)
-- =====================================================
-- warning: rls is required - news may be draft or restricted

alter table public.news enable row level security;

-- =====================================================
-- 3. create indexes for performance
-- =====================================================
-- note: these indexes speed up news queries

create index idx_news_published_at on public.news(published_at desc);
create index idx_news_category on public.news(category);
create index idx_news_is_public on public.news(is_public);
create index idx_news_language on public.news(language);

-- =====================================================
-- 4. create rls policies
-- =====================================================
-- note: policies are granular - one per operation per role

-- policy: select - authenticated users can view public news
-- rationale: news is meant to be publicly accessible
create policy "news_select_public"
  on public.news for select
  to authenticated
  using (is_public = true);

-- policy: select - global admins can view all news
-- rationale: global admins need to see draft articles
create policy "news_select_global_admin"
  on public.news for select
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- policy: insert - global admins can create news
-- rationale: only admins should publish news articles
create policy "news_insert_global_admin"
  on public.news for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and public.has_role(auth.uid(), 'global_admin')
  );

-- policy: insert - country admins can create news for their country
-- rationale: country admins can publish country-specific news
create policy "news_insert_country_admin"
  on public.news for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and public.has_role(auth.uid(), 'country_admin')
  );

-- policy: update - global admins can update any news
-- rationale: global admins have full control
create policy "news_update_global_admin"
  on public.news for update
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'))
  with check (public.has_role(auth.uid(), 'global_admin'));

-- policy: update - country admins can update news they created
-- rationale: country admins can modify their own articles
create policy "news_update_country_admin_own"
  on public.news for update
  to authenticated
  using (
    created_by = auth.uid()
    and public.has_role(auth.uid(), 'country_admin')
  )
  with check (
    created_by = auth.uid()
    and public.has_role(auth.uid(), 'country_admin')
  );

-- policy: delete - global admins can delete news
-- rationale: only global admins should delete articles
create policy "news_delete_global_admin"
  on public.news for delete
  to authenticated
  using (public.has_role(auth.uid(), 'global_admin'));

-- =====================================================
-- 5. create trigger for updated_at
-- =====================================================
-- note: automatically updates the updated_at column on any modification

create trigger update_news_updated_at
  before update on public.news
  for each row execute function public.update_updated_at_column();

-- =====================================================
-- 6. create news_tags table (for many-to-many relationship)
-- =====================================================
-- note: stores tags associated with news articles
-- allows for flexible categorization and filtering

create table public.news_tags (
  id uuid not null default gen_random_uuid() primary key,
  news_id uuid not null references public.news(id) on delete cascade,
  tag text not null,
  unique(news_id, tag)
);

-- =====================================================
-- 7. enable rls on news_tags
-- =====================================================

alter table public.news_tags enable row level security;

-- =====================================================
-- 8. create rls policies for news_tags
-- =====================================================
-- note: access to tags is derived from access to the parent news article

-- policy: select - users can view tags of news they can view
create policy "news_tags_select_from_news"
  on public.news_tags for select
  to authenticated
  using (
    exists (
      select 1 from public.news n
      where n.id = news_tags.news_id
        and (n.is_public = true or public.has_role(auth.uid(), 'global_admin'))
    )
  );

-- policy: insert - admins can insert tags for news they can modify
create policy "news_tags_insert_admins"
  on public.news_tags for insert
  to authenticated
  with check (
    exists (
      select 1 from public.news n
      where n.id = news_tags.news_id
        and (
          (n.created_by = auth.uid() and public.has_role(auth.uid(), 'country_admin'))
          or public.has_role(auth.uid(), 'global_admin')
        )
    )
  );

-- policy: delete - admins can delete tags from news they can modify
create policy "news_tags_delete_admins"
  on public.news_tags for delete
  to authenticated
  using (
    exists (
      select 1 from public.news n
      where n.id = news_tags.news_id
        and (
          (n.created_by = auth.uid() and public.has_role(auth.uid(), 'country_admin'))
          or public.has_role(auth.uid(), 'global_admin')
        )
    )
  );
