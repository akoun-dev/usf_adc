const ANSUT_BASE_URL =
  "https://ansuthub.westeurope.cloudapp.azure.com/gateway/api/message/send";

interface AnsutCredentials {
  username: string;
  password: string;
}

function getCredentials(): AnsutCredentials {
  const username = Deno.env.get("ANSUT_SMS_USERNAME");
  const password = Deno.env.get("ANSUT_SMS_PASSWORD");
  if (!username || !password) {
    throw new Error("ANSUT credentials not configured");
  }
  return { username, password };
}

interface AnsutResponse {
  ok: boolean;
  status: number;
  body: string;
}

async function callAnsut(
  payload: Record<string, unknown>
): Promise<AnsutResponse> {
  console.log("ANSUT request URL:", ANSUT_BASE_URL);
  console.log("ANSUT payload (redacted):", JSON.stringify({ ...payload, password: "***" }));
  
  const response = await fetch(ANSUT_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await response.text();
  console.log("ANSUT response:", response.status, body);
  return { ok: response.ok, status: response.status, body };
}

/**
 * Send an SMS via the ANSUT unified endpoint.
 * Phone number should include country code without leading '+'.
 */
export async function sendSms(to: string, content: string): Promise<AnsutResponse> {
  const { username, password } = getCredentials();
  return callAnsut({
    to: to.replace(/^\+/, ""),
    from: "ANSUT",
    content,
    username,
    password,
    // No channel field = defaults to SMS
  });
}

/**
 * Send an email via the ANSUT unified endpoint.
 */
export async function sendEmail(
  to: string,
  subject: string,
  content: string,
  options?: { cc?: string; bcc?: string; isHtml?: boolean }
): Promise<AnsutResponse> {
  const { username, password } = getCredentials();
  return callAnsut({
    to,
    from: "ANSUT",
    content,
    subject,
    channel: "Email",
    ishtml: options?.isHtml ?? true,
    ...(options?.cc && { cc: options.cc }),
    ...(options?.bcc && { bcc: options.bcc }),
    username,
    password,
  });
}

/**
 * Send a Telegram message via the ANSUT unified endpoint.
 */
export async function sendTelegram(
  to: string,
  content: string
): Promise<AnsutResponse> {
  const { username, password } = getCredentials();
  return callAnsut({
    to,
    from: "ANSUT",
    content,
    channel: "Telegram",
    username,
    password,
  });
}
