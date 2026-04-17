#!/bin/bash

export PGPASSWORD=postgres
export PAGER=""
cd /home/akoun-dev/Documents/PROJETS/ANSUT/Apps/usf_adc

psql \
  -h 127.0.0.1 \
  -p 54322 \
  -U postgres \
  -d postgres \
  -v ON_ERROR_STOP=1 \
  << 'SQL'
-- Setup admin profile and role
BEGIN;

DO $$
DECLARE
  admin_id uuid;
BEGIN
  -- Find the admin@test.local user
  SELECT id INTO admin_id
  FROM auth.users
  WHERE email = 'admin@test.local'
  LIMIT 1;

  IF admin_id IS NOT NULL THEN
    -- Create or update the profile
    INSERT INTO public.profiles (
      id,
      full_name,
      avatar_url,
      language,
      is_active,
      mfa_method,
      created_at,
      updated_at
    ) VALUES (
      admin_id,
      'Administrator',
      NULL,
      'fr',
      true,
      'email',
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      is_active = true,
      updated_at = NOW();

    -- Assign global_admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_id, 'global_admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    RAISE NOTICE 'Admin user % configured successfully', admin_id;
  ELSE
    RAISE EXCEPTION 'Admin user (admin@test.local) not found in auth.users';
  END IF;
END $$;

COMMIT;
SQL

echo "✅ Admin setup completed!"
