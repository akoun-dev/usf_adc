import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config()

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function setupAdmin() {
    try {
        console.log("Setting up admin account...")

        // Get the admin user from auth.users
        const {
            data: { users },
        } = await supabase.auth.admin.listUsers()
        const adminUser = users.find(u => u.email === "admin@test.local")

        if (!adminUser) {
            console.error("Admin user not found")
            process.exit(1)
        }

        console.log(`Found admin user: ${adminUser.id}`)

        // Create or update profile
        const { error: profileError } = await supabase.from("profiles").upsert(
            {
                id: adminUser.id,
                email: "admin@test.local",
                full_name: "Administrator",
                avatar_url: null,
                language: "fr",
                is_active: true,
                country_id: null, // Will be set later if needed
                mfa_method: "email",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
        )

        if (profileError) {
            console.error("Profile error:", profileError)
            process.exit(1)
        }

        console.log("Profile created/updated")

        // Assign global_admin role
        const { error: roleError } = await supabase.from("user_roles").upsert(
            {
                user_id: adminUser.id,
                role: "global_admin",
                assigned_at: new Date().toISOString(),
            },
            { onConflict: "user_id,role" }
        )

        if (roleError) {
            console.error("Role error:", roleError)
            process.exit(1)
        }

        console.log("✅ Admin setup complete!")
        console.log(`   Email: admin@test.local`)
        console.log(`   Password: Admin123!`)
        console.log(`   Role: global_admin`)
    } catch (error) {
        console.error("Error:", error)
        process.exit(1)
    }
}

setupAdmin()
