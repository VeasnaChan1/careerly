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
