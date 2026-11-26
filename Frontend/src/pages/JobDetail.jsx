import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import api from '../config/api';
import ApplyButton from '../components/ApplyButton';

const JobDetail = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/api/jobs/get/${jobId}`);
        setJob(data.job);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load job');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [jobId]);

  if (loading) return <p className="p-8 text-center text-sm text-gray-500">Loading...</p>;
  if (error || !job) return <p className="p-8 text-center text-sm text-rose-600">{error || 'Job not found'}</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link to="/" className="inline-flex gap-2 items-center text-sm font-semibold text-slate-600 hover:text-slate-900">
        <ArrowLeftIcon className="size-4" />
        <span>Back</span>
      </Link>

      {/* Header: the button sits here so it is visible without scrolling */}
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{job.title}</h1>
          <p className="text-sm text-slate-500 mt-1">{job.company_name}</p>
        </div>
        <ApplyButton job={job} />
      </div>

      <div className="mt-6 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
        {job.description}
      </div>
    </div>
  );
};

export default JobDetail;