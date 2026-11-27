import prisma from "../db/prisma.js";
import { ensureJobContactColumn } from "../db/ensureJobContactColumn.js";
import { sampleJobs } from "../data/sampleJobs.js";

const jobs = sampleJobs.map(({ created_at, ...job }) => ({
  ...job,
  user_id: null,
}));

async function seed() {
  try {
    await ensureJobContactColumn();
    // Only replace earlier seed jobs (user_id === null) so user-owned jobs stay untouched
    await prisma.job.deleteMany({ where: { user_id: null } });
    await prisma.job.createMany({ data: jobs });
    console.log(`Seeded ${jobs.length} jobs`);
  } catch (error) {
    console.error("Failed to seed jobs:", error.message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
