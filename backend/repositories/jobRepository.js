import prisma from "../db/prisma.js";

export const findJobById = (id) =>
  prisma.job.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      company: true,
      location: true,
      job_type: true,
      salary_range: true,
      description: true,
      requirements: true,
      job_url: true,
      contact_email: true,
      status: true,
      created_at: true,

    },
  });
export const findJobs = async ({ page, limit }) => {
  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        job_type: true,
        salary_range: true,
        job_url: true,
        contact_email: true,
        status: true,
        created_at: true
      }
    }),
    prisma.job.count()
  ]);
  return { jobs, total };
};