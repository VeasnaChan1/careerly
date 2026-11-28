import prisma from "./prisma.js";

export async function ensurePasswordResetTable() {
  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(72649186)`;
    await tx.$executeRaw`
      CREATE TABLE IF NOT EXISTS public.password_resets (
        email varchar(255) PRIMARY KEY,
        token_digest varchar(64) NOT NULL,
        expires_at timestamp(3) NOT NULL
      )
    `;
    await tx.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS password_resets_token_digest_key
      ON public.password_resets (token_digest)
    `;
    await tx.$executeRaw`ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY`;
  });
}
