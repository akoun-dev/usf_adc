#!/usr/bin/env node
/**
 * Create admin test user - Fixed version using proper Supabase hash format
 * Run: node scripts/fix-admin-user.js
 */

import { createClient } from "@supabase/supabase-js"
import { execSync } from "child_process"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const __projectDir = path.dirname(__dirname)

// Get from environment
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "http://127.0.0.1:54321"
const SUPABASE_KEY =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH"
const DB_URL = "postgresql://postgres:postgres@127.0.0.1:54322/postgres"

console.log("🔐 Fixing admin user authentication...\n")

// Step 1: Delete faulty user from database
console.log("1️⃣  Deleting faulty admin user...")
try {
    execSync(
        `psql "${DB_URL}" -c "
    BEGIN;
    DELETE FROM public.user_roles WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid;
    DELETE FROM public.profiles WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid;
    DELETE FROM auth.users WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid;
    COMMIT;
  "`,
        { stdio: "inherit" }
    )
    console.log("✅ Faulty user deleted\n")
} catch (error) {
    console.error("❌ Failed to delete faulty user:", error.message)
}

// Step 2: Create new user with proper hash
console.log("2️⃣  Creating new admin user with proper authentication...\n")

// Use a simpler hash format that GoTrue expects
// This is a bcrypt hash for 'Admin123!' generated with proper salt
const properHash =
    "$2a$10$pIHr8sSLeVVXVQOIEkz99.QL8zNXMx8L1qXRqQ1K/9GV8X54SWPAi"

console.log("📝 User Details:")
console.log("  Email: admin@test.local")
console.log("  Password: Admin123!")
console.log("  Role: global_admin\n")

console.log("💾 Creating in database...")

const fixSQL = `
-- Create admin user with all required fields including empty strings for token fields
SET session_replication_role = 'replica';

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, last_sign_in_at,
  confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at,
  email_change_token_new, email_change, email_change_sent_at,
  phone_change_token, phone_change, phone_change_sent_at
) VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,
  'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid,
  'authenticated', 'authenticated',
  'admin@test.local',
  '${properHash}',
  now(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Administrateur Test"}'::jsonb,
  now(), now(), now(),
  '', now(), '', now(),
  '', '', now(),
  '', '', now()
);

SET session_replication_role = 'origin';

-- Create profile
INSERT INTO public.profiles (id, full_name, country_id, language, phone, is_active, mfa_method, created_at, updated_at)
SELECT
  'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid,
  'Administrateur Test',
  (SELECT id FROM public.countries WHERE code_iso = 'ci' LIMIT 1),
  'fr', '+225000000001', true, 'email', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid);

-- Assign global_admin role  
INSERT INTO public.user_roles (user_id, role)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid, 'global_admin'::public.app_role)
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify
SELECT id, email FROM auth.users WHERE email = 'admin@test.local';
`

try {
    execSync(`echo "${fixSQL}" | psql "${DB_URL}"`, { stdio: "inherit" })
    console.log("✅ Admin user created successfully!\n")
} catch (error) {
    console.error(
        "⚠️ Warning: Creation may have partially succeeded. Error:",
        error.message
    )
}

console.log("=".repeat(50))
console.log("✨ Admin Account Ready!")
console.log("=".repeat(50))
console.log("📧 Email: admin@test.local")
console.log("🔑 Password: Admin123!")
console.log("👤 Role: global_admin")
console.log("=".repeat(50))
console.log("\n🌐 Access the app at: http://localhost:8082")
console.log("🔓 Login at: http://localhost:8082/auth/login\n")
