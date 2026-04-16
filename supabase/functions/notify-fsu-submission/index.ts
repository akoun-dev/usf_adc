import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { sendSms, sendEmail } from "../_shared/ansut-gateway.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify caller
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } =
      await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { submission_id } = await req.json();
    if (!submission_id) {
      return new Response(
        JSON.stringify({ error: "submission_id is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Get submission details
    const { data: submission, error: subErr } = await adminClient
      .from("fsu_submissions")
      .select("id, country_id, submitted_by, period_start, period_end")
      .eq("id", submission_id)
      .single();
    if (subErr || !submission) {
      return new Response(
        JSON.stringify({ error: "Submission not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 2. Get country name
    const { data: country } = await adminClient
      .from("countries")
      .select("name_fr")
      .eq("id", submission.country_id)
      .single();

    // 3. Get submitter name
    const { data: submitter } = await adminClient
      .from("profiles")
      .select("full_name")
      .eq("id", submission.submitted_by)
      .single();

    const countryName = country?.name_fr || "Pays inconnu";
    const submitterName = submitter?.full_name || "Un utilisateur";
    const periodLabel = `${submission.period_start} — ${submission.period_end}`;

    // 4. Get admin recipients (country_admin of same country + all global_admin)
    const { data: adminRoles } = await adminClient
      .from("user_roles")
      .select("user_id, role")
      .in("role", ["country_admin", "global_admin"]);

    if (!adminRoles || adminRoles.length === 0) {
      return new Response(
        JSON.stringify({ success: true, notified: 0 }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get profiles for these admins
    const adminUserIds = [...new Set(adminRoles.map((r) => r.user_id))];
    const { data: adminProfiles } = await adminClient
      .from("profiles")
      .select("id, full_name, phone, country_id")
      .in("id", adminUserIds);

    // Get emails from auth.users via admin API
    const adminProfileMap = new Map(
      (adminProfiles || []).map((p) => [p.id, p])
    );

    // Filter: global_admin always, country_admin only if same country
    const recipients: {
      userId: string;
      phone: string | null;
      email?: string;
    }[] = [];

    for (const role of adminRoles) {
      if (role.user_id === submission.submitted_by) continue; // skip self
      const profile = adminProfileMap.get(role.user_id);
      if (!profile) continue;

      if (role.role === "global_admin") {
        recipients.push({ userId: role.user_id, phone: profile.phone });
      } else if (
        role.role === "country_admin" &&
        profile.country_id === submission.country_id
      ) {
        recipients.push({ userId: role.user_id, phone: profile.phone });
      }
    }

    // Deduplicate by userId
    const uniqueRecipients = [
      ...new Map(recipients.map((r) => [r.userId, r])).values(),
    ];

    // Get emails for recipients via auth admin API
    let notifiedCount = 0;
    const appUrl = "https://connect-fsu-africa.lovable.app";
    const submissionUrl = `${appUrl}/fsu/submissions/${submission.id}`;

    for (const recipient of uniqueRecipients) {
      // Get email from auth
      const {
        data: { user: authUser },
      } = await adminClient.auth.admin.getUserById(recipient.userId);
      const email = authUser?.email;

      // Send Email
      if (email) {
        try {
          const htmlContent = `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f8fafc;">
              <div style="text-align:center;padding:20px 0;border-bottom:3px solid #1a365d;">
                <img src="https://connect-fsu-africa.lovable.app/lovable-uploads/d26f28e0-0025-4b8e-9c97-aff01e4092a5.png"
                     alt="ATU/UAT" style="height:60px;" />
              </div>
              <div style="padding:24px 0;">
                <h2 style="color:#1a365d;margin:0 0 16px;">Nouvelle soumission FSU</h2>
                <p style="color:#334155;line-height:1.6;">
                  <strong>${submitterName}</strong> a soumis un formulaire FSU pour
                  <strong>${countryName}</strong>.
                </p>
                <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                  <tr>
                    <td style="padding:8px 12px;background:#e2e8f0;font-weight:bold;width:40%;">Pays</td>
                    <td style="padding:8px 12px;background:#f1f5f9;">${countryName}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 12px;background:#e2e8f0;font-weight:bold;">Période</td>
                    <td style="padding:8px 12px;background:#f1f5f9;">${periodLabel}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 12px;background:#e2e8f0;font-weight:bold;">Soumis par</td>
                    <td style="padding:8px 12px;background:#f1f5f9;">${submitterName}</td>
                  </tr>
                </table>
                <div style="text-align:center;margin:24px 0;">
                  <a href="${submissionUrl}"
                     style="display:inline-block;padding:12px 32px;background:#1a365d;color:#ffffff;
                            text-decoration:none;border-radius:6px;font-weight:bold;">
                    Examiner la soumission
                  </a>
                </div>
              </div>
              <div style="border-top:1px solid #e2e8f0;padding:16px 0;text-align:center;color:#94a3b8;font-size:12px;">
                © ${new Date().getFullYear()} ATU/UAT — Plateforme FSU Afrique
              </div>
            </div>`;

          await sendEmail(
            email,
            `Nouvelle soumission FSU — ${countryName}`,
            htmlContent,
            { isHtml: true }
          );
        } catch (emailErr) {
          console.error(`Email failed for ${recipient.userId}:`, emailErr);
        }
      }

      // Send SMS if phone available
      if (recipient.phone) {
        try {
          await sendSms(
            recipient.phone,
            `Nouvelle soumission FSU de ${submitterName} pour ${countryName} (${periodLabel}). Connectez-vous pour valider.`
          );
        } catch (smsErr) {
          console.error(`SMS failed for ${recipient.userId}:`, smsErr);
        }
      }

      notifiedCount++;
    }

    return new Response(
      JSON.stringify({ success: true, notified: notifiedCount }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("notify-fsu-submission error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
