#!/usr/bin/env python3
import subprocess
import os

# SQL commands to execute
sql_commands = """
BEGIN;

DO $$
DECLARE
  admin_id uuid;
BEGIN
  SELECT id INTO admin_id
  FROM auth.users
  WHERE email = 'admin@test.local'
  LIMIT 1;

  IF admin_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, full_name, language, is_active, mfa_method, created_at, updated_at)
    VALUES (admin_id, 'Administrator', 'fr', true, 'email', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET is_active = true, updated_at = NOW();

    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_id, 'global_admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    RAISE NOTICE 'Admin user % configured successfully', admin_id;
  ELSE
    RAISE EXCEPTION 'Admin user (admin@test.local) not found';
  END IF;
END $$;

COMMIT;
"""

# Environment variables
env = os.environ.copy()
env['PGPASSWORD'] = 'postgres'

try:
    result = subprocess.run(
        ['psql', '-h', '127.0.0.1', '-p', '54322',
            '-U', 'postgres', '-d', 'postgres'],
        input=sql_commands,
        text=True,
        capture_output=True,
        env=env,
        timeout=10
    )

    print("STDOUT:")
    print(result.stdout)
    if result.stderr:
        print("\nSTDERR:")
        print(result.stderr)

    print(f"\nExit code: {result.returncode}")
    if result.returncode == 0:
        print("✅ Admin setup completed successfully!")
    else:
        print("❌ Setup failed!")

except Exception as e:
    print(f"Error: {e}")
