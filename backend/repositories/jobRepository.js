import prisma from "../db/prisma.js";

const jobSelect = {
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
};

/**
 * Find a single job record by UUID.
 */
export const findJobById = (id) =>
  prisma.job.findUnique({
    where: { id },
    select: jobSelect,
  });

/**
 * Find paginated jobs with optional search, filter, and sort parameters.
 */
export const findJobs = async ({ page, limit, search, job_type, location, sort }) => {
  const where = {};

  if (job_type && job_type.toLowerCase() !== "all") {
    where.job_type = { equals: job_type, mode: "insensitive" };
  }

  if (location && location.toLowerCase() !== "all") {
    where.location = { contains: location, mode: "insensitive" };
  }

  if (search && search.trim()) {
    const term = search.trim();
    where.OR = [
      { title: { contains: term, mode: "insensitive" } },
      { company: { contains: term, mode: "insensitive" } },
      { location: { contains: term, mode: "insensitive" } },
      { description: { contains: term, mode: "insensitive" } },
      { requirements: { contains: term, mode: "insensitive" } },
    ];
  }

  let orderBy = [{ created_at: "desc" }];
  if (sort === "oldest") orderBy = [{ created_at: "asc" }];
  else if (sort === "company") orderBy = [{ company: "asc" }];
  else if (sort === "title") orderBy = [{ title: "asc" }];

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: jobSelect,
    }),
    prisma.job.count({ where }),
  ]);

  return { jobs, total };
};
