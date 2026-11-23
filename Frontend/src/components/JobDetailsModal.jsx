import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  FileText,
  X,
  CheckCircle2,
  Briefcase,
  Loader2
} from 'lucide-react';

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
    year: 'numeric'
  });
}

/**
 * JobDetailsModal
 * Displays full job information in a scrollable, accessible modal matching Careerly's design system.
 */
export default function JobDetailsModal({
  job,
  isOpen,
  onClose,
  isSaved = false,
  onToggleSave,
  isLoading = false,
  builderPath = '/app/builder/guest'
}) {
  // Lock background scroll & support Escape key to close
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const postedDate = formatPostedDate(job?.created_at);
  const badgeStyle = getJobTypeBadgeStyle(job?.job_type);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-details-modal-title"
    >
      <div
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] border border-[#E7E2D8] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Sticky Modal Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-[#E7E2D8] bg-gradient-to-r from-[#FFF8F3] via-white to-[#FAF8F4] flex items-start justify-between gap-4 shrink-0">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-[#5A554E] py-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#F46200]" />
              <span>Loading job details...</span>
            </div>
          ) : job ? (
            <div className="space-y-2.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F46200] bg-[#FFF3EB] px-2.5 py-1 rounded-lg border border-[#FAD7C0]">
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{job.company}</span>
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
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize bg-[#FAF8F4] text-[#5A554E] border border-[#E7E2D8]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {job.status}
                  </span>
                )}
              </div>

              <h2
                id="job-details-modal-title"
                className="font-serif text-2xl sm:text-3xl text-[#2D2D2D] leading-tight"
              >
                {job.title}
              </h2>

              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#5A554E] pt-0.5">
                {job.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8A847C]" />
                    {job.location}
                  </span>
                )}

                {job.salary_range && (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <DollarSign className="w-3.5 h-3.5" />
                    {job.salary_range}
                  </span>
                )}

                {postedDate && (
                  <span className="inline-flex items-center gap-1.5 text-[#8A847C]">
                    <Clock className="w-3.5 h-3.5" />
                    Posted {postedDate}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-[#5A554E] py-2">
              <Briefcase className="w-4 h-4 text-[#8A847C]" />
              <span>Job details unavailable</span>
            </div>
          )}

          {/* Top-right Action Buttons (Save + Close) */}
          <div className="flex items-center gap-2 shrink-0">
            {job && onToggleSave && (
              <button
                type="button"
                onClick={(e) => onToggleSave(job.id, e)}
                aria-label={isSaved ? 'Remove job from saved' : 'Save job'}
                title={isSaved ? 'Saved' : 'Save job'}
                className={`p-2 rounded-full border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-[#FFF3EB] border-[#FAD7C0] text-[#F46200]'
                    : 'bg-white border-[#E7E2D8] text-[#5A554E] hover:text-[#2D2D2D] hover:bg-[#FAF8F4]'
                }`}
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close job details"
              className="p-2 rounded-full bg-white border border-[#E7E2D8] text-[#5A554E] hover:text-[#2D2D2D] hover:bg-[#FAF8F4] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          className="p-6 sm:p-8 overflow-y-auto overscroll-contain space-y-6 flex-1 [scrollbar-width:thin]"
        >
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
              <Loader2 className="w-7 h-7 text-[#F46200] animate-spin" />
              <p className="text-sm font-medium text-[#5A554E]">Fetching role overview & requirements...</p>
            </div>
          ) : !job ? (
            <div className="py-10 text-center space-y-2">
              <p className="text-base font-semibold text-[#2D2D2D]">Job not found</p>
              <p className="text-xs text-[#5A554E]">
                This job posting may have been removed or is no longer available.
              </p>
            </div>
          ) : (
            <>
              {/* About The Role */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D]">
                  About The Role
                </h3>
                {job.description ? (
                  <p className="text-sm text-[#5A554E] leading-relaxed whitespace-pre-line">
                    {job.description}
                  </p>
                ) : (
                  <p className="text-sm italic text-[#8A847C]">
                    No role description provided by the employer.
                  </p>
                )}
              </div>

              {/* Requirements & Qualifications */}
              {job.requirements && (
                <div className="space-y-2.5 pt-5 border-t border-[#E7E2D8]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D]">
                    Key Requirements &amp; Qualifications
                  </h3>
                  <div className="bg-[#FAF8F4] p-4 sm:p-5 rounded-2xl border border-[#E7E2D8] text-xs sm:text-sm text-[#5A554E] leading-relaxed whitespace-pre-line">
                    {job.requirements}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sticky Footer / CTAs */}
        {!isLoading && job && (
          <div className="px-6 sm:px-8 py-4 bg-[#FAF8F4] border-t border-[#E7E2D8] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <Link
              to={builderPath}
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-[#F46200] bg-white border border-[#FAD7C0] hover:bg-[#FFF3EB] transition-all shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tailor My CV for This Role</span>
            </Link>

            {job.job_url ? (
              <a
                href={job.job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#F46200] hover:bg-[#DC5800] transition-all shadow-xs cursor-pointer"
              >
                <span>Apply on Company Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span className="text-xs font-medium text-[#8A847C]">
                Contact company directly to apply
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
