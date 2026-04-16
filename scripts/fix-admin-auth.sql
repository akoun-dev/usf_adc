-- Fix admin user authentication issue
-- This script should be run via psql directly

-- 1. Delete the faulty admin user
DELETE FROM public.user_roles WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid;
DELETE FROM public.profiles WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid;
DELETE FROM auth.users WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid;

-- 2. Create a new admin user with a simpler password setup
-- For testing in local dev, we'll use the auth system's own hash function
-- First disable triggers to create user without auto- signup flows
SET session_replication_role = 'replica';

-- 3. Get Côte d'Ivoire country ID
-- This will be used in the profile creation steps

-- 4. Create new admin auth user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  last_sign_in_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  phone_change_token,
  phone_change,
  phone_change_sent_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid,
  'authenticated',
  'authenticated',
  'admin@test.local',
  '$2a$10$pIHr8sSLeVVXVQOIEkz99.QL8zNXMx8L1qXRqQ1K/9GV8X54SWPAi',
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Administrateur Test"}'::jsonb,
  now(),
  now(),
  now(),
  '',
  now(),
  '',
  now(),
  '',
  '',
  now(),
  '',
  '',
  now()
)
ON CONFLICT (id) DO NOTHING;

-- 5. Re-enable triggers
SET session_replication_role = 'origin';

-- 6. Create profile
INSERT INTO public.profiles (
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
SELECT
  'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid,
  'Administrateur Test',
  (SELECT id FROM public.countries WHERE code_iso = 'ci' LIMIT 1),
  'fr',
  '+225000000001',
  true,
  'email',
  now(),
  now()
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid);

-- 7. Assign global_admin role
INSERT INTO public.user_roles (user_id, role)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid, 'global_admin'::public.app_role)
ON CONFLICT (user_id, role) DO NOTHING;

-- 8. Verify
SELECT id, email, email_confirmed_at FROM auth.users WHERE email = 'admin@test.local';
SELECT id, full_name, country_id FROM public.profiles WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid;
SELECT user_id, role FROM public.user_roles WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid;
