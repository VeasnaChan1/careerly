
import { Mail, ExternalLink } from 'lucide-react';

const ApplyButton = ({ job }) => {
  const { contact_email, apply_url, title, company_name } = job;

  if (!contact_email && !apply_url) {
    return (
      <button
        disabled
        title="The company hasn't provided contact details yet"
        className="px-5 py-2.5 text-sm font-semibold text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
      >
        Contact not available
      </button>
    );
  }

  const baseClass =
    'inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#F46200] hover:bg-[#DC5800] rounded-lg transition-colors';

  // Prefer the external link if both exist
  if (apply_url) {
    return (
      <a href={apply_url} target="_blank" rel="noopener noreferrer" className={baseClass}>
        <ExternalLink className="size-4" />
        <span>Apply now</span>
      </a>
    );
  }

  const subject = encodeURIComponent(`Application for ${title}${company_name ? ` at ${company_name}` : ''}`);
  return (
    <a href={`mailto:${contact_email}?subject=${subject}`} className={baseClass}>
      <Mail className="size-4" />
      <span>Contact company</span>
    </a>
  );
};

export default ApplyButton;