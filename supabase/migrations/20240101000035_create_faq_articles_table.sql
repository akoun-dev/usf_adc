-- =====================================================
-- migration: create faq_articles table
-- =====================================================
-- purpose: store FAQ articles for the help center
-- affected tables: faq_articles
-- special considerations:
--   - articles can be published or unpublished (draft)
--   - sorting is controlled by sort_order within each category
--   - categories: general, account, fsu, events, documents, etc.
-- =====================================================

-- =====================================================
-- 1. create faq_articles table
-- =====================================================
-- note: this table stores FAQ articles for the help center
-- articles are organized by category and can be sorted within each category

create table public.faq_articles (
  -- primary key
  id uuid not null default gen_random_uuid() primary key,

  -- article content
  title text not null,
  content text not null,

  -- organization
  category text not null default 'general',
  sort_order integer not null default 0,

  -- publication status
  is_published boolean not null default true,

  -- timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================
-- 2. create indexes
-- =====================================================
-- note: these indexes speed up common queries

create index idx_faq_articles_category on public.faq_articles(category);
create index idx_faq_articles_is_published on public.faq_articles(is_published);
create index idx_faq_articles_category_order on public.faq_articles(category, sort_order);

-- =====================================================
-- 3. enable row level security (rls)
-- =====================================================
-- warning: rls is mandatory for all tables

alter table public.faq_articles enable row level security;

-- =====================================================
-- 4. create rls policies
-- =====================================================
-- note: public users can view published articles only
-- authenticated users with valid roles can manage articles

-- policy: select - public can view published articles
create policy "faq_articles_select_public_published"
  on public.faq_articles for select
  to anon, authenticated
  using (is_published = true);

-- policy: select - authenticated users with roles can view all articles
create policy "faq_articles_select_authenticated_all"
  on public.faq_articles for select
  to authenticated
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role in ('country_admin', 'super_admin')
    )
  );

-- policy: insert - authenticated users with admin roles can create articles
create policy "faq_articles_insert_admin"
  on public.faq_articles for insert
  to authenticated
  with check (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role in ('country_admin', 'super_admin')
    )
  );

-- policy: update - authenticated users with admin roles can update articles
create policy "faq_articles_update_admin"
  on public.faq_articles for update
  to authenticated
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role in ('country_admin', 'super_admin')
    )
  )
  with check (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role in ('country_admin', 'super_admin')
    )
  );

-- policy: delete - only super_admin can delete articles
create policy "faq_articles_delete_super_admin"
  on public.faq_articles for delete
  to authenticated
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
      and role = 'super_admin'
    )
  );

-- =====================================================
-- 5. create trigger for updated_at
-- =====================================================
-- note: automatically updates the updated_at column on any modification

create trigger update_faq_articles_updated_at
  before update on public.faq_articles
  for each row execute function public.update_updated_at_column();

-- =====================================================
-- 6. seed initial FAQ articles (optional)
-- =====================================================
-- note: these are sample articles that can be modified or deleted

insert into public.faq_articles (title, content, category, sort_order, is_published) values
  ('Comment créer un compte ?', 'Pour créer un compte, cliquez sur le bouton "S''inscrire" en haut à droite de la page. Remplissez le formulaire avec vos informations et validez votre adresse email.', 'general', 1, true),
  ('Comment réinitialiser mon mot de passe ?', 'Cliquez sur "Mot de passe oublié" sur la page de connexion. Entrez votre adresse email et suivez les instructions envoyées par email.', 'account', 1, true),
  ('Qu''est-ce qu''une soumission FSU ?', 'Une soumission FSU (Forum des Syndicats Unifiés) est un document ou une information soumise par votre syndicat pour partage et validation.', 'fsu', 1, true),
  ('Comment soumettre un document FSU ?', 'Allez dans la section FSU, cliquez sur "Nouvelle soumission", remplissez le formulaire et ajoutez vos pièces jointes.', 'fsu', 2, true);
