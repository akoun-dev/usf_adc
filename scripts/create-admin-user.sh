#!/bin/bash
# Create admin test user directly in PostgreSQL

DB_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"

# Create the admin user via SQL
psql "$DB_URL" << 'EOF'
-- First, disable triggers temporarily to bypass auto-generation
SET session_replication_role = 'replica';

-- Create admin user (email: admin@test.local, password: Admin123!)
-- Using the bcrypt hash for 'Admin123!' generated locally
insert into auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  last_sign_in_at,
  role,
  aud
)
values (
  'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'admin@test.local',
  '$2a$10$pIHr8sSLeVVXVQOIEkz99.QL8zNXMx8L1qXRqQ1K/9GV8X54SWPAi',
  now()::timestamptz,
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"full_name": "Administrateur Test"}'::jsonb,
  now()::timestamptz,
  now()::timestamptz,
  now()::timestamptz,
  'authenticated',
  'authenticated'
)
on conflict (id) do update set email = 'admin@test.local';

-- Re-enable triggers
SET session_replication_role = 'origin';

-- Manually create admin profile without triggers
insert into public.profiles (
  id,
  full_name,
  country_id,
  language,
  phone,
  is_active,
  mfa_method,
  created_at,
  updated_at
)
values (
  'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid,
  'Administrateur Test',
  (select id from public.countries where code_iso = 'ci' limit 1),
  'fr',
  '+225000000001',
  true,
  'email',
  now()::timestamptz,
  now()::timestamptz
)
on conflict (id) do update set full_name = 'Administrateur Test';

-- Assign global_admin role
insert into public.user_roles (user_id, role)
values (
  'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid,
  'global_admin'::public.app_role
)
on conflict (user_id, role) do nothing;

-- Verify creation
select 
  u.id,
  u.email,
  p.full_name,
  r.role
from auth.users u
left join public.profiles p on u.id = p.id
left join public.user_roles r on u.id = r.user_id
where u.email = 'admin@test.local';
EOF
