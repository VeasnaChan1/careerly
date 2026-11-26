import { findJobById, findJobs } from '../repositories/jobRepository.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!UUID_RE.test(jobId)) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const job = await findJobById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    return res.json({ job });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getJobs = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);

    const { jobs, total } = await findJobs({ page, limit });

    return res.json({
      jobs,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};