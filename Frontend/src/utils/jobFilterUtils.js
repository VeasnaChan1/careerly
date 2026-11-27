/**
 * Pure helper to filter and sort job listings in frontend state.
 * Supports case-insensitive keyword search, multi-select job types,
 * multi-select locations, saved-only filter, and sorting.
 */
export function filterAndSortJobs(
  jobs = [],
  {
    search = '',
    selectedTypes = [],
    selectedLocations = [],
    onlySaved = false,
    savedJobIds = [],
    sort = 'newest'
  } = {}
) {
  const query = (search || '').trim().toLowerCase();

  let result = jobs.filter((job) => {
    if (onlySaved && !savedJobIds.includes(job.id)) {
      return false;
    }

    if (selectedTypes.length > 0) {
      const jobType = (job.job_type || '').toLowerCase();
      const matchesType = selectedTypes.some((t) => t.toLowerCase() === jobType);
      if (!matchesType) return false;
    }

    if (selectedLocations.length > 0) {
      const jobLoc = (job.location || '').toLowerCase();
      const matchesLoc = selectedLocations.some((loc) =>
        jobLoc.includes(loc.toLowerCase())
      );
      if (!matchesLoc) return false;
    }

    if (query) {
      const searchable = [
        job.title,
        job.company,
        job.location,
        job.description,
        job.requirements
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (!searchable.includes(query)) return false;
    }

    return true;
  });

  if (sort === 'company') {
    result = [...result].sort((a, b) => (a.company || '').localeCompare(b.company || ''));
  } else if (sort === 'title') {
    result = [...result].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  } else if (sort === 'oldest') {
    result = [...result].sort(
      (a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0)
    );
  } else {
    result = [...result].sort(
      (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
    );
  }

  return result;
}
