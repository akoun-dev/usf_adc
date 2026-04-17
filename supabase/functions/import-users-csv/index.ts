import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4"
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors"

interface CsvRow {
    email: string
    full_name: string
    role: string
    country_code: string
}

interface ImportResult {
    row: number
    email: string
    status: "created" | "error"
    error?: string
}

const VALID_ROLES = ["point_focal", "country_admin", "super_admin"]

Deno.serve(async req => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders })
    }

    try {
        // Verify caller is super_admin
        const authHeader = req.headers.get("Authorization")
        if (!authHeader) {
            return new Response(
                JSON.stringify({ error: "Missing authorization" }),
                {
                    status: 401,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            )
        }

        const supabaseUrl = Deno.env.get("SUPABASE_URL")!
        const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!

        // Verify the caller's role using their JWT
        const callerClient = createClient(supabaseUrl, anonKey, {
            global: { headers: { Authorization: authHeader } },
        })
        const {
            data: { user: caller },
        } = await callerClient.auth.getUser()
        if (!caller) {
            return new Response(JSON.stringify({ error: "Invalid token" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            })
        }

        // Check super_admin role
        const adminClient = createClient(supabaseUrl, serviceRoleKey)
        const { data: roleCheck } = await adminClient
            .from("user_roles")
            .select("id")
            .eq("user_id", caller.id)
            .eq("role", "super_admin")
            .maybeSingle()

        if (!roleCheck) {
            return new Response(
                JSON.stringify({ error: "Forbidden: super_admin required" }),
                {
                    status: 403,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            )
        }

        const body = await req.json()
        const rows: CsvRow[] = body.rows

        if (!Array.isArray(rows) || rows.length === 0) {
            return new Response(JSON.stringify({ error: "No rows provided" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            })
        }

        if (rows.length > 200) {
            return new Response(
                JSON.stringify({ error: "Maximum 200 rows per import" }),
                {
                    status: 400,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            )
        }

        // Pre-fetch countries for mapping
        const { data: countries } = await adminClient
            .from("countries")
            .select("id, code_iso")
        const countryMap = new Map(
            (countries || []).map((c: { id: string; code_iso: string }) => [
                c.code_iso.trim().toUpperCase(),
                c.id,
            ])
        )

        const results: ImportResult[] = []

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i]
            const rowNum = i + 1

            // Validate email
            if (
                !row.email ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email.trim())
            ) {
                results.push({
                    row: rowNum,
                    email: row.email || "",
                    status: "error",
                    error: "Email invalide",
                })
                continue
            }

            // Validate role
            const role = (row.role || "").trim().toLowerCase()
            if (!VALID_ROLES.includes(role)) {
                results.push({
                    row: rowNum,
                    email: row.email,
                    status: "error",
                    error: `Rôle invalide: ${row.role}`,
                })
                continue
            }

            // Resolve country
            const countryCode = (row.country_code || "").trim().toUpperCase()
            const countryId = countryMap.get(countryCode) || null
            if (countryCode && !countryId) {
                results.push({
                    row: rowNum,
                    email: row.email,
                    status: "error",
                    error: `Pays inconnu: ${countryCode}`,
                })
                continue
            }

            try {
                // Create user via admin API
                const tempPassword = crypto.randomUUID().slice(0, 16) + "A1!"
                const { data: newUser, error: createError } =
                    await adminClient.auth.admin.createUser({
                        email: row.email.trim(),
                        password: tempPassword,
                        email_confirm: true,
                        user_metadata: {
                            full_name: (row.full_name || "").trim(),
                        },
                    })

                if (createError) {
                    results.push({
                        row: rowNum,
                        email: row.email,
                        status: "error",
                        error: createError.message,
                    })
                    continue
                }

                const userId = newUser.user.id

                // Update profile with country and name
                await adminClient
                    .from("profiles")
                    .update({
                        full_name: (row.full_name || "").trim() || null,
                        country_id: countryId,
                    })
                    .eq("id", userId)

                // Assign role
                await adminClient
                    .from("user_roles")
                    .insert({ user_id: userId, role })

                results.push({
                    row: rowNum,
                    email: row.email,
                    status: "created",
                })
            } catch (err) {
                results.push({
                    row: rowNum,
                    email: row.email,
                    status: "error",
                    error: err instanceof Error ? err.message : "Unknown error",
                })
            }
        }

        const created = results.filter(r => r.status === "created").length
        const errors = results.filter(r => r.status === "error").length

        return new Response(
            JSON.stringify({ total: rows.length, created, errors, results }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        )
    } catch (err) {
        return new Response(
            JSON.stringify({
                error: err instanceof Error ? err.message : "Internal error",
            }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        )
    }
})
