#!/usr/bin/env node
/**
 * Create admin test user for local development
 * Run: node scripts/create-admin-user.js
 *
 * This script creates:
 * - Test admin account (email: admin@test.local, password: Admin123!)
 * - Admin profile
 * - Global admin role assignment
 */

import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error(
        "❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY"
    )
    process.exit(1)
}

// Create admin client (requires service role key for auth operations)
const supabaseAdmin = createClient(
    SUPABASE_URL,
    SERVICE_ROLE_KEY || SUPABASE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
)

const TEST_ADMIN = {
    email: "admin@test.local",
    password: "Admin123!",
    fullName: "Administrateur Test",
    phoneNumber: "+225000000001",
}

async function createAdminUser() {
    console.log("🔐 Creating test admin user...")
    console.log(`📧 Email: ${TEST_ADMIN.email}`)
    console.log(`🔑 Password: ${TEST_ADMIN.password}`)

    try {
        // 1. Create auth user
        console.log("\n1️⃣  Creating auth user...")
        const { data: authUser, error: authError } =
            await supabaseAdmin.auth.admin.createUser({
                email: TEST_ADMIN.email,
                password: TEST_ADMIN.password,
                email_confirm: true,
                user_metadata: {
                    full_name: TEST_ADMIN.fullName,
                },
            })

        if (authError) {
            console.error("❌ Auth creation failed:", authError.message)
            process.exit(1)
        }

        const userId = authUser.user.id
        console.log(`✅ Auth user created: ${userId}`)

        // 2. Get Côte d'Ivoire country
        console.log("\n2️⃣  Getting country info...")
        const { data: countries, error: countryError } = await supabaseAdmin
            .from("countries")
            .select("id")
            .eq("code_iso", "ci")
            .limit(1)

        if (countryError) {
            console.error("❌ Country lookup failed:", countryError.message)
            process.exit(1)
        }

        if (!countries || countries.length === 0) {
            console.error("❌ Country CI not found - create countries first")
            process.exit(1)
        }

        const countryId = countries[0].id
        console.log(`✅ Country found: ${countryId}`)

        // 3. Create profile
        console.log("\n3️⃣  Creating profile...")
        const { error: profileError } = await supabaseAdmin
            .from("profiles")
            .insert({
                id: userId,
                full_name: TEST_ADMIN.fullName,
                country_id: countryId,
                language: "fr",
                phone: TEST_ADMIN.phoneNumber,
                is_active: true,
                mfa_method: "email",
            })

        if (profileError) {
            console.error("❌ Profile creation failed:", profileError.message)
            process.exit(1)
        }

        console.log("✅ Profile created")

        // 4. Assign global_admin role
        console.log("\n4️⃣  Assigning global_admin role...")
        const { error: roleError } = await supabaseAdmin
            .from("user_roles")
            .insert({
                user_id: userId,
                role: "global_admin",
            })

        if (roleError && !roleError.message.includes("duplicate")) {
            console.error("❌ Role assignment failed:", roleError.message)
            process.exit(1)
        }

        console.log("✅ Global admin role assigned")

        // 5. Summary
        console.log("\n" + "=".repeat(50))
        console.log("✨ Admin user created successfully!")
        console.log("=".repeat(50))
        console.log(`📧 Email: ${TEST_ADMIN.email}`)
        console.log(`🔑 Password: ${TEST_ADMIN.password}`)
        console.log(`👤 User ID: ${userId}`)
        console.log(`🌍 Country: Côte d'Ivoire (ci)`)
        console.log(`🛡️  Role: global_admin`)
        console.log("=".repeat(50))
    } catch (error) {
        console.error("❌ Unexpected error:", error)
        process.exit(1)
    }
}

createAdminUser()
