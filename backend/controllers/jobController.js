import { findJobById } from '../repositories/jobRepository.js';

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