import {
  FilePenLine,
  LoaderCircle,
  Pencil,
  Plus,
  Trash2,
  UploadCloud,
  X,
  FileText,
  Calendar,
  Clock,
  Search,
  SlidersHorizontal,
  Eye,
  Lock,
  Globe,
  Sparkles,
  Copy,
  ExternalLink,
  FolderOpen
} from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../config/api';
import toast from 'react-hot-toast';
import ResumePreview from '../components/ResumePreview';

const LazyResumePreview = ({ resume }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-28 h-36 bg-white overflow-hidden rounded border border-slate-200/50 shadow-xs flex items-start justify-center transition-transform group-hover:scale-[1.03] duration-300 relative"
    >
      {isVisible ? (
        <ResumePreview
          data={{
            personal_info: resume.personal_info || {},
            professional_summary: resume.professional_summary || '',
            experience: (resume.experiences || []).slice(0, 2),
            education: (resume.education || []).slice(0, 2),
            project: (resume.projects || []).slice(0, 2),
            skills: (resume.skills || []).slice(0, 6)
          }}
          template={resume.template}
          accentColor={resume.accent_color}
          mode="thumbnail"
        />
      ) : (
        <div className="w-full h-full p-2 flex flex-col gap-1.5 animate-pulse bg-slate-50/20">
          <div className="h-1 bg-slate-100 rounded-xs w-full" />
          <div className="flex gap-1 items-center mt-1">
            <div className="size-4.5 rounded-full bg-slate-100" />
            <div className="flex flex-col gap-0.5 w-full">
              <div className="h-1 bg-slate-100 rounded-xs w-3/4" />
              <div className="h-0.5 bg-slate-50/50 rounded-xs w-1/2" />
            </div>
          </div>
          <div className="h-[0.5px] bg-slate-100/50 w-full my-1" />
          <div className="flex flex-col gap-1">
            <div className="h-1 bg-slate-100 rounded-xs w-1/3" />
            <div className="h-0.5 bg-slate-50/50 rounded-xs w-full" />
            <div className="h-0.5 bg-slate-50/50 rounded-xs w-5/6" />
          </div>
        </div>
      )}
    </div>
  );
};

const dummyResumeData = {
  personal_info: {
    full_name: 'Roth Sorayuth',
    title: 'Lead Full-Stack Software Engineer',
    email: 'rayuth@gmail.com',
    phone: '0123456789',
    location: 'Phnom Penh, Cambodia',
    linkedin: 'linkedin.com/in/yuth-tech',
    website: 'rayuth.dev',
    image_url: 'https://ik.imagekit.io/3txkyljof/user-resume/resume-undefined.jpg?updatedAt=1783959324546'
  },
  professional_summary:
    'Results-driven Lead Full-Stack Software Engineer with over 6 years of experience designing, building, and deploying robust web applications. Proven track record of optimizing application performance, leading cross-functional developer teams, and implementing scalable cloud architectures.',
  experience: [
    {
      position: 'Lead Full-Stack Developer',
      company: 'InnovateTech Solutions',
      start_date: '2023-03',
      end_date: '',
      is_current: true,
      description:
        '• Architected and launched a micro-frontend platform, improving page load speeds by 40%.\n• Manage and mentor a team of 6 engineers, organizing agile sprints and performing daily code reviews.'
    }
  ],
  education: [
    {
      degree: 'M.S.',
      field: 'Software Engineering',
      institution: 'Stanford University',
      graduation_date: '2020-05'
    }
  ],
  project: [
    {
      name: 'AI-Powered CV Platform',
      description: 'Developed a full-stack resume builder integrating generative AI models.'
    }
  ],
  skills: [
    { skill_name: 'JavaScript (ES6+)', proficiency: 'Expert' },
    { skill_name: 'TypeScript', proficiency: 'Advanced' },
    { skill_name: 'React & Redux', proficiency: 'Expert' },
    { skill_name: 'Node.js', proficiency: 'Advanced' }
  ]
};

