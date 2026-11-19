/**
 * Utility to strip null bytes (\0 or \u0000 / 0x00) from strings and nested objects.
 * PostgreSQL rejects 0x00 bytes in all UTF-8 TEXT/VARCHAR columns with error code 22021:
 * "invalid byte sequence for encoding \"UTF8\": 0x00".
 */
export const cleanNullBytes = (val) => {
  if (typeof val === 'string') {
    return val.replace(/\0/g, '').replace(/\u0000/g, '');
  }
  if (Array.isArray(val)) {
    return val.map(cleanNullBytes);
  }
  if (val !== null && typeof val === 'object') {
    const cleaned = {};
    for (const key of Object.keys(val)) {
      cleaned[key] = cleanNullBytes(val[key]);
    }
    return cleaned;
  }
  return val;
};

export default cleanNullBytes;
