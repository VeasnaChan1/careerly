import prisma from "../db/prisma.js";
import { sampleJobs } from "../data/sampleJobs.js";

/**
 * GET /api/jobs
 * Query parameters:
 *  - page (int, default 1)
 *  - limit (int, default 9)
 *  - search (string)
 *  - job_type (string, e.g. 'all', 'full-time', 'internship', 'hybrid', 'remote')
 *  - location (string, e.g. 'all', 'Phnom Penh', 'Siem Reap', 'Remote')
 *  - sort (string: 'newest' | 'oldest' | 'company' | 'title')
 */
export const getJobs = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 9));
    const { search, job_type, location, sort = "newest" } = req.query;

    const skip = (page - 1) * limit;

    const parseMultiFilter = (val) =>
      typeof val === "string"
        ? val
            .split(",")
            .map((v) => v.trim())
            .filter((v) => v && v.toLowerCase() !== "all")
        : [];

    const selectedTypes = parseMultiFilter(job_type);
    const selectedLocations = parseMultiFilter(location);

    let dbJobs = [];
    let totalJobs = 0;
    let allJobsForFilters = [];
    let dbFailed = false;

    try {
      const whereClause = {
        status: {
          not: "closed"
        }
      };

      const andConditions = [];

      if (selectedTypes.length > 0) {
        andConditions.push({
          OR: selectedTypes.map((t) => ({
            job_type: { equals: t, mode: "insensitive" }
          }))
        });
      }

      if (selectedLocations.length > 0) {
        andConditions.push({
          OR: selectedLocations.map((loc) => ({
            location: { contains: loc, mode: "insensitive" }
          }))
        });
      }

      if (search && search.trim()) {
        const queryTerm = search.trim();
        andConditions.push({
          OR: [
            { title: { contains: queryTerm, mode: "insensitive" } },
            { company: { contains: queryTerm, mode: "insensitive" } },
            { location: { contains: queryTerm, mode: "insensitive" } },
            { description: { contains: queryTerm, mode: "insensitive" } },
            { requirements: { contains: queryTerm, mode: "insensitive" } }
          ]
        });
      }

      if (andConditions.length > 0) {
        whereClause.AND = andConditions;
      }

      // Determine order
      let orderBy = [{ created_at: "desc" }];
      if (sort === "oldest") {
        orderBy = [{ created_at: "asc" }];
      } else if (sort === "company") {
        orderBy = [{ company: "asc" }];
      } else if (sort === "title") {
        orderBy = [{ title: "asc" }];
      }

      [dbJobs, totalJobs, allJobsForFilters] = await Promise.all([
        prisma.job.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy
        }),
        prisma.job.count({
          where: whereClause
        }),
        prisma.job.findMany({
          select: {
            job_type: true,
            location: true
          }
        })
      ]);
    } catch (dbErr) {
      dbFailed = true;
      console.warn("DB query failed, fallback to in-memory sample jobs:", dbErr.message);
    }

    // Static fallback only if DB is unreachable or the jobs table has no seeded rows
    if (dbFailed || allJobsForFilters.length === 0) {
      let filtered = [...sampleJobs];

      if (selectedTypes.length > 0) {
        filtered = filtered.filter(
          (j) =>
            j.job_type &&
            selectedTypes.some((t) => j.job_type.toLowerCase() === t.toLowerCase())
        );
      }

      if (selectedLocations.length > 0) {
        filtered = filtered.filter(
          (j) =>
            j.location &&
            selectedLocations.some((loc) =>
              j.location.toLowerCase().includes(loc.toLowerCase())
            )
        );
      }

      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        filtered = filtered.filter(
          (j) =>
            j.title.toLowerCase().includes(q) ||
            j.company.toLowerCase().includes(q) ||
            (j.location && j.location.toLowerCase().includes(q)) ||
            (j.description && j.description.toLowerCase().includes(q)) ||
            (j.requirements && j.requirements.toLowerCase().includes(q))
        );
      }

      if (sort === "company") {
        filtered.sort((a, b) => a.company.localeCompare(b.company));
      } else if (sort === "title") {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      }

      totalJobs = filtered.length;
      dbJobs = filtered.slice(skip, skip + limit);
      allJobsForFilters = sampleJobs;
    }

    const totalPages = Math.ceil(totalJobs / limit) || 1;

    // Aggregate filters (jobTypes and locations)
    const typeCounts = {};
    const locationsSet = new Set();

    (allJobsForFilters || []).forEach((item) => {
      if (item.job_type) {
        typeCounts[item.job_type] = (typeCounts[item.job_type] || 0) + 1;
      }
      if (item.location) {
        const cleanLoc = item.location.split("(")[0].trim();
        if (cleanLoc) locationsSet.add(cleanLoc);
      }
    });

    const jobTypes = Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count
    }));

    return res.status(200).json({
      success: true,
      jobs: dbJobs,
      pagination: {
        totalJobs,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      filters: {
        jobTypes,
        locations: Array.from(locationsSet).sort()
      }
    });
  } catch (error) {
    console.error("Error retrieving jobs:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while retrieving jobs."
    });
  }
};

/**
 * GET /api/jobs/:id
 */
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    let job = null;
    try {
      job = await prisma.job.findUnique({
        where: { id }
      });
    } catch (dbErr) {
      console.warn("DB lookup failed, searching sample data:", dbErr.message);
    }

    if (!job) {
      job = sampleJobs.find((j) => j.id === id);
    }

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job opportunity not found."
      });
    }

    return res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    console.error("Error retrieving job by ID:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred."
    });
  }
};
