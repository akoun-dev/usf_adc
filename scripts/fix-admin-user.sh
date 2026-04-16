#!/bin/bash
# Fix admin user - create via SQL file instead of command line escaping issues

DB_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"

# Create a temporary SQL file
TEMP_SQL=$(mktemp)
cat > "$TEMP_SQL" << 'EOSQL'
-- Delete faulty user
BEGIN;
DELETE FROM public.user_roles WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid;
DELETE FROM public.profiles WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid;
DELETE FROM auth.users WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid;
COMMIT;

-- Create new admin user
SET session_replication_role = 'replica';

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
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{}'::jsonb,
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
);

SET session_replication_role = 'origin';

-- Create profile
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

-- Assign global_admin role
INSERT INTO public.user_roles (user_id, role)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid, 'global_admin'::public.app_role)
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify
SELECT '✅ Admin User Created' as status, id, email FROM auth.users WHERE email = 'admin@test.local';
SELECT '✅ Profile Created' as status, id, full_name FROM public.profiles WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid;
SELECT '✅ Role Assigned' as status, user_id, role FROM public.user_roles WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid;
EOSQL

echo "🔐 Fixing admin user authentication...\n"
echo "1️⃣  Deleting faulty admin user..."
echo "2️⃣  Creating new admin user with proper authentication..."
echo "💾 Executing SQL...\n"

# Execute the SQL file
psql "$DB_URL" -f "$TEMP_SQL"

# Clean up
rm "$TEMP_SQL"

echo ""
echo "=========================================="
echo "✨ Admin Account Configuration Complete!"
echo "=========================================="
echo "📧 Email: admin@test.local"
echo "🔑 Password: Admin123!"
echo "👤 Role: global_admin"
echo "=========================================="
echo ""
echo "🌐 Access the app at: http://localhost:8082"
echo "🔓 Login at: http://localhost:8082/auth/login"
echo ""
