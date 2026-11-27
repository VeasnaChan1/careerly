import prisma from "../db/prisma.js";
import { sampleJobs } from "../data/sampleJobs.js";

export async function seedJobs() {
  try {
    const existingCount = await prisma.job.count();
    if (existingCount > 0) {
      console.log(`ℹ️ Jobs already seeded (${existingCount} jobs present in database).`);
      return;
    }

    console.log(`🌱 Seeding ${sampleJobs.length} sample jobs into PostgreSQL...`);
    const created = await prisma.job.createMany({
      data: sampleJobs,
      skipDuplicates: true
    });

    console.log(`✅ Successfully seeded ${created.count} jobs into PostgreSQL database.`);
  } catch (error) {
    console.error("❌ Error seeding jobs:", error.message);
  }
}

// Allow direct CLI execution: node prisma/seedJobs.js
if (process.argv[1] && process.argv[1].includes("seedJobs")) {
  seedJobs()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
