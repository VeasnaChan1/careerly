// PostgreSQL text fields cannot store embedded null characters.
export function cleanResumeData(value) {
  if (typeof value === "string") return value.replaceAll("\u0000", "");
  if (Array.isArray(value)) return value.map(cleanResumeData);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, field]) => [key, cleanResumeData(field)])
    );
  }
  return value;
}
