import { accountFrontendUrl, mailConfigured, sendAccountEmail } from "../config/accountEmail.js";
import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import prisma from "../db/prisma.js";

const linkLifetime = 30 * 60 * 1000;
const requestCooldown = 60 * 1000;
const invalidLink = "This reset link is invalid or has expired. Request a new link from the sign-in page.";
const digest = (token) => createHash("sha256").update(token).digest("hex");

// Earlier installations keyed reset links by user_id. Keep their links usable.
async function resetAccountKey() {
  const [table] = await prisma.$queryRaw`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'password_resets' AND column_name = 'user_id'
    ) AS legacy
  `;
  return table.legacy
    ? { column: Prisma.sql`user_id`, userColumn: Prisma.sql`id` }
    : { column: Prisma.sql`email`, userColumn: Prisma.sql`email` };
}

export async function requestPasswordReset(req, res) {
  const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
  if (email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Enter a valid email address." });
  }

  const frontend = accountFrontendUrl();
  if (!frontend || !mailConfigured()) {
    console.error(frontend ? "Account email provider is not configured." : "Check FRONTEND_URL for account email links.");
    return res.status(503).json({ message: "Password reset email is currently unavailable." });
  }

  try {
    await sendResetLink(email, new URL("/", frontend));
    return res.json({ message: "If an account exists for that email, a reset link has been requested. Check your inbox and spam folder." });
  } catch (error) {
    console.error("Password reset request failed:", error.message);
    return res.status(error.statusCode || 503).json({
      message: error.publicMessage || "We couldn't request your reset email. Please try again shortly."
    });
  }
}

async function sendResetLink(email, link) {
  const users = await prisma.$queryRaw`
    SELECT email FROM public.users WHERE lower(email) = lower(${email})
    ORDER BY (email = ${email}) DESC, email LIMIT 1
  `;
  const user = users[0];
  if (!user) return;
  const token = randomBytes(32).toString("hex");
  const tokenDigest = digest(token);
  const now = Date.now();
  const expiresAt = new Date(now + linkLifetime);
  const nextAllowed = new Date(now + linkLifetime - requestCooldown);
  const key = await resetAccountKey();
  const saved = await prisma.$executeRaw`
    INSERT INTO public.password_resets (${key.column}, token_digest, expires_at)
    SELECT ${key.userColumn}, ${tokenDigest}, ${expiresAt} FROM public.users WHERE email = ${user.email}
    ON CONFLICT (${key.column}) DO UPDATE
    SET "token_digest" = EXCLUDED."token_digest", "expires_at" = EXCLUDED."expires_at"
    WHERE "password_resets"."expires_at" <= ${nextAllowed}
  `;

  if (!saved) {
    const error = new Error("Password reset cooldown");
    error.statusCode = 429;
    error.publicMessage = "Please wait one minute before requesting another reset link.";
    throw error;
  }

  link.hash = new URLSearchParams({ flow: "reset-password", token }).toString();
  try {
    const delivery = await sendAccountEmail({
      to: user.email,
      subject: "Reset your Careerly password",
      text: `Open this link to reset your Careerly password:\n${link.href}\n\nThis link expires in 30 minutes. If you did not request it, you can ignore this email.`
    });
    if (!delivery.ok) {
      const details = await delivery.json().catch(() => ({}));
      const error = new Error(`Email provider returned ${delivery.status}: ${details.name || "delivery error"}`);
      error.publicMessage = String(details.message || "").includes("testing emails")
        ? "Email delivery is limited to the site's test inbox. The site owner needs to verify a sending domain to send to other addresses."
        : "We couldn't send your reset email. Please try again later.";
      throw error;
    }
  } catch (error) {
    console.error("Password reset delivery failed:", error.message);
    await prisma.$executeRaw`DELETE FROM public.password_resets WHERE token_digest = ${tokenDigest}`.catch(() => {});
    throw error;
  }
}

export async function resetPassword(req, res) {
  const { token, password } = req.body ?? {};
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) {
    return res.status(400).json({ message: invalidLink });
  }
  if (typeof password !== "string" || password.length < 8 || Buffer.byteLength(password) > 72) {
    return res.status(400).json({ message: "Use at least 8 characters and at most 72 UTF-8 bytes." });
  }

  const tokenDigest = digest(token);
  const key = await resetAccountKey();
  const [reset] = await prisma.$queryRaw`
    SELECT expires_at FROM public.password_resets WHERE token_digest = ${tokenDigest}
  `;
  if (!reset || reset.expires_at <= new Date()) {
    return res.status(400).json({ message: invalidLink });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const updated = await prisma.$transaction(async (tx) => {
    const changed = await tx.$executeRaw`
      WITH consumed AS (
        DELETE FROM public.password_resets
        WHERE token_digest = ${tokenDigest} AND expires_at > ${new Date()}
        RETURNING ${key.column} AS account_key
      )
      UPDATE public.users AS u SET password_hash = ${passwordHash}
      FROM consumed WHERE u.${key.userColumn} = consumed.account_key
    `;
    return changed === 1;
  });

  if (!updated) return res.status(400).json({ message: invalidLink });
  return res.json({ message: "Password updated. Sign in with your new password." });
}
