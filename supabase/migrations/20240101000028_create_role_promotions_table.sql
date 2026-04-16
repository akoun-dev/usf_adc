-- =====================================================
-- migration: create role_promotions table
-- =====================================================
-- purpose: audit trail for role assignments
-- affected objects: role_promotions table
-- =====================================================

create table public.role_promotions (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now()
);

create index idx_role_promotions_user_id on public.role_promotions(user_id);
create index idx_role_promotions_created_at on public.role_promotions(created_at desc);
