import prisma from "./prisma.js";

// Add only the table needed for verification to existing installations.
export async function ensureSignupTable() {
  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(72649185)`;
    await tx.$executeRaw`
      CREATE TABLE IF NOT EXISTS public.pending_signups (
        email varchar(255) PRIMARY KEY,
        token_digest varchar(64) NOT NULL,
        expires_at timestamp(3) NOT NULL
      )
    `;
    await tx.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS pending_signups_token_digest_key
      ON public.pending_signups (token_digest)
    `;
    await tx.$executeRaw`ALTER TABLE public.pending_signups ENABLE ROW LEVEL SECURITY`;
  });
}
