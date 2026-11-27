import { Mail, ExternalLink, Ban } from 'lucide-react';
import { normalizeContactEmail, normalizeExternalUrl } from '../utils/jobContact';

/**
 * ApplyButton
 * Renders a direct Apply/Contact action opening the company's external link or email client.
 */
export default function ApplyButton({ job, fullWidthMobile = false, size = 'default' }) {
  if (!job) return null;

  const title = job.title || 'Position';
  const companyName = job.company || job.company_name || '';
  const externalUrl = normalizeExternalUrl(job.job_url || job.apply_url);
  const contactEmail = normalizeContactEmail(job.contact_email);

  const sizeClasses =
    size === 'compact'
      ? 'px-4 py-2 text-xs'
      : 'px-5 py-2.5 text-sm';

  const widthClass = fullWidthMobile ? 'w-full sm:w-auto justify-center' : 'justify-center';

  if (!externalUrl && !contactEmail) {
    return (
      <button
        type="button"
        disabled
        title="The company hasn't provided contact details yet"
        aria-label="Contact not available"
        className={`inline-flex items-center gap-2 ${sizeClasses} ${widthClass} font-semibold text-[#8A847C] bg-[#FAF8F4] border border-[#E7E2D8] rounded-full cursor-not-allowed`}
      >
        <Ban className="size-4 shrink-0" />
        <span>Contact not available</span>
      </button>
    );
  }

  const subject = encodeURIComponent(
    `Application for ${title}${companyName ? ` at ${companyName}` : ''}`
  );
  const mailtoHref = contactEmail ? `mailto:${contactEmail}?subject=${subject}` : null;

  const primaryClass = `inline-flex items-center gap-2 ${sizeClasses} ${widthClass} font-semibold text-white bg-[#F46200] hover:bg-[#DC5800] active:scale-[0.98] rounded-full transition-all shadow-xs`;
  const secondaryClass = `inline-flex items-center gap-2 ${sizeClasses} ${widthClass} font-semibold text-[#F46200] bg-white border border-[#FAD7C0] hover:bg-[#FFF3EB] active:scale-[0.98] rounded-full transition-all shadow-xs`;

  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${fullWidthMobile ? 'w-full sm:w-auto' : ''}`}>
      {externalUrl ? (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={primaryClass}
        >
          <span>Apply Now</span>
          <ExternalLink className="size-4 shrink-0" />
        </a>
      ) : (
        <a href={mailtoHref} className={primaryClass}>
          <Mail className="size-4 shrink-0" />
          <span>Contact Company</span>
        </a>
      )}

      {externalUrl && mailtoHref && (
        <a href={mailtoHref} className={secondaryClass} title={`Email ${contactEmail}`}>
          <Mail className="size-4 shrink-0" />
          <span>Email Company</span>
        </a>
      )}
    </div>
  );
}
