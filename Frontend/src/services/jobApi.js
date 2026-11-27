import api from '../config/api';

/**
 * Fetch paginated jobs with optional search, filter, and sort parameters.
 */
export const fetchJobs = async (params = {}) => {
  const response = await api.get('/api/jobs', { params });
  if (response.data && response.data.success) {
    return response.data;
  }
  return {
    success: false,
    jobs: [],
    pagination: {
      totalJobs: 0,
      totalPages: 1,
      currentPage: 1,
      limit: 9,
      hasNextPage: false,
      hasPrevPage: false,
    },
  };
};

/**
 * Fetch a single job by ID.
 */
export const fetchJobById = async (jobId) => {
  const response = await api.get(`/api/jobs/${jobId}`);
  if (response.data && response.data.success) {
    return response.data.job;
  }
  return response.data?.job || null;
};

const STORAGE_SAVED_JOBS_KEY = 'careerly_saved_jobs';

export const getSavedJobIds = () => {
  try {
    const raw = localStorage.getItem(STORAGE_SAVED_JOBS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const toggleSavedJobId = (id) => {
  try {
    const list = getSavedJobIds();
    const exists = list.includes(id);
    const updated = exists ? list.filter((item) => item !== id) : [...list, id];
    localStorage.setItem(STORAGE_SAVED_JOBS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};
