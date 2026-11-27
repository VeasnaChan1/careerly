import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  Building2,
  DollarSign,
  Search,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JobDetailsModal from '../components/JobDetailsModal';
import { fetchJobs, fetchJobById, getSavedJobIds, toggleSavedJobId } from '../services/jobApi';

function JobTypeBadge({ type }) {
  const t = (type || 'Full-time').toLowerCase();
  let badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200';
  if (t.includes('intern')) badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  else if (t.includes('hybrid')) badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
  else if (t.includes('remote')) badgeStyle = 'bg-purple-50 text-purple-700 border-purple-200';
  else if (t.includes('contract') || t.includes('part-time')) badgeStyle = 'bg-stone-100 text-stone-700 border-stone-200';

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
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({
    totalJobs: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 9,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const [savedJobIds, setSavedJobIds] = useState(() => getSavedJobIds());
  const [activeJob, setActiveJob] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const detailBasePath = publicMode ? '/jobs' : '/app/jobs';
  const builderPath = publicMode ? '/app/builder/guest' : '/app/builder';

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setIsLoading(true);
      setFetchError('');
      try {
        const data = await fetchJobs({
          page: pagination.currentPage,
          limit: pagination.limit,
          search: debouncedSearch,
          job_type: selectedType,
        });
        if (!active) return;
        setJobs(data.jobs || []);
        if (data.pagination) {
          setPagination((prev) => ({ ...prev, ...data.pagination }));
        }
      } catch (err) {
        if (!active) return;
        setFetchError(err?.response?.data?.message || 'Unable to load jobs right now.');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [pagination.currentPage, pagination.limit, debouncedSearch, selectedType]);

  const openJobModal = async (job) => {
    setActiveJob(job);
    setIsDetailOpen(true);
    setIsDetailLoading(true);
    try {
      const fullJob = await fetchJobById(job.id);
      if (fullJob) setActiveJob(fullJob);
    } catch {
      // Keep summary card data if detail request fails
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleToggleBookmark = (id, e) => {
    e?.stopPropagation();
    setSavedJobIds(toggleSavedJobId(id));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedType('all');
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#2D2D2D]">
      {publicMode && <Navbar />}

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E2D8] shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F46200]">
              <Briefcase className="w-3.5 h-3.5" />
              Careerly Job Board
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D2D2D]">
              Find your next opportunity
            </h1>
            <p className="text-sm text-[#5A554E] max-w-xl">
              Explore curated roles and apply directly via company links or email.
            </p>
          </div>

          <Link
            to={builderPath}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-[#F46200] bg-[#FFF3EB] border border-[#FAD7C0] hover:bg-[#F46200] hover:text-white transition-all shrink-0"
          >
            <span>Prepare your CV first</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Search & Type Filter */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E7E2D8] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8A847C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title, company, or location..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#E7E2D8] bg-[#FAF8F4] focus:bg-white focus:outline-none focus:border-[#F46200]"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setPagination((prev) => ({ ...prev, currentPage: 1 }));
            }}
            aria-label="Filter by job type"
            className="px-4 py-2.5 text-sm rounded-xl border border-[#E7E2D8] bg-[#FAF8F4] text-[#2D2D2D] focus:outline-none focus:border-[#F46200]"
          >
            <option value="all">All Job Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="internship">Internship</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-3 border-[#F46200] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-medium text-[#5A554E]">Loading job opportunities...</p>
          </div>
        ) : fetchError ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-[#E7E2D8] space-y-3">
            <p className="text-sm font-semibold text-rose-600">{fetchError}</p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold text-white bg-[#F46200] hover:bg-[#DC5800] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E7E2D8] space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#2D2D2D]">No jobs match your search</h2>
            <p className="text-sm text-[#5A554E]">Try clearing filters or searching a different keyword.</p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#F46200] hover:bg-[#DC5800] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => {
                const isSaved = savedJobIds.includes(job.id);
                return (
                  <article
                    key={job.id}
                    onClick={() => openJobModal(job)}
                    className="bg-white rounded-2xl p-6 border border-[#E7E2D8] hover:border-[#FAD7C0] hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F46200] bg-[#FFF3EB] px-2.5 py-1 rounded-lg border border-[#FAD7C0]">
                          <Building2 className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{job.company}</span>
                        </span>

                        <button
                          type="button"
                          onClick={(e) => handleToggleBookmark(job.id, e)}
                          aria-label={isSaved ? 'Remove job from saved' : 'Save job'}
                          className={`p-1.5 rounded-full border transition-colors cursor-pointer ${
                            isSaved
                              ? 'bg-[#FFF3EB] border-[#FAD7C0] text-[#F46200]'
                              : 'bg-white border-[#E7E2D8] text-[#8A847C] hover:text-[#2D2D2D]'
                          }`}
                        >
                          {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      </div>

                      <div>
                        <h2 className="font-serif text-xl font-bold text-[#2D2D2D] group-hover:text-[#F46200] transition-colors">
                          {job.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-[#5A554E]">
                          {job.job_type && <JobTypeBadge type={job.job_type} />}
                          {job.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#8A847C]" />
                              {job.location}
                            </span>
                          )}
                          {job.salary_range && (
                            <span className="inline-flex items-center gap-1 font-semibold text-[#2D2D2D]">
                              <DollarSign className="w-3.5 h-3.5 text-[#F46200]" />
                              {job.salary_range}
                            </span>
                          )}
                        </div>
                      </div>

                      {job.description && (
                        <p className="text-xs text-[#5A554E] line-clamp-3 leading-relaxed">
                          {job.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#EFECE6] flex items-center justify-between gap-2">
                      <Link
                        to={`${detailBasePath}/${job.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-semibold text-[#5A554E] hover:text-[#F46200] transition-colors"
                      >
                        Open Detail Page
                      </Link>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#F46200]">
                        <span>Quick View</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            {pagination.totalPages > 1 && (
              <div className="bg-white p-4 rounded-2xl border border-[#E7E2D8] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-[#5A554E]">
                  Page <strong className="text-[#2D2D2D]">{pagination.currentPage}</strong> of{' '}
                  <strong className="text-[#2D2D2D]">{pagination.totalPages}</strong> ({pagination.totalJobs} jobs)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!pagination.hasPrevPage}
                    onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#E7E2D8] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev</span>
                  </button>
                  <button
                    type="button"
                    disabled={!pagination.hasNextPage}
                    onClick={() => setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#E7E2D8] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <JobDetailsModal
          job={activeJob}
          isOpen={isDetailOpen}
          isLoading={isDetailLoading}
          onClose={() => setIsDetailOpen(false)}
          isSaved={activeJob ? savedJobIds.includes(activeJob.id) : false}
          onToggleSave={handleToggleBookmark}
          builderPath={builderPath}
          detailBasePath={detailBasePath}
        />
      </main>

      {publicMode && <Footer />}
    </div>
  );
}
