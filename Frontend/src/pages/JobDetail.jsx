import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  FileText,
  Mail,
  ExternalLink,
  Briefcase
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ApplyButton from '../components/ApplyButton';
import { normalizeContactEmail, normalizeExternalUrl } from '../utils/jobContact';
import { fetchJobById, getSavedJobIds, toggleSavedJobId } from '../services/jobApi';

function getJobTypeBadgeStyle(type) {
  const t = (type || 'Full-time').toLowerCase();
  if (t.includes('intern')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (t.includes('hybrid')) return 'bg-amber-50 text-amber-700 border-amber-200';
  if (t.includes('remote')) return 'bg-purple-50 text-purple-700 border-purple-200';
  if (t.includes('contract') || t.includes('part-time')) return 'bg-stone-100 text-stone-700 border-stone-200';
  return 'bg-blue-50 text-blue-700 border-blue-200';
}

function formatPostedDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function JobDetail({ publicMode = true }) {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedIds, setSavedIds] = useState(() => getSavedJobIds());

  const jobsListPath = publicMode ? '/jobs' : '/app/jobs';
  const builderPath = publicMode ? '/app/builder/guest' : '/app/builder';

  useEffect(() => {
    let active = true;
    const loadJob = async () => {
      setLoading(true);
      setError('');
      try {
        const fetched = await fetchJobById(jobId);
        if (!active) return;
        if (!fetched) {
          setError('Job not found');
        } else {
          setJob(fetched);
        }
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || 'Failed to load job details');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadJob();
    return () => {
      active = false;
    };
  }, [jobId]);

  const handleToggleSave = () => {
    if (!job?.id) return;
    setSavedIds(toggleSavedJobId(job.id));
  };

  const isSaved = job?.id ? savedIds.includes(job.id) : false;
  const postedDate = formatPostedDate(job?.created_at);
  const badgeStyle = getJobTypeBadgeStyle(job?.job_type);
  const safeUrl = normalizeExternalUrl(job?.job_url || job?.apply_url);
  const safeEmail = normalizeContactEmail(job?.contact_email);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#2D2D2D]">
      {publicMode && <Navbar />}

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-4">
          <Link
            to={jobsListPath}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#5A554E] hover:text-[#F46200] transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Jobs</span>
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl border border-[#E7E2D8] p-12 text-center shadow-xs">
            <div className="inline-block w-8 h-8 border-3 border-[#F46200] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-medium text-[#5A554E]">Loading job details...</p>
          </div>
        ) : error || !job ? (
          <div className="bg-white rounded-3xl border border-[#E7E2D8] p-10 sm:p-14 text-center shadow-xs space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF3EB] border border-[#FAD7C0] text-[#F46200] flex items-center justify-center mx-auto">
              <Briefcase className="size-7" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#2D2D2D]">
              {error || 'Job not found'}
            </h1>
            <p className="text-sm text-[#5A554E] max-w-md mx-auto">
              This position may have been closed or the link might be incorrect.
            </p>
            <Link
              to={jobsListPath}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[#F46200] hover:bg-[#DC5800] transition-colors"
            >
              Browse Open Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Above-the-fold Header Card: Apply/Contact button is placed directly in the top header */}
            <section className="bg-white rounded-3xl border border-[#E7E2D8] shadow-xs overflow-hidden">
              <div className="p-6 sm:p-8 bg-gradient-to-r from-[#FFF8F3] via-white to-[#FAF8F4] flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="space-y-3 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F46200] bg-[#FFF3EB] px-3 py-1 rounded-lg border border-[#FAD7C0]">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{job.company || job.company_name}</span>
                    </span>

                    {job.job_type && (
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide border ${badgeStyle}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {job.job_type}
                      </span>
                    )}

                    {job.status && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize bg-white text-[#5A554E] border border-[#E7E2D8]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {job.status}
                      </span>
                    )}
                  </div>

                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2D2D2D] leading-tight">
                    {job.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#5A554E]">
                    {job.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#8A847C]" />
                        {job.location}
                      </span>
                    )}
                    {job.salary_range && (
                      <span className="inline-flex items-center gap-1.5 font-semibold text-[#2D2D2D]">
                        <DollarSign className="w-4 h-4 text-[#F46200]" />
                        {job.salary_range}
                      </span>
                    )}
                    {postedDate && (
                      <span className="inline-flex items-center gap-1.5 text-[#8A847C]">
                        <Clock className="w-4 h-4" />
                        Posted {postedDate}
                      </span>
                    )}
                  </div>
                </div>

                {/* Primary CTA pinned in the top-right header area on desktop */}
                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center md:items-end lg:items-center gap-3 shrink-0">
                  <ApplyButton job={job} fullWidthMobile />

                  <button
                    type="button"
                    onClick={handleToggleSave}
                    aria-label={isSaved ? 'Remove job from saved' : 'Save job'}
                    title={isSaved ? 'Saved' : 'Save job'}
                    className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold border transition-all cursor-pointer ${
                      isSaved
                        ? 'bg-[#FFF3EB] border-[#FAD7C0] text-[#F46200]'
                        : 'bg-white border-[#E7E2D8] text-[#5A554E] hover:text-[#2D2D2D] hover:bg-[#FAF8F4]'
                    }`}
                  >
                    {isSaved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Job Details Content + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E7E2D8] p-6 sm:p-8 shadow-xs space-y-6">
                <div className="space-y-2.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D]">
                    About The Role
                  </h2>
                  {job.description ? (
                    <p className="text-sm sm:text-base text-[#5A554E] leading-relaxed whitespace-pre-line">
                      {job.description}
                    </p>
                  ) : (
                    <p className="text-sm italic text-[#8A847C]">
                      No role description provided by the employer.
                    </p>
                  )}
                </div>

                {job.requirements && (
                  <div className="space-y-3 pt-6 border-t border-[#E7E2D8]">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D]">
                      Key Requirements &amp; Qualifications
                    </h2>
                    <div className="bg-[#FAF8F4] p-5 rounded-2xl border border-[#E7E2D8] text-sm text-[#5A554E] leading-relaxed whitespace-pre-line">
                      {job.requirements}
                    </div>
                  </div>
                )}
              </div>

              <aside className="space-y-5">
                <div className="bg-white rounded-3xl border border-[#E7E2D8] p-6 shadow-xs space-y-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D]">
                    Contact &amp; Application
                  </h2>
                  {safeEmail || safeUrl ? (
                    <div className="space-y-3 text-xs text-[#5A554E]">
                      {safeEmail && (
                        <div className="flex items-start gap-2.5">
                          <Mail className="w-4 h-4 text-[#F46200] shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <p className="font-semibold text-[#2D2D2D]">Company Email</p>
                            <p className="break-all">{safeEmail}</p>
                          </div>
                        </div>
                      )}
                      {safeUrl && (
                        <div className="flex items-start gap-2.5">
                          <ExternalLink className="w-4 h-4 text-[#F46200] shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <p className="font-semibold text-[#2D2D2D]">Application Portal</p>
                            <p className="break-all">{safeUrl}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-[#8A847C] leading-relaxed">
                      This employer has not provided an application link or email address yet.
                    </p>
                  )}
                </div>

                <div className="bg-white rounded-3xl border border-[#E7E2D8] p-6 shadow-xs space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D]">
                    Stand Out Before Applying
                  </h2>
                  <p className="text-xs text-[#5A554E] leading-relaxed">
                    Tailor your CV to highlight relevant experience and keywords for this role.
                  </p>
                  <Link
                    to={builderPath}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-[#F46200] bg-[#FFF3EB] border border-[#FAD7C0] hover:bg-[#F46200] hover:text-white transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Tailor My CV for This Role</span>
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>

      {publicMode && <Footer />}
    </div>
  );
}
