import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4"
import { sendEmail } from "../_shared/ansut-gateway.ts"

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async req => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders })
    }

    try {
        const { document_id, action } = await req.json()
        
        if (!document_id || !action) {
            return new Response(JSON.stringify({ error: "Missing document_id or action" }), { status: 400, headers: corsHeaders })
        }

        const supabaseUrl = Deno.env.get("SUPABASE_URL")!
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        const adminClient = createClient(supabaseUrl, supabaseServiceKey)

        // 1. Get document details
        const { data: doc, error: docErr } = await adminClient
            .from("documents")
            .select("title, id")
            .eq("id", document_id)
            .single()

        if (docErr || !doc) {
            return new Response(JSON.stringify({ error: "Document not found" }), { status: 404, headers: corsHeaders })
        }

        // 2. Get editors (everyone with permissions on this document)
        const { data: permissions } = await adminClient
            .from("document_permissions")
            .select("user_id")
            .eq("document_id", document_id)

        if (!permissions || permissions.length === 0) {
            return new Response(JSON.stringify({ success: true, notified: 0 }), { status: 200, headers: corsHeaders })
        }

        const userIds = permissions.map(p => p.user_id)
        
        // 3. Get profiles and emails
        const { data: profiles } = await adminClient
            .from("profiles")
            .select("id, full_name")
            .in("id", userIds)

        const appUrl = "https://connect-fsu-africa.lovable.app"
        const docUrl = `${appUrl}/admin/co-redaction/${doc.id}`
        
        let notifiedCount = 0

        for (const userId of userIds) {
            // Get email from auth
            const { data: { user: authUser } } = await adminClient.auth.admin.getUserById(userId)
            const email = authUser?.email
            const profile = profiles?.find(p => p.id === userId)
            const fullName = profile?.full_name || "Utilisateur"

            if (email) {
                const subject = action === 'closed' 
                    ? `Édition terminée : ${doc.title}`
                    : `Document réouvert : ${doc.title}`

                const htmlContent = `
                    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f8fafc;">
                        <div style="text-align:center;padding:20px 0;border-bottom:3px solid #1a365d;">
                            <h2 style="color:#1a365d;margin:0;">Co-Rédaction ANSUT</h2>
                        </div>
                        <div style="padding:24px 0;">
                            <p>Bonjour <strong>${fullName}</strong>,</p>
                            <p>${action === 'closed' 
                                ? `L’édition du document <strong>"${doc.title}"</strong> est terminée, il est maintenant disponible en consultation.`
                                : `Le document <strong>"${doc.title}"</strong> a été réouvert pour modification.`
                            }</p>
                            <div style="text-align:center;margin:32px 0;">
                                <a href="${docUrl}" style="background:#1a365d;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;">
                                    Voir le document
                                </a>
                            </div>
                        </div>
                        <div style="border-top:1px solid #e2e8f0;padding:16px 0;text-align:center;color:#94a3b8;font-size:12px;">
                            © ${new Date().getFullYear()} ANSUT — Plateforme Co-Rédaction
                        </div>
                    </div>
                `

                try {
                    await sendEmail(email, subject, htmlContent, { isHtml: true })
                    notifiedCount++
                } catch (err) {
                    console.error(`Failed to send email to ${email}:`, err)
                }
            }
        }

        return new Response(JSON.stringify({ success: true, notified: notifiedCount }), { status: 200, headers: corsHeaders })

    } catch (error) {
        console.error("notify-co-redaction error:", error)
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders })
    }
})
