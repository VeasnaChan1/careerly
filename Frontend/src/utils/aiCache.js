// In-memory frontend cache for AI generated suggestions & grammar checks
// Keyed by normalized prompt text and context to avoid burning daily API quota
const aiCache = new Map();
const grammarCache = new Map();

/**
 * Retrieve cached suggestions for a given text & context
 */
export const getCachedAiSuggestions = (text, context = '') => {
  if (!text) return null;
  const key = `${(context || '').trim().toLowerCase()}:::${text.trim().toLowerCase()}`;
  return aiCache.get(key) || null;
};

/**
 * Save suggestions to frontend cache
 */
export const setCachedAiSuggestions = (text, context = '', suggestions) => {
  if (!text || !Array.isArray(suggestions) || suggestions.length === 0) return;
  const key = `${(context || '').trim().toLowerCase()}:::${text.trim().toLowerCase()}`;
  aiCache.set(key, suggestions);
};

/**
 * Retrieve cached grammar check result
 */
export const getCachedGrammar = (text) => {
  if (!text) return null;
  const key = text.trim().toLowerCase();
  return grammarCache.get(key) || null;
};

/**
 * Save grammar check result to cache
 */
export const setCachedGrammar = (text, result) => {
  if (!text || !result) return;
  const key = text.trim().toLowerCase();
  grammarCache.set(key, result);
};

export default {
  get: getCachedAiSuggestions,
  set: setCachedAiSuggestions,
  getGrammar: getCachedGrammar,
  setGrammar: setCachedGrammar
};
