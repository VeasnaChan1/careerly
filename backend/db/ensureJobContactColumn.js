import prisma from "./prisma.js";

/**
 * Ensure jobs.contact_email exists on existing databases even before manual migrations run.
 */
export async function ensureJobContactColumn() {
  await prisma.$executeRaw`
    ALTER TABLE public.jobs
    ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255)
  `;
}
