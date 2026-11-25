import api from '../config/api';

/**
 * Fetch interview questions with optional filters:
 * @param {Object} params
 * @param {string} [params.category] - 'all' or category id (e.g. 'behavioral', 'technical')
 * @param {string} [params.difficulty] - 'all' or 'Easy' | 'Medium' | 'Hard'
 * @param {string} [params.search] - query string
 * @param {string} [params.job_role] - target role
 */
export const getInterviewQuestions = async (params = {}) => {
  try {
    const response = await api.get('/api/interview/questions', { params });
    if (response.data && response.data.success) {
      return response.data;
    }
    return { success: false, questions: [], total: 0, countsByCategory: {} };
  } catch (error) {
    console.error('Error in getInterviewQuestions:', error.message);
    throw error;
  }
};

/**
 * Fetch a single interview question by ID
 * @param {string} id
 */
export const getInterviewQuestionById = async (id) => {
  try {
    const response = await api.get(`/api/interview/questions/${id}`);
    if (response.data && response.data.success) {
      return response.data.question;
    }
    return null;
  } catch (error) {
    console.error('Error in getInterviewQuestionById:', error.message);
    throw error;
  }
};

/**
 * Fetch all categories with live question counts
 */
export const getInterviewCategories = async () => {
  try {
    const response = await api.get('/api/interview/categories');
    if (response.data && response.data.success) {
      return response.data;
    }
    return { success: false, categories: [], totalQuestions: 0 };
  } catch (error) {
    console.error('Error in getInterviewCategories:', error.message);
    throw error;
  }
};

/**
 * Fetch UX interview preparation guide, STAR breakdown, and checklists
 */
export const getInterviewGuide = async () => {
  try {
    const response = await api.get('/api/interview/guide');
    if (response.data && response.data.success) {
      return response.data.guide;
    }
    return null;
  } catch (error) {
    console.error('Error in getInterviewGuide:', error.message);
    throw error;
  }
};

/**
 * Local storage helpers for user practice progress and bookmarks
 */
const STORAGE_PRACTICED_KEY = 'careerly_interview_practiced';
const STORAGE_BOOKMARKS_KEY = 'careerly_interview_bookmarks';
const STORAGE_ANSWERS_KEY = 'careerly_interview_answers';

export const getPracticedQuestionIds = () => {
  try {
    const raw = localStorage.getItem(STORAGE_PRACTICED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const togglePracticedQuestion = (id) => {
  try {
    const list = getPracticedQuestionIds();
    const exists = list.includes(id);
    const updated = exists ? list.filter((item) => item !== id) : [...list, id];
    localStorage.setItem(STORAGE_PRACTICED_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const getBookmarkedQuestionIds = () => {
  try {
    const raw = localStorage.getItem(STORAGE_BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const toggleBookmarkedQuestion = (id) => {
  try {
    const list = getBookmarkedQuestionIds();
    const exists = list.includes(id);
    const updated = exists ? list.filter((item) => item !== id) : [...list, id];
    localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const getSavedPracticeAnswers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_ANSWERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

export const savePracticeAnswer = (id, answerText, selfRating = null) => {
  try {
    const current = getSavedPracticeAnswers();
    current[id] = {
      answer: answerText,
      selfRating,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_ANSWERS_KEY, JSON.stringify(current));
    return current;
  } catch (e) {
    return {};
  }
};

/**
 * Fetch stage-by-stage Interview Tips and Checklist (Before, During, After)
 */
export const getInterviewTips = async () => {
  try {
    const response = await api.get('/api/interview/tips');
    if (response.data && response.data.success) {
      return response.data.tips;
    }
    // Fallback: try from guide endpoint
    const guideRes = await api.get('/api/interview/guide');
    if (guideRes.data?.guide?.tips) {
      return guideRes.data.guide.tips;
    }
    return null;
  } catch (error) {
    console.error('Error in getInterviewTips:', error.message);
    throw error;
  }
};

/**
 * Local storage helpers for Interview Tips Checklist
 */
const STORAGE_CHECKLIST_KEY = 'careerly_interview_checklist_completed';

export const getCompletedChecklistItems = () => {
  try {
    const raw = localStorage.getItem(STORAGE_CHECKLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const toggleChecklistItem = (id) => {
  try {
    const list = getCompletedChecklistItems();
    const exists = list.includes(id);
    const updated = exists ? list.filter((item) => item !== id) : [...list, id];
    localStorage.setItem(STORAGE_CHECKLIST_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const resetChecklist = () => {
  try {
    localStorage.removeItem(STORAGE_CHECKLIST_KEY);
    return [];
  } catch (e) {
    return [];
  }
};
