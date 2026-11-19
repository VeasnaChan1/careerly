import { createHash } from "node:crypto";
import bcrypt from "bcrypt";
import prisma from "../db/prisma.js";

const digest = (token) => createHash("sha256").update(token).digest("hex");
const invalidLink = "This verification link is invalid or has expired. Create an account on the signup page.";

export async function requestSignup(req, res) {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  if (email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Enter a valid email address." });
  }

  const { password } = req.body;
  if (typeof password !== "string" || password.length < 8 || Buffer.byteLength(password) > 72) {
    return res.status(400).json({ message: "Use at least 8 characters and at most 72 bytes for your password." });
  }

  const alreadyRegistered = () => res.status(409).json({ message: "An account already uses this email. Sign in or choose Forgot password." });
  try {
    const existing = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { id: true }
    });
    if (existing) return alreadyRegistered();

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { email, password_hash: passwordHash } });
    return res.status(201).json({ message: "Account created. You can now sign in." });
  } catch (error) {
    if (error.code === "P2002") return alreadyRegistered();
    console.error("Account creation failed:", error.code || error.name);
    return res.status(503).json({ message: "Signup is temporarily unavailable. Please try again shortly." });
  }
}

export async function verifySignup(req, res) {
  const { token, password } = req.body ?? {};
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) {
    return res.status(400).json({ message: invalidLink });
  }
  if (!name || name.length > 255) {
    return res.status(400).json({ message: "Enter your full name using up to 255 characters." });
  }
  if (typeof password !== "string" || password.length < 8 || Buffer.byteLength(password) > 72) {
    return res.status(400).json({ message: "Use at least 8 characters and at most 72 UTF-8 bytes." });
  }

  const tokenDigest = digest(token);
  const pending = await prisma.pendingSignup.findUnique({ where: { token_digest: tokenDigest } });
  if (!pending || pending.expires_at <= new Date()) {
    return res.status(400).json({ message: invalidLink });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const created = await prisma.$transaction(async (tx) => {
    const consumed = await tx.pendingSignup.deleteMany({
      where: { token_digest: tokenDigest, expires_at: { gt: new Date() } }
    });
    if (!consumed.count) return false;
    const existing = await tx.user.findFirst({
      where: { email: { equals: pending.email, mode: "insensitive" } },
      select: { id: true }
    });
    if (existing) return false;
    await tx.user.create({ data: { name, email: pending.email, password_hash: passwordHash } });
    return true;
  });

  if (!created) return res.status(400).json({ message: invalidLink });
  return res.status(201).json({ message: "Email verified. You can now sign in." });
}
