import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.6"

export default async (req: Request) => {
    if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: { "Content-Type": "application/json" },
        })
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    try {
        // Find admin user
        const {
            data: { users },
            error: listError,
        } = await supabase.auth.admin.listUsers()
        if (listError)
            throw new Error(`Failed to list users: ${listError.message}`)

        const adminUser = users?.find(u => u.email === "admin@test.local")
        if (!adminUser)
            throw new Error("Admin user (admin@test.local) not found")

        // Create profile
        const { error: profileError } = await supabase.from("profiles").upsert(
            {
                id: adminUser.id,
                full_name: "Administrator",
                language: "fr",
                is_active: true,
                mfa_method: "email",
            },
            { onConflict: "id" }
        )

        if (profileError)
            throw new Error(`Profile error: ${profileError.message}`)

        // Assign role
        const { error: roleError } = await supabase.from("user_roles").insert({
            user_id: adminUser.id,
            role: "super_admin",
        })

        if (roleError && !roleError.message.includes("duplicate")) {
            throw new Error(`Role error: ${roleError.message}`)
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Admin user configured successfully",
                adminId: adminUser.id,
                email: adminUser.email,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message,
            }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        )
    }
}
