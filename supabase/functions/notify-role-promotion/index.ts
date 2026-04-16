import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { sendEmail, sendSms } from "../_shared/ansut-gateway.ts";

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
    const { data: { user: callerUser }, error: userError } =
      await userClient.auth.getUser();
    if (userError || !callerUser) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { user_id } = await req.json();
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "user_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Get promoted user's profile
    const { data: profile } = await adminClient
      .from("profiles")
      .select("full_name, country_id, phone")
      .eq("id", user_id)
      .single();

    const promotedName = profile?.full_name || "Un utilisateur";

    // Get promoted user's email
    const { data: { user: authUser } } = await adminClient.auth.admin.getUserById(user_id);
    const promotedEmail = authUser?.email;

    // Get country name
    let countryName = "";
    if (profile?.country_id) {
      const { data: country } = await adminClient
        .from("countries")
        .select("name_fr")
        .eq("id", profile.country_id)
        .single();
      countryName = country?.name_fr || "";
    }

    const appUrl = "https://connect-fsu-africa.lovable.app";
    let notifiedCount = 0;

    // 1. Send email to the promoted user
    if (promotedEmail) {
      try {
        const htmlContent = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f8fafc;">
            <div style="text-align:center;padding:20px 0;border-bottom:3px solid #1a365d;">
              <img src="https://connect-fsu-africa.lovable.app/lovable-uploads/d26f28e0-0025-4b8e-9c97-aff01e4092a5.png"
                   alt="ATU/UAT" style="height:60px;" />
            </div>
            <div style="padding:24px 0;">
              <h2 style="color:#1a365d;margin:0 0 16px;">🎉 Promotion en Point Focal National</h2>
              <p style="color:#334155;line-height:1.6;">
                Bonjour <strong>${promotedName}</strong>,
              </p>
              <p style="color:#334155;line-height:1.6;">
                Nous avons le plaisir de vous informer que vous avez été promu(e) au rôle de
                <strong>Point Focal National</strong>${countryName ? ` pour <strong>${countryName}</strong>` : ""}.
              </p>
              <p style="color:#334155;line-height:1.6;">
                Ce nouveau rôle vous donne accès à des fonctionnalités avancées :
              </p>
              <ul style="color:#334155;line-height:1.8;">
                <li>Soumission des formulaires FSU</li>
                <li>Participation au forum de discussion</li>
                <li>Accès aux rapports et documents</li>
              </ul>
              <div style="text-align:center;margin:24px 0;">
                <a href="${appUrl}/dashboard"
                   style="display:inline-block;padding:12px 32px;background:#1a365d;color:#ffffff;
                          text-decoration:none;border-radius:6px;font-weight:bold;">
                  Accéder à mon espace
                </a>
              </div>
            </div>
            <div style="border-top:1px solid #e2e8f0;padding:16px 0;text-align:center;color:#94a3b8;font-size:12px;">
              © ${new Date().getFullYear()} ATU/UAT — Plateforme FSU Afrique
            </div>
          </div>`;

        await sendEmail(
          promotedEmail,
          "Félicitations — Vous êtes désormais Point Focal National",
          htmlContent,
          { isHtml: true }
        );
        notifiedCount++;
      } catch (emailErr) {
        console.error(`Email to promoted user failed:`, emailErr);
      }
    }

    // 1b. Send SMS to the promoted user
    if (profile?.phone) {
      try {
        const smsContent = `Félicitations ${promotedName} ! Vous avez été promu(e) Point Focal National${countryName ? ` pour ${countryName}` : ""}. Connectez-vous sur ${appUrl} pour accéder à vos nouvelles fonctionnalités. — ATU/UAT`;
        await sendSms(profile.phone, smsContent);
        notifiedCount++;
        console.log(`SMS sent to promoted user ${profile.phone}`);
      } catch (smsErr) {
        console.error(`SMS to promoted user failed:`, smsErr);
      }
    }

    const rolesToNotify = ['global_admin'];
    const { data: adminRoles } = await adminClient
      .from("user_roles")
      .select("user_id, role")
      .in("role", rolesToNotify);

    // Also fetch country_admins of the same country
    let countryAdminRoles: { user_id: string }[] = [];
    if (profile?.country_id) {
      const { data: caRoles } = await adminClient
        .from("user_roles")
        .select("user_id")
        .eq("role", "country_admin");
      if (caRoles) {
        // Filter by same country
        for (const ca of caRoles) {
          const { data: caProfile } = await adminClient
            .from("profiles")
            .select("country_id")
            .eq("id", ca.user_id)
            .single();
          if (caProfile?.country_id === profile.country_id) {
            countryAdminRoles.push(ca);
          }
        }
      }
    }

    const allAdminsToNotify = [
      ...(adminRoles || []).map(r => ({ user_id: r.user_id, isCountryAdmin: false })),
      ...countryAdminRoles.map(r => ({ user_id: r.user_id, isCountryAdmin: true })),
    ];

    for (const admin of allAdminsToNotify) {
      try {
        const { data: { user: adminAuth } } = await adminClient.auth.admin.getUserById(admin.user_id);
        if (!adminAuth?.email) continue;

        const adminSubject = admin.isCountryAdmin
          ? `Nouveau Point Focal dans votre pays — ${promotedName}`
          : `Nouveau Point Focal — ${promotedName}`;

        const adminHtml = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f8fafc;">
            <div style="text-align:center;padding:20px 0;border-bottom:3px solid #1a365d;">
              <img src="https://connect-fsu-africa.lovable.app/lovable-uploads/d26f28e0-0025-4b8e-9c97-aff01e4092a5.png"
                   alt="ATU/UAT" style="height:60px;" />
            </div>
            <div style="padding:24px 0;">
              <h2 style="color:#1a365d;margin:0 0 16px;">${admin.isCountryAdmin ? 'Nouveau Point Focal dans votre pays' : 'Nouveau Point Focal'}</h2>
              <p style="color:#334155;line-height:1.6;">
                <strong>${promotedName}</strong>${countryName ? ` (${countryName})` : ""}
                a été promu(e) au rôle de Point Focal National.
              </p>
              <div style="text-align:center;margin:24px 0;">
                <a href="${appUrl}/users"
                   style="display:inline-block;padding:12px 32px;background:#1a365d;color:#ffffff;
                          text-decoration:none;border-radius:6px;font-weight:bold;">
                  Voir les utilisateurs
                </a>
              </div>
            </div>
            <div style="border-top:1px solid #e2e8f0;padding:16px 0;text-align:center;color:#94a3b8;font-size:12px;">
              © ${new Date().getFullYear()} ATU/UAT — Plateforme FSU Afrique
            </div>
          </div>`;

        await sendEmail(adminAuth.email, adminSubject, adminHtml, { isHtml: true });
        notifiedCount++;
      } catch (err) {
        console.error(`Admin email failed for ${admin.user_id}:`, err);
      }
    }

    return new Response(
      JSON.stringify({ success: true, notified: notifiedCount }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("notify-role-promotion error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
