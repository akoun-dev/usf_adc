import { createClient } from "npm:@supabase/supabase-js@2.49.4";
import { sendSms, sendEmail, sendTelegram } from "../_shared/ansut-gateway.ts";

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

    // Verify user
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
    const userId = claimsData.claims.sub as string;
    const userEmail = claimsData.claims.email as string;

    // Use service role for DB operations
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Generate code via DB function
    const { data: code, error: codeError } = await adminClient.rpc(
      "generate_mfa_code",
      { _user_id: userId }
    );
    if (codeError) throw codeError;

    // Get user's MFA method
    const { data: profile } = await adminClient
      .from("profiles")
      .select("mfa_method, phone, telegram_chat_id")
      .eq("id", userId)
      .single();

    const method = profile?.mfa_method || "email";

    if (method === "email") {
      // Send MFA code via ANSUT Email gateway
      try {
        const htmlContent = `
          <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:20px;">
            <h2 style="color:#1a365d;">Code de vérification</h2>
            <p>Votre code de vérification est :</p>
            <div style="font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center;
                        padding:16px;background:#f0f4f8;border-radius:8px;margin:16px 0;">
              ${code}
            </div>
            <p style="color:#666;font-size:14px;">Ce code est valide pendant 5 minutes.</p>
          </div>`;

        const result = await sendEmail(
          userEmail,
          "Code de vérification — ATU/UAT",
          htmlContent,
          { isHtml: true }
        );

        if (!result.ok) {
          console.error("ANSUT Email error:", result.body);
        }
      } catch (emailErr) {
        console.error("Email send failed, code stored in DB:", emailErr);
      }
    } else if (method === "sms") {
      const phone = profile?.phone;
      if (phone) {
        try {
          const result = await sendSms(
            phone,
            `Votre code de vérification : ${code}. Valide 5 minutes.`
          );
          if (!result.ok) {
            console.error("ANSUT SMS error:", result.body);
          }
        } catch (smsErr) {
          console.error("SMS send failed:", smsErr);
        }
      } else {
        console.log("No phone number configured for SMS MFA");
      }
    } else if (method === "telegram") {
      const chatId = profile?.telegram_chat_id;
      if (chatId) {
        try {
          const result = await sendTelegram(
            chatId,
            `Votre code de vérification ATU/UAT : ${code}. Valide 5 minutes.`
          );
          if (!result.ok) {
            console.error("ANSUT Telegram error:", result.body);
          }
        } catch (tgErr) {
          console.error("Telegram send failed:", tgErr);
        }
      } else {
        console.log("No Telegram Chat ID configured for Telegram MFA");
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        method,
        email_hint: userEmail
          ? `${userEmail.slice(0, 3)}***`
          : undefined,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("MFA error:", error);
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
