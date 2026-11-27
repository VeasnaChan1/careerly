import { findJobById, findJobs } from "../repositories/jobRepository.js";
import { sampleJobs } from "../data/sampleJobs.js";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function filterSampleJobs({ search, job_type, location, sort }) {
  let list = [...sampleJobs];

  if (job_type && job_type.toLowerCase() !== "all") {
    list = list.filter((j) => j.job_type?.toLowerCase() === job_type.toLowerCase());
  }

  if (location && location.toLowerCase() !== "all") {
    list = list.filter((j) => j.location?.toLowerCase().includes(location.toLowerCase()));
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q) ||
        j.description?.toLowerCase().includes(q) ||
        j.requirements?.toLowerCase().includes(q)
    );
  }

  if (sort === "oldest") {
    list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  } else if (sort === "company") {
    list.sort((a, b) => a.company.localeCompare(b.company));
  } else if (sort === "title") {
    list.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  return list;
}

/**
 * GET /api/jobs/:jobId
 */
export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!UUID_RE.test(jobId)) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    let job = null;
    try {
      job = await findJobById(jobId);
    } catch (dbErr) {
      console.warn("DB lookup failed, falling back to sample jobs:", dbErr.message);
    }

    if (!job) {
      job = sampleJobs.find((j) => j.id === jobId) || null;
    }

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    return res.status(200).json({ success: true, job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/jobs
 */
export const getJobs = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 9, 1), 50);
    const { search = "", job_type = "all", location = "all", sort = "newest" } = req.query;

    let jobs = [];
    let total = 0;
    let dbFailed = false;

    try {
      const result = await findJobs({ page, limit, search, job_type, location, sort });
      jobs = result.jobs;
      total = result.total;
    } catch (dbErr) {
      dbFailed = true;
      console.warn("DB query failed, falling back to sample jobs:", dbErr.message);
    }

    // Fall back to sample data if DB is unreachable or unseeded (no filters & 0 total)
    const hasActiveFilter =
      Boolean(search.trim()) ||
      job_type.toLowerCase() !== "all" ||
      location.toLowerCase() !== "all";

    if (dbFailed || (total === 0 && !hasActiveFilter)) {
      const filtered = filterSampleJobs({ search, job_type, location, sort });
      total = filtered.length;
      jobs = filtered.slice((page - 1) * limit, page * limit);
    }

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    return res.status(200).json({
      success: true,
      jobs,
      page,
      limit,
      total,
      totalPages,
      pagination: {
        totalJobs: total,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
