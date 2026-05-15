-- =====================================================
-- migration: create newsletter_subscribers table
-- =====================================================
-- purpose: store visitor emails for newsletter subscription
-- =====================================================

create table public.newsletter_subscribers (
  id uuid not null default gen_random_uuid() primary key,
  email text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- enable rls
alter table public.newsletter_subscribers enable row level security;

-- policies
-- allow anyone to insert (public subscription)
create policy "allow_public_insert"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (true);

-- allow super_admin to read and manage
create policy "allow_admin_manage"
  on public.newsletter_subscribers for all
  to authenticated
  using (public.has_role(auth.uid(), 'super_admin'));

-- trigger for updated_at
create trigger update_newsletter_subscribers_updated_at
  before update on public.newsletter_subscribers
  for each row execute function public.update_updated_at_column();
