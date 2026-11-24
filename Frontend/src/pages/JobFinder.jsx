import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  Building2,
  Clock,
  DollarSign,
  Search,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JobDetailsModal from '../components/JobDetailsModal';
import { fetchJobs, fetchJobById, getSavedJobIds, toggleSavedJobId } from '../services/jobApi';

// Job Type Badge Component
function JobTypeBadge({ type }) {
  const t = (type || 'Full-time').toLowerCase();
  let badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200';

  if (t.includes('intern')) {
    badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (t.includes('hybrid')) {
    badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (t.includes('remote')) {
    badgeStyle = 'bg-purple-50 text-purple-700 border-purple-200';
  } else if (t.includes('contract') || t.includes('part-time')) {
    badgeStyle = 'bg-stone-100 text-stone-700 border-stone-200';
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide border ${badgeStyle}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {type}
    </span>
  );
}

export default function JobFinder({ publicMode = true }) {
  const location = useLocation();
  const navigate = useNavigate();
  const listTopRef = useRef(null);

  // Job Data & Pagination
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({
    totalJobs: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 9,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [availableJobTypes, setAvailableJobTypes] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [onlySaved, setOnlySaved] = useState(false);

  // Bookmarks
  const [savedJobIds, setSavedJobIds] = useState([]);

  // Selected Job for Detail Modal
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeJob, setActiveJob] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const detailRequestIdRef = useRef(0);

  // Load Saved Job IDs from localStorage
  useEffect(() => {
    setSavedJobIds(getSavedJobIds());
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load Jobs from API
  useEffect(() => {
    let isMounted = true;
    async function loadJobsData() {
      setIsLoading(true);
      try {
        const res = await fetchJobs({
          page: pagination.currentPage,
          limit: pagination.limit,
          search: debouncedSearch,
          job_type: selectedType,
          location: selectedLocation,
          sort: selectedSort
        });

        if (isMounted && res.success) {
          setJobs(res.jobs || []);
          setPagination(res.pagination);
          if (res.filters?.jobTypes) setAvailableJobTypes(res.filters.jobTypes);
          if (res.filters?.locations) setAvailableLocations(res.filters.locations);
        }
      } catch (err) {
        console.error('Failed to load jobs:', err);
        toast.error('Unable to fetch jobs from server. Showing local opportunities.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadJobsData();
    return () => {
      isMounted = false;
    };
  }, [pagination.currentPage, pagination.limit, debouncedSearch, selectedType, selectedLocation, selectedSort]);

  // Handle Page Change with smooth scroll
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
      if (listTopRef.current) {
        listTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Open Job Details & fetch fresh record by ID
  const openJobDetails = async (jobOrId) => {
    const jobId = typeof jobOrId === 'string' ? jobOrId : jobOrId?.id;
    const fallbackJob = typeof jobOrId === 'object' ? jobOrId : null;

    if (!jobId) {
      setActiveJob(fallbackJob);
      setIsDetailOpen(true);
      setIsDetailLoading(false);
      return;
    }

    const requestId = ++detailRequestIdRef.current;
    setIsDetailOpen(true);
    setIsDetailLoading(true);
    setActiveJob(fallbackJob);

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('job', jobId);
      return next;
    }, { replace: true });

    try {
      const freshJob = await fetchJobById(jobId);
      if (detailRequestIdRef.current !== requestId) return;
      setActiveJob(freshJob || null);
    } catch (error) {
      if (detailRequestIdRef.current !== requestId) return;
      if (error?.response?.status === 404) {
        setActiveJob(null);
      } else if (fallbackJob) {
        setActiveJob(fallbackJob);
        toast.error('Could not refresh full job details; showing cached summary.');
      } else {
        setActiveJob(null);
        toast.error('Failed to load job details.');
      }
    } finally {
      if (detailRequestIdRef.current === requestId) {
        setIsDetailLoading(false);
      }
    }
  };

  const closeJobDetails = () => {
    detailRequestIdRef.current += 1;
    setIsDetailOpen(false);
    setIsDetailLoading(false);
    setActiveJob(null);

    if (searchParams.has('job')) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete('job');
        return next;
      }, { replace: true });
    }
  };

  // Open job details automatically if ?job=<id> is in URL on mount
  useEffect(() => {
    const initialJobId = searchParams.get('job');
    if (initialJobId) {
      openJobDetails(initialJobId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toggle Bookmark
  const handleToggleBookmark = (id, e) => {
    if (e) e.stopPropagation();
    const updated = toggleSavedJobId(id);
    setSavedJobIds(updated);
    const isNow = updated.includes(id);
    toast.success(isNow ? 'Job saved to your bookmarks' : 'Removed from bookmarks');
  };

  // Reset All Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedType('all');
    setSelectedLocation('all');
    setSelectedSort('newest');
    setOnlySaved(false);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Client-side saved jobs filtering if toggled
  const displayedJobs = onlySaved
    ? jobs.filter((j) => savedJobIds.includes(j.id))
    : jobs;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#2D2D2D] selection:bg-[#F46200]/20 selection:text-[#F46200]">
      {publicMode && <Navbar />}

      <main className="flex-grow py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E7E2D8] shadow-[0_10px_30px_-15px_rgba(45,45,45,0.05)] mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E7E2D8]">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF3EB] border border-[#FAD7C0] text-xs font-bold text-[#F46200] mb-3">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Verified Local Opportunities · 1-Click Apply</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl text-[#2D2D2D] tracking-tight leading-snug">
                  Explore tech and business jobs across Cambodia.
                </h1>
                <p className="mt-3 text-base text-[#5A554E] leading-relaxed">
                  Stop hunting through unverified Telegram groups. Browse open roles from top commercial banks, telecom operators, tech hubs, and international development agencies. Apply directly using your Careerly CV.
                </p>
              </div>

              {/* Stats Highlights */}
              <div className="flex flex-row lg:flex-col gap-3 shrink-0">
                <div className="bg-[#FAF8F4] py-3 px-5 rounded-2xl border border-[#E7E2D8] text-center min-w-[140px]">
                  <p className="text-2xl font-extrabold text-[#F46200]">{pagination.totalJobs}</p>
                  <p className="text-xs font-medium text-[#5A554E]">Available Positions</p>
                </div>
                <div className="bg-[#FAF8F4] py-3 px-5 rounded-2xl border border-[#E7E2D8] text-center min-w-[140px]">
                  <p className="text-2xl font-extrabold text-[#2D2D2D]">{savedJobIds.length}</p>
                  <p className="text-xs font-medium text-[#5A554E]">Saved Jobs</p>
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A847C]">
                  Quick Filter:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedType('all');
                    setPagination((prev) => ({ ...prev, currentPage: 1 }));
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedType === 'all'
                      ? 'bg-[#F46200] text-white shadow-xs'
                      : 'bg-[#FAF8F4] text-[#5A554E] hover:text-[#2D2D2D] border border-[#E7E2D8]'
                  }`}
                >
                  All Types
                </button>
                {availableJobTypes.map((t) => (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => {
                      setSelectedType(t.type);
                      setPagination((prev) => ({ ...prev, currentPage: 1 }));
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedType === t.type
                        ? 'bg-[#F46200] text-white shadow-xs'
                        : 'bg-[#FAF8F4] text-[#5A554E] hover:text-[#2D2D2D] border border-[#E7E2D8]'
                    }`}
                  >
                    {t.type} ({t.count})
                  </button>
                ))}
              </div>

              <Link
                to="/app/builder/guest"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F46200] hover:text-[#DC5800] transition-colors"
              >
                <span>Prepare your CV first</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div ref={listTopRef} className="bg-white p-5 rounded-2xl border border-[#E7E2D8] shadow-xs mb-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Search Keyword Input (6 cols) */}
              <div className="md:col-span-6 relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A847C]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by job title, company name, or skills (e.g. React, ABA Bank, QA)..."
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#FAF8F4] border border-[#E7E2D8] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F46200]/30 focus:border-[#F46200] text-[#2D2D2D] placeholder-[#8A847C]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A847C] hover:text-[#2D2D2D]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Location Select (3 cols) */}
              <div className="md:col-span-3">
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A847C]" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => {
                      setSelectedLocation(e.target.value);
                      setPagination((prev) => ({ ...prev, currentPage: 1 }));
                    }}
                    className="w-full pl-9 pr-8 py-2.5 text-xs font-semibold bg-[#FAF8F4] border border-[#E7E2D8] rounded-xl text-[#2D2D2D] focus:outline-none focus:border-[#F46200] cursor-pointer appearance-none"
                  >
                    <option value="all">All Locations in Cambodia</option>
                    {availableLocations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sort By Select (3 cols) */}
              <div className="md:col-span-3">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-semibold bg-[#FAF8F4] border border-[#E7E2D8] rounded-xl text-[#2D2D2D] focus:outline-none focus:border-[#F46200] cursor-pointer"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="company">Sort: Company Name (A-Z)</option>
                  <option value="title">Sort: Job Title (A-Z)</option>
                  <option value="oldest">Sort: Oldest First</option>
                </select>
              </div>
            </div>

            {/* Bottom Filter Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E7E2D8]/60 text-xs text-[#5A554E]">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer hover:text-[#2D2D2D]">
                  <input
                    type="checkbox"
                    checked={onlySaved}
                    onChange={(e) => setOnlySaved(e.target.checked)}
                    className="custom-checkbox"
                  />
                  <span>Show Saved Jobs Only ({savedJobIds.length})</span>
                </label>
              </div>

              <div className="flex items-center gap-3">
                {(debouncedSearch || selectedType !== 'all' || selectedLocation !== 'all' || onlySaved) && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#F46200] hover:text-[#DC5800] cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                )}
                <span className="text-xs text-[#8A847C]">
                  Showing <strong className="text-[#2D2D2D]">{displayedJobs.length}</strong> of{' '}
                  <strong className="text-[#2D2D2D]">{pagination.totalJobs}</strong> jobs
                </span>
              </div>
            </div>
          </div>

          {/* JOB CARDS LIST */}
          {isLoading ? (
            <div className="py-24 text-center">
              <div className="inline-block w-8 h-8 border-3 border-[#F46200] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm font-medium text-[#5A554E]">Loading job opportunities...</p>
            </div>
          ) : displayedJobs.length === 0 ? (
            /* EMPTY STATE: Satisfies Acceptance Criterion 3 */
            <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-[#E7E2D8] shadow-xs">
              <div className="w-16 h-16 bg-[#FFF3EB] border border-[#FAD7C0] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#F46200]">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2D2D2D]">
                No jobs match your criteria
              </h3>
              <p className="text-sm text-[#5A554E] max-w-md mx-auto mt-2 mb-6 leading-relaxed">
                We couldn't find any positions matching your search or filters. Try adjusting your keyword search, clearing location filters, or reset to see all roles.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#F46200] hover:bg-[#DC5800] transition-all cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear All Filters</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Job Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedJobs.map((job) => {
                  const isSaved = savedJobIds.includes(job.id);

                  return (
                    /* Job Card: Satisfies Acceptance Criterion 1 (Title, Company, Location, Job Type) */
                    <div
                      key={job.id}
                      onClick={() => openJobDetails(job)}
                      className="bg-white rounded-2xl p-6 border border-[#E7E2D8] hover:border-[#FAD7C0] hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer group"
                    >
                      <div className="space-y-3.5">
                        {/* Header Row: Company & Job Type */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-xl bg-[#FAF8F4] border border-[#E7E2D8] text-[#5A554E] group-hover:text-[#F46200] group-hover:border-[#FAD7C0] transition-colors">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-[#5A554E] truncate max-w-[150px]">
                              {job.company}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* AC 1: Job Type */}
                            <JobTypeBadge type={job.job_type} />
                            <button
                              type="button"
                              onClick={(e) => handleToggleBookmark(job.id, e)}
                              title={isSaved ? 'Remove bookmark' : 'Bookmark job'}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                isSaved
                                  ? 'bg-[#FFF3EB] border-[#FAD7C0] text-[#F46200]'
                                  : 'bg-white border-[#E7E2D8] text-[#8A847C] hover:text-[#2D2D2D]'
                              }`}
                            >
                              {isSaved ? (
                                <BookmarkCheck className="w-3.5 h-3.5 fill-current" />
                              ) : (
                                <Bookmark className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* AC 1: Title */}
                        <h3 className="text-lg font-bold text-[#2D2D2D] group-hover:text-[#F46200] transition-colors leading-snug line-clamp-2">
                          {job.title}
                        </h3>

                        {/* AC 1: Location & Salary */}
                        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-[#5A554E]">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#8A847C]" />
                            {job.location || 'Phnom Penh'}
                          </span>
                          {job.salary_range && (
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <DollarSign className="w-3 h-3" />
                              {job.salary_range}
                            </span>
                          )}
                        </div>

                        {/* Description Preview */}
                        <p className="text-xs text-[#5A554E] line-clamp-3 leading-relaxed">
                          {job.description}
                        </p>
                      </div>

                      {/* Card Footer: CTA */}
                      <div className="pt-4 mt-4 border-t border-[#EFECE6] flex items-center justify-between">
                        <span className="text-[11px] text-[#8A847C]">Verified by Careerly</span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#F46200] group-hover:translate-x-0.5 transition-transform">
                          <span>View Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PAGINATION CONTROLS: Satisfies Acceptance Criterion 2 (Paginated / scrollable) */}
              {pagination.totalPages > 1 && (
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E7E2D8] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                  <div className="text-xs text-[#5A554E]">
                    Page <strong className="text-[#2D2D2D]">{pagination.currentPage}</strong> of{' '}
                    <strong className="text-[#2D2D2D]">{pagination.totalPages}</strong> ({pagination.totalJobs} total jobs)
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Previous Button */}
                    <button
                      type="button"
                      disabled={!pagination.hasPrevPage}
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        pagination.hasPrevPage
                          ? 'bg-white border-[#E7E2D8] text-[#2D2D2D] hover:bg-[#FAF8F4]'
                          : 'bg-stone-50 border-stone-200 text-[#8A847C] cursor-not-allowed opacity-60'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Prev</span>
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          pagination.currentPage === pageNum
                            ? 'bg-[#F46200] text-white shadow-xs'
                            : 'bg-white border border-[#E7E2D8] text-[#5A554E] hover:text-[#2D2D2D] hover:bg-[#FAF8F4]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    {/* Next Button */}
                    <button
                      type="button"
                      disabled={!pagination.hasNextPage}
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        pagination.hasNextPage
                          ? 'bg-white border-[#E7E2D8] text-[#2D2D2D] hover:bg-[#FAF8F4]'
                          : 'bg-stone-50 border-stone-200 text-[#8A847C] cursor-not-allowed opacity-60'
                      }`}
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* JOB DETAILS MODAL */}
          <JobDetailsModal
            job={activeJob}
            isOpen={isDetailOpen}
            isLoading={isDetailLoading}
            onClose={closeJobDetails}
            isSaved={activeJob ? savedJobIds.includes(activeJob.id) : false}
            onToggleSave={handleToggleBookmark}
            builderPath={publicMode ? '/app/builder/guest' : '/app/builder'}
          />

        </div>
      </main>

      {publicMode && <Footer />}
    </div>
  );
}
