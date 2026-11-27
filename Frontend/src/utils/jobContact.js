const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Normalizes an external job application URL to an http(s) URL or null if invalid/unsafe.
 */
export function normalizeExternalUrl(rawUrl) {
  if (typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  const hasScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed);
  const candidate = hasScheme ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Normalizes a company contact email or returns null if invalid.
 */
export function normalizeContactEmail(rawEmail) {
  if (typeof rawEmail !== 'string') return null;
  const trimmed = rawEmail.trim();
  return EMAIL_RE.test(trimmed) ? trimmed : null;
}
