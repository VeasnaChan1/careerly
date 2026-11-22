import api from '../config/api';

/**
 * Fetch jobs with optional filters and pagination:
 * @param {Object} params
 * @param {number} [params.page=1] - current page
 * @param {number} [params.limit=9] - jobs per page
 * @param {string} [params.search] - query keyword
 * @param {string} [params.job_type] - 'all' or specific type (Full-time, Internship, etc.)
 * @param {string} [params.location] - 'all' or location substring
 * @param {string} [params.sort='newest'] - 'newest' | 'oldest' | 'company' | 'title'
 */
export const fetchJobs = async (params = {}) => {
  try {
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
        hasPrevPage: false
      },
      filters: { jobTypes: [], locations: [] }
    };
  } catch (error) {
    console.error('Error in fetchJobs:', error.message);
    throw error;
  }
};

/**
 * Fetch a single job by ID
 * @param {string} id
 */
export const fetchJobById = async (id) => {
  try {
    const response = await api.get(`/api/jobs/${id}`);
    if (response.data && response.data.success) {
      return response.data.job;
    }
    return null;
  } catch (error) {
    console.error('Error in fetchJobById:', error.message);
    throw error;
  }
};

/**
 * Local storage helpers for Bookmarked / Saved Jobs
 */
const STORAGE_SAVED_JOBS_KEY = 'careerly_saved_jobs';

export const getSavedJobIds = () => {
  try {
    const raw = localStorage.getItem(STORAGE_SAVED_JOBS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
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
  } catch (e) {
    return [];
  }
};
