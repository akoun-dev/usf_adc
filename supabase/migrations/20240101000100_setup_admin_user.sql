-- Setup admin profile and role
-- This migration creates/updates the admin user profile and assigns the super_admin role

BEGIN;

-- First, get the admin user ID from auth.users
-- We'll use a DO block to handle this dynamically

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

    -- Assign super_admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_id, 'super_admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    RAISE NOTICE 'Admin user % configured successfully', admin_id;
  ELSE
    RAISE NOTICE 'Admin user (admin@test.local) not found in auth.users - skipping admin setup. Create the admin user first using one of the setup-admin scripts.';
  END IF;
END $$;

COMMIT;
