function emailProvider() {
  const env = process.env;
  if (env.RESEND_API_KEY && env.PASSWORD_RESET_FROM) return "resend";
  if (env.GMAIL_USER && env.GMAIL_APP_PASSWORD) return "gmail";
  return null;
}

export function mailConfigured() {
  return Boolean(emailProvider());
}

export function accountFrontendUrl() {
  const value = process.env.FRONTEND_URL;
  if (!URL.canParse(value)) return null;
  const url = new URL(value);
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (local && process.env.RENDER === "true") return null;
  return url.protocol === "https:" || (local && url.protocol === "http:") ? url : null;
}

export async function sendAccountEmail({ to, subject, text }) {
  const env = process.env;
  if (emailProvider() === "gmail") {
    const { default: nodemailer } = await import("nodemailer");
    const mail = nodemailer.createTransport({
      service: "gmail",
      auth: { user: env.GMAIL_USER, pass: env.GMAIL_APP_PASSWORD.replace(/\s/g, "") },
      connectionTimeout: 10000,
      socketTimeout: 15000
    });
    await mail.sendMail({ from: { name: "Careerly", address: env.GMAIL_USER }, to, subject, text });
    return { ok: true };
  }
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.PASSWORD_RESET_FROM, to: [to], subject, text }),
    signal: AbortSignal.timeout(8000)
  });
}