// Formats last-updated relative & formatted strings
const formatLastUpdated = (dateString) => {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Recently';

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

const formatFullDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [allResumes, setAllResumes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'oldest' | 'title'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'public' | 'draft'

  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState('');
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState('');
  const [deleteResumeId, setDeleteResumeId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingResumes, setIsFetchingResumes] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [createStep, setCreateStep] = useState(1); // 1 = Title, 2 = Template Selection
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const navigate = useNavigate();

  const loadAllResumes = async () => {
    setIsFetchingResumes(true);
    setFetchError(null);
    try {
      const { data } = await api.get('/api/users/resumes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAllResumes(data.resumes || []);
    } catch (error) {
      console.error('Failed to load user CVs:', error);
      setFetchError(error?.response?.data?.message || 'Failed to load CVs');
      toast.error(error?.response?.data?.message || 'Failed to load resumes');
    } finally {
      setIsFetchingResumes(false);
    }
  };

  const createResumeHandler = async (event) => {
    try {
      if (event) event.preventDefault();
      const resumeTitle = title.trim() || 'Untitled CV';
      const { data } = await api.post(
        '/api/resumes/create',
        { title: resumeTitle, template: selectedTemplate },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const created = data.resume || { id: data.resumeId, title: resumeTitle, template: selectedTemplate };
      setAllResumes((prev) => [created, ...prev]);
      setTitle('');
      setSelectedTemplate('classic');
      setCreateStep(1);
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resumeId || data.resume.id}`);
      toast.success(data.message || 'CV created successfully!');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create resume');
    }
  };

  const uploadResume = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (!resume) {
        toast.error('Please select a PDF file first.');
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('resume', resume);
      formData.append('title', title.trim() || 'Imported CV');

      const { data } = await api.post('/api/ai/upload-resume', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setTitle('');
      setResume(null);
      setShowUploadResume(false);

      if (data && data.resumeId) {
        toast.success('Resume parsed and uploaded successfully!');
        navigate(`/app/builder/${data.resumeId}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to upload resume');
    } finally {
      setIsLoading(false);
    }
  };

  const editTitle = async (event) => {
    try {
      event.preventDefault();
      const newTitle = title.trim() || 'Untitled CV';
      const { data } = await api.put(
        '/api/resumes/update',
        { resumeId: editResumeId, resumeData: { title: newTitle } },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setAllResumes(allResumes.map((r) => (r.id === editResumeId ? { ...r, title: newTitle, updated_at: new Date().toISOString() } : r)));
      setTitle('');
      setEditResumeId('');
      toast.success(data.message || 'CV title updated!');
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const deleteResume = async (resumeId) => {
    try {
      const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAllResumes(allResumes.filter((r) => r.id !== resumeId));
      toast.success(data.message || 'CV deleted successfully');
      setDeleteResumeId(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete resume');
    }
  };

  const duplicateResume = async (resumeId) => {
    try {
      const { data } = await api.post(
        `/api/resumes/duplicate/${resumeId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setAllResumes([data.resume, ...allResumes]);
      toast.success(data.message || 'CV duplicated successfully');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to duplicate resume');
    }
  };

  useEffect(() => {
    if (token) {
      loadAllResumes();
    }
    localStorage.removeItem('lastActiveResumeBuilder');
  }, [token]);

  useEffect(() => {
    if (showCreateResume || showUploadResume) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCreateResume, showUploadResume]);

  // Filter & Sort resumes list
  const filteredResumes = allResumes
    .filter((r) => {
      const matchesSearch = (r.title || '').toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (filterStatus === 'public') return !!r.is_public;
      if (filterStatus === 'draft') return !r.is_public;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      if (sortBy === 'oldest') {
        return new Date(a.updated_at) - new Date(b.updated_at);
      }
      // default: recent edit
      return new Date(b.updated_at) - new Date(a.updated_at);
    });

  const publicCount = allResumes.filter((r) => r.is_public).length;
  const privateCount = allResumes.length - publicCount;

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#2D2D2D] pb-16 selection:bg-[#F46200]/20 selection:text-[#F46200]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Top Header / Aurora Banner */}
        <div className="relative overflow-hidden bg-white border border-[#E7E2D8] rounded-2xl p-6 sm:p-8 mb-8 shadow-xs">
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-gradient-to-br from-[#F46200]/10 to-[#D4111A]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF3EB] border border-[#FAD7C0] rounded-full text-xs font-semibold tracking-wide text-[#F46200] mb-3">
                <Sparkles className="size-3.5 text-[#F46200]" />
                My CV Workspace
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D2D2D] tracking-tight">
                My CVs
              </h1>
              <p className="text-[#5A554E] text-xs sm:text-sm mt-1.5 leading-relaxed">
                Save, view, and come back to edit your CVs anytime to improve them over time. Click any CV to open it in the editor.
              </p>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <button
                onClick={() => setShowUploadResume(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E7E2D8] hover:border-[#F46200]/40 text-[#2D2D2D] hover:text-[#F46200] font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <UploadCloud className="size-4 text-[#5A554E]" />
                <span>Import PDF</span>
              </button>

              <button
                onClick={() => setShowCreateResume(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F46200] hover:bg-[#DC5800] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs hover:shadow transition-all cursor-pointer active:scale-95"
              >
                <Plus className="size-4" />
                <span>Create Blank CV</span>
              </button>
            </div>
          </div>
        </div>

        {/* CV Metrics Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white border border-[#E7E2D8] rounded-2xl p-4 sm:p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A847C]">Total Saved CVs</p>
              <h3 className="text-2xl font-bold text-[#2D2D2D] mt-0.5">{allResumes.length}</h3>
            </div>
            <div className="p-3 bg-[#FAF8F4] border border-[#E7E2D8] text-[#F46200] rounded-xl">
              <FileText className="size-5" />
            </div>
          </div>

          <div className="bg-white border border-[#E7E2D8] rounded-2xl p-4 sm:p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A847C]">Public Web Links</p>
              <h3 className="text-2xl font-bold text-[#2D2D2D] mt-0.5">{publicCount}</h3>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl">
              <Globe className="size-5" />
            </div>
          </div>

          <div className="bg-white border border-[#E7E2D8] rounded-2xl p-4 sm:p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A847C]">Private Drafts</p>
              <h3 className="text-2xl font-bold text-[#2D2D2D] mt-0.5">{privateCount}</h3>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl">
              <Lock className="size-5" />
            </div>
          </div>
        </div>

        {/* Filter, Search, and Status Tab Bar */}
        <div className="bg-white border border-[#E7E2D8] rounded-2xl p-4 sm:p-5 mb-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F4] border border-[#E7E2D8] rounded-xl self-start overflow-x-auto max-w-full">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  filterStatus === 'all'
                    ? 'bg-white text-[#2D2D2D] shadow-xs border border-[#E7E2D8]'
                    : 'text-[#5A554E] hover:text-[#2D2D2D]'
                }`}
              >
                All CVs ({allResumes.length})
              </button>
              <button
                onClick={() => setFilterStatus('public')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  filterStatus === 'public'
                    ? 'bg-white text-emerald-700 shadow-xs border border-emerald-200'
                    : 'text-[#5A554E] hover:text-[#2D2D2D]'
                }`}
              >
                Public ({publicCount})
              </button>
              <button
                onClick={() => setFilterStatus('draft')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  filterStatus === 'draft'
                    ? 'bg-white text-slate-800 shadow-xs border border-slate-200'
                    : 'text-[#5A554E] hover:text-[#2D2D2D]'
                }`}
              >
                Drafts ({privateCount})
              </button>
            </div>

            {/* Search and Sort */}
            <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap sm:flex-nowrap">
              {/* Search Bar Input */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 size-4 text-[#8A847C]" />
                <input
                  type="text"
                  placeholder="Search by CV title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 border border-[#E7E2D8] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#F46200]/20 focus:border-[#F46200] bg-white transition-all text-[#2D2D2D]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    type="button"
                    className="absolute right-2.5 top-2.5 text-[#8A847C] hover:text-[#2D2D2D] p-0.5 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 border border-[#E7E2D8] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F46200]/20 focus:border-[#F46200] bg-white text-[#5A554E] cursor-pointer"
                >
                  <option value="recent">Last Updated (Newest)</option>
                  <option value="oldest">Last Updated (Oldest)</option>
                  <option value="title">Title (A - Z)</option>
                </select>
                <SlidersHorizontal className="absolute right-2.5 top-2.5 size-3.5 text-[#8A847C] pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Section Header: Document Count & Title */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#2D2D2D]">Saved Documents</h2>
            <span className="text-xs bg-[#FFF3EB] border border-[#FAD7C0] text-[#F46200] font-semibold px-2 py-0.5 rounded-full">
              {filteredResumes.length} {filteredResumes.length === 1 ? 'CV' : 'CVs'}
            </span>
          </div>
          {allResumes.length > 0 && (
            <p className="text-xs text-[#8A847C]">
              Click any CV or press <span className="font-semibold text-[#5A554E]">Open & Edit</span> to modify.
            </p>
          )}
        </div>

        {/* Resumes Grid / Listing */}
        {isFetchingResumes ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-[#E7E2D8] rounded-2xl p-4 h-76 animate-pulse flex flex-col justify-between"
              >
                <div className="h-40 bg-slate-100 rounded-xl w-full" />
                <div className="space-y-2 mt-4">
                  <div className="h-4 bg-slate-100 rounded-xs w-3/4" />
                  <div className="h-3 bg-slate-100 rounded-xs w-1/2" />
                </div>
                <div className="h-8 bg-slate-100 rounded-xl w-full mt-3" />
              </div>
            ))}
          </div>
        ) : fetchError ? (
          <div className="bg-white border border-rose-200 rounded-2xl p-12 text-center shadow-xs max-w-lg mx-auto">
            <div className="mx-auto size-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-3">
              <X className="size-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Unable to load your CVs</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">{fetchError}</p>
            <button
              onClick={loadAllResumes}
              className="px-4 py-2 bg-[#F46200] hover:bg-[#DC5800] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : allResumes.length === 0 ? (
          /* Empty state when user has zero resumes saved */
          <div className="bg-white border border-[#E7E2D8] rounded-2xl p-12 sm:p-16 text-center shadow-xs max-w-xl mx-auto">
            <div className="mx-auto size-16 bg-[#FFF3EB] border border-[#FAD7C0] rounded-2xl flex items-center justify-center mb-4 text-[#F46200]">
              <FileText className="size-8 stroke-[1.5]" />
            </div>
            <h3 className="text-xl font-bold text-[#2D2D2D]">No saved CVs yet</h3>
            <p className="text-xs sm:text-sm text-[#5A554E] mt-2 mb-6 leading-relaxed max-w-md mx-auto">
              Start building your first professional CV from scratch or import an existing PDF to customize it with our ATS-friendly templates.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => setShowCreateResume(true)}
                className="px-5 py-2.5 bg-[#F46200] hover:bg-[#DC5800] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Create Blank CV
              </button>
              <button
                onClick={() => setShowUploadResume(true)}
                className="px-5 py-2.5 bg-white border border-[#E7E2D8] hover:border-[#F46200] text-[#2D2D2D] hover:text-[#F46200] font-semibold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
              >
                Import Existing PDF
              </button>
            </div>
          </div>
        ) : filteredResumes.length === 0 ? (
          /* Empty state when search query returns nothing */
          <div className="bg-white border border-[#E7E2D8] rounded-2xl p-12 text-center shadow-xs">
            <Search className="size-10 text-[#8A847C] mx-auto mb-3 stroke-[1.5]" />
            <h3 className="text-base font-bold text-[#2D2D2D]">No CVs Found</h3>
            <p className="text-xs text-[#5A554E] mt-1 mb-4">
              No CVs match your filter query "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#2D2D2D] text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              Clear Filter
            </button>
          </div>
        ) : (
          /* The CV Cards Listing */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredResumes.map((resumeItem) => (
              <div
                key={resumeItem.id}
                onClick={() => navigate(`/app/builder/${resumeItem.id}`)}
                className="group relative bg-white border border-[#E7E2D8] hover:border-[#F46200]/40 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                {/* Mini Preview Header Container */}
                <div className="bg-[#FAF8F4] border-b border-[#E7E2D8] p-4 h-48 relative flex items-center justify-center overflow-hidden">
                  <LazyResumePreview resume={resumeItem} />

                  {/* Top Badges (Template & Visibility) */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5A554E] bg-white/95 backdrop-blur-xs border border-[#E7E2D8] px-2.5 py-0.5 rounded-md shadow-xs capitalize">
                      {resumeItem.template || 'Classic'}
                    </span>

                    {resumeItem.is_public ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-xs">
                        <Globe className="size-2.5" /> Public
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-slate-200 shadow-xs">
                        <Lock className="size-2.5" /> Draft
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content: Title and Last-Updated Date */}
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    {/* CV Title */}
                    <h3
                      className="font-bold text-slate-900 text-sm leading-snug truncate group-hover:text-[#F46200] transition-colors"
                      title={resumeItem.title || 'Untitled CV'}
                    >
                      {resumeItem.title || 'Untitled CV'}
                    </h3>

                    {/* Last-Updated Date */}
                    <div
                      className="text-[#8A847C] text-[11px] mt-1.5 flex items-center gap-1.5"
                      title={`Updated on ${formatFullDate(resumeItem.updated_at)}`}
                    >
                      <Clock className="size-3 text-[#F46200] shrink-0" />
                      <span>Last updated: {formatLastUpdated(resumeItem.updated_at)}</span>
                    </div>
                  </div>

                  {/* Card Footer: Action to Open for Editing & Quick Controls */}
                  <div className="mt-4 pt-3 border-t border-[#E7E2D8] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/app/builder/${resumeItem.id}`);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF3EB] hover:bg-[#F46200] text-[#F46200] hover:text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
                      title="Open and edit this CV"
                    >
                      <FilePenLine className="size-3.5" />
                      <span>Open & Edit</span>
                    </button>

                    {/* Quick action buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditResumeId(resumeItem.id);
                          setTitle(resumeItem.title || '');
                        }}
                        className="p-1.5 hover:bg-slate-100 text-[#5A554E] hover:text-[#2D2D2D] rounded-lg transition-colors cursor-pointer"
                        title="Rename CV"
                      >
                        <Pencil className="size-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateResume(resumeItem.id);
                        }}
                        className="p-1.5 hover:bg-slate-100 text-[#5A554E] hover:text-[#2D2D2D] rounded-lg transition-colors cursor-pointer"
                        title="Duplicate CV"
                      >
                        <Copy className="size-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteResumeId(resumeItem.id);
                        }}
                        className="p-1.5 hover:bg-rose-50 text-[#5A554E] hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Delete CV"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pop-up Modal for Create Resume */}
        {showCreateResume && (
          <div
            onClick={() => {
              setShowCreateResume(false);
              setTitle('');
              setCreateStep(1);
              setSelectedTemplate('classic');
            }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all duration-300"
          >
            <div
              data-lenis-prevent
              onClick={(e) => e.stopPropagation()}
              className={`relative bg-white border border-[#E7E2D8] shadow-2xl rounded-2xl w-full p-6 transition-all duration-300 max-h-[90vh] overflow-y-auto ${
                createStep === 1 ? 'max-w-md' : 'max-w-3xl'
              }`}
            >
              {createStep === 1 ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (title.trim()) setCreateStep(2);
                  }}
                >
                  <h2 className="text-xl font-bold text-[#2D2D2D] mb-1">Create a New CV</h2>
                  <p className="text-xs text-[#5A554E] mb-5">Give your CV a descriptive title (e.g., Software Engineer CV).</p>

                  <input
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    type="text"
                    placeholder="e.g. Frontend Developer Resume"
                    className="w-full px-4 py-2.5 border border-[#E7E2D8] rounded-xl mb-5 focus:outline-none focus:ring-2 focus:ring-[#F46200]/20 focus:border-[#F46200] transition-all text-sm"
                    required
                    autoFocus
                  />

                  <button className="w-full py-2.5 bg-[#F46200] hover:bg-[#DC5800] text-white font-semibold rounded-xl shadow-xs hover:shadow transition-all text-sm cursor-pointer">
                    Next: Choose Template
                  </button>
                </form>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-[#2D2D2D] mb-1">Select a Template</h2>
                  <p className="text-xs text-[#5A554E] mb-5">
                    Choose a design layout for <strong>{title}</strong>. You can change this anytime later.
                  </p>

                  <div
                    data-lenis-prevent
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 max-h-[380px] overflow-y-auto p-1"
                  >
                    {[
                      { id: 'classic', name: 'Classic' },
                      { id: 'modern', name: 'Modern Side' },
                      { id: 'minimal-image', name: 'Minimal Image' },
                      { id: 'minimal', name: 'Minimal' },
                      { id: 'executive', name: 'Executive' },
                      { id: 'creative', name: 'Creative' },
                      { id: 'modern-right', name: 'Modern Right' },
                      { id: 'academic', name: 'Academic/CV' }
                    ].map((tpl) => (
                      <div
                        key={tpl.id}
                        onClick={() => setSelectedTemplate(tpl.id)}
                        className={`group relative p-2.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between h-56 ${
                          selectedTemplate === tpl.id
                            ? 'border-[#F46200] bg-[#FFF3EB]/40 shadow-xs ring-2 ring-[#F46200]/20'
                            : 'border-[#E7E2D8] hover:border-slate-300 hover:shadow bg-white'
                        }`}
                      >
                        {/* Live Template Preview Area */}
                        <div className="w-full h-40 rounded-lg shadow-2xs overflow-hidden flex items-start justify-center bg-slate-50 border border-slate-100 relative">
                          <div className="w-full h-full pointer-events-none">
                            <ResumePreview
                              data={dummyResumeData}
                              template={tpl.id}
                              accentColor="#F46200"
                              mode="thumbnail"
                            />
                          </div>
                        </div>

                        {/* Template Label */}
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-slate-700 truncate mr-1">
                            {tpl.name}
                          </span>
                          {selectedTemplate === tpl.id && (
                            <span className="size-2 rounded-full bg-[#F46200] shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setCreateStep(1)}
                      className="px-5 py-2 border border-[#E7E2D8] rounded-xl text-[#5A554E] hover:bg-slate-50 transition-all text-xs font-semibold cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={createResumeHandler}
                      className="px-6 py-2 bg-[#F46200] hover:bg-[#DC5800] text-white font-semibold rounded-xl shadow-xs hover:shadow transition-all text-xs cursor-pointer"
                    >
                      Create Resume
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="absolute top-4 right-4 p-1 rounded-full text-[#8A847C] hover:bg-slate-100 hover:text-[#2D2D2D] transition-all cursor-pointer"
                onClick={() => {
                  setShowCreateResume(false);
                  setTitle('');
                  setCreateStep(1);
                  setSelectedTemplate('classic');
                }}
              >
                <X className="size-5" />
              </button>
            </div>
          </div>
        )}

        {/* Pop-up Modal for Upload Resume */}
        {showUploadResume && (
          <div
            onClick={() => setShowUploadResume(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all duration-300"
          >
            <form
              onSubmit={uploadResume}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border border-[#E7E2D8] shadow-2xl rounded-2xl w-full max-w-md p-6 overflow-hidden"
            >
              <h2 className="text-xl font-bold text-[#2D2D2D] mb-1">Import Existing PDF</h2>
              <p className="text-xs text-[#5A554E] mb-5">
                Upload your PDF resume. We will parse and structure the content automatically.
              </p>

              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="e.g. Imported Senior Developer CV"
                className="w-full px-4 py-2.5 border border-[#E7E2D8] rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-[#F46200]/20 focus:border-[#F46200] transition-all text-sm"
                required
              />

              <div>
                <label htmlFor="resume-input" className="block text-xs font-semibold text-[#5A554E] mb-2">
                  Select PDF File
                </label>
                <label
                  htmlFor="resume-input"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-[#E7E2D8] rounded-xl p-6 mb-5 hover:border-[#F46200] hover:bg-[#FFF3EB]/20 cursor-pointer transition-colors group"
                >
                  {resume ? (
                    <p className="text-sm font-semibold text-[#F46200] break-all">{resume.name}</p>
                  ) : (
                    <>
                      <UploadCloud className="size-10 stroke-1 text-[#8A847C] group-hover:text-[#F46200] transition-colors mb-2" />
                      <p className="text-xs text-[#5A554E]">Choose a PDF file to upload</p>
                    </>
                  )}
                </label>
                <input
                  type="file"
                  id="resume-input"
                  accept=".pdf"
                  hidden
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </div>

              <button
                disabled={isLoading}
                className="w-full py-2.5 bg-[#F46200] hover:bg-[#DC5800] disabled:bg-slate-300 text-white font-semibold rounded-xl shadow-xs hover:shadow transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading && <LoaderCircle className="animate-spin size-4 text-white" />}
                {isLoading ? 'Importing & Parsing...' : 'Import Resume'}
              </button>

              <button
                type="button"
                className="absolute top-4 right-4 p-1 rounded-full text-[#8A847C] hover:bg-slate-100 hover:text-[#2D2D2D] transition-all cursor-pointer"
                onClick={() => {
                  setShowUploadResume(false);
                  setTitle('');
                  setResume(null);
                }}
              >
                <X className="size-5" />
              </button>
            </form>
          </div>
        )}

        {/* Pop-up Modal for Rename Resume */}
        {editResumeId && (
          <div
            onClick={() => setEditResumeId('')}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all duration-300"
          >
            <form
              onSubmit={editTitle}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border border-[#E7E2D8] shadow-2xl rounded-2xl w-full max-w-md p-6 overflow-hidden"
            >
              <h2 className="text-xl font-bold text-[#2D2D2D] mb-1">Rename CV</h2>
              <p className="text-xs text-[#5A554E] mb-5">Change the title of your CV document.</p>

              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter CV title"
                className="w-full px-4 py-2.5 border border-[#E7E2D8] rounded-xl mb-5 focus:outline-none focus:ring-2 focus:ring-[#F46200]/20 focus:border-[#F46200] transition-all text-sm"
                required
                autoFocus
              />

              <button className="w-full py-2.5 bg-[#F46200] hover:bg-[#DC5800] text-white font-semibold rounded-xl shadow-xs hover:shadow transition-all text-sm cursor-pointer">
                Save Title
              </button>

              <button
                type="button"
                className="absolute top-4 right-4 p-1 rounded-full text-[#8A847C] hover:bg-slate-100 hover:text-[#2D2D2D] transition-all cursor-pointer"
                onClick={() => {
                  setEditResumeId('');
                  setTitle('');
                }}
              >
                <X className="size-5" />
              </button>
            </form>
          </div>
        )}

        {/* Pop-up Modal for Delete Confirmation */}
        {deleteResumeId && (
          <div
            onClick={() => setDeleteResumeId(null)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all duration-300"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border border-[#E7E2D8] shadow-xl rounded-2xl w-full max-w-[340px] p-6 text-center overflow-hidden"
            >
              <div className="mx-auto w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mb-3 text-rose-500">
                <Trash2 className="size-5" />
              </div>
              <h2 className="text-lg font-bold text-[#2D2D2D] mb-1">Delete CV?</h2>
              <p className="text-xs text-[#5A554E] mb-5 leading-relaxed">
                Are you sure you want to delete this CV? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteResumeId(null)}
                  className="w-1/2 py-2 bg-slate-50 hover:bg-slate-100 border border-[#E7E2D8] text-[#5A554E] font-semibold rounded-xl transition-all text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => deleteResume(deleteResumeId)}
                  className="w-1/2 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-all text-xs cursor-pointer shadow-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
