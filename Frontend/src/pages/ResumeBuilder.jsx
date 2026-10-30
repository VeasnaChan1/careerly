import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  FolderIcon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Share2Icon,
  EyeIcon,
  EyeOffIcon,
  DownloadIcon,
  LogOut,
  Save,
  Check,
  RotateCcw,
  Loader2
} from 'lucide-react';
import PersonalInfoForm from '../components/PersonalInfoForm';
import ResumePreview from '../components/ResumePreview';
import TemplateSelector from '../components/TemplateSelector';
import ColorPicker from '../components/ColorPicker';
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm';
import ExperienceForm from '../components/ExperienceForm';
import EducationForm from '../components/EducationForm';
import ProjectForm from '../components/ProjectForm';
import SkillsForm from '../components/SkillsForm';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../app/features/authSlice';
import api from '../config/api';
import toast from 'react-hot-toast';

const GUEST_STORAGE_KEY = 'careerly_guest_resume';
const GUEST_SECTION_KEY = 'careerly_guest_section';

const defaultStarterResume = {
  _id: 'guest',
  title: 'My Professional CV',
  personal_info: {
    full_name: 'Dara Sok',
    profession: 'Junior Frontend Developer',
    email: 'dara.sok@cadtedu.kh',
    phone: '(+855) 12 345 678',
    location: 'Phnom Penh, Cambodia',
    linkedin: 'linkedin.com/in/darasok',
    website: 'darasok.dev',
    image_url: ''
  },
  professional_summary:
    '<p>Motivated Junior Frontend Developer with practical hands-on experience building clean, responsive web applications using React and Tailwind CSS. Passionate about creating intuitive digital experiences and solving real-world challenges in team environments.</p>',
  experience: [
    {
      company: 'Canadia Bank Digital Lab',
      position: 'Frontend Developer Intern',
      start_date: '2023-07',
      end_date: '2023-12',
      is_current: false,
      description:
        '<p>• Built and optimized 4 responsive React dashboard modules, improving mobile load times by 32%.</p><p>• Collaborated with backend engineers to integrate RESTful APIs and ensure data consistency.</p>'
    }
  ],
  education: [
    {
      institution: 'Cambodia Academy of Digital Technology (CADT)',
      degree: 'B.S.',
      field: 'Computer Science',
      graduation_date: '2026-06',
      gpa: '3.7'
    }
  ],
  project: [
    {
      name: 'Careerly CV Platform',
      type: 'Web Application',
      description:
        '<p>Interactive English CV builder providing instant A4 preview, multiple ATS-friendly templates, and smart suggestions for Cambodian students.</p>'
    }
  ],
  skills: [
    'JavaScript (ES6+)',
    'React.js',
    'Tailwind CSS',
    'HTML5 & CSS3',
    'Git & GitHub',
    'REST APIs'
  ],
  template: 'classic',
  accent_color: '#F46200',
  public: false
};

const getInitialGuestResume = () => {
  try {
    const cached = localStorage.getItem(GUEST_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && typeof parsed === 'object') {
        return {
          ...defaultStarterResume,
          ...parsed,
          personal_info: {
            ...defaultStarterResume.personal_info,
            ...(parsed.personal_info || {})
          }
        };
      }
    }
  } catch (e) {
    console.error('Failed to parse cached guest resume on init:', e);
  }
  return defaultStarterResume;
};

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isGuest = !token || !resumeId || resumeId === 'guest' || resumeId === 'new' || resumeId === 'free';

  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview'
  const [resumeData, setResumeData] = useState(() => {
    if (isGuest) {
      return getInitialGuestResume();
    }
    return defaultStarterResume;
  });

  const [lastSavedData, setLastSavedData] = useState(() => {
    if (isGuest) {
      return getInitialGuestResume();
    }
    return null;
  });

  const [activeSectionIndex, setActiveSectionIndex] = useState(() => {
    if (isGuest) {
      try {
        const saved = localStorage.getItem(GUEST_SECTION_KEY);
        if (saved !== null) {
          const idx = parseInt(saved, 10);
          if (!isNaN(idx) && idx >= 0 && idx < 6) return idx;
        }
      } catch (e) {}
    }
    return 0;
  });

  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving'
  const [removeBackground, setRemoveBackground] = useState(false);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [showBackConfirmModal, setShowBackConfirmModal] = useState(false);
  const [navTarget, setNavTarget] = useState(isGuest ? '/' : '/app');

  const resumeDataRef = useRef(resumeData);
  useEffect(() => {
    resumeDataRef.current = resumeData;
  }, [resumeData]);

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'summary', name: 'Summary', icon: FileText },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'projects', name: 'Projects', icon: FolderIcon },
    { id: 'skills', name: 'Skills', icon: Sparkles }
  ];

  const activateSection = sections[activeSectionIndex];

  // Auto-save active section index for guests
  useEffect(() => {
    if (!isGuest) return;
    try {
      localStorage.setItem(GUEST_SECTION_KEY, activeSectionIndex.toString());
    } catch (e) {}
  }, [activeSectionIndex, isGuest]);

  // Continuous Auto-Save for guest mode (debounced 300ms)
  useEffect(() => {
    if (!isGuest) return;

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(resumeData));
        setLastSavedData(JSON.parse(JSON.stringify(resumeData)));
        setSaveStatus('saved');
      } catch (err) {
        console.error('Error auto-saving guest resume:', err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [resumeData, isGuest]);

  // Flush auto-save on page refresh, unload, or tab switch
  useEffect(() => {
    if (!isGuest) return;

    const handleFlushSync = () => {
      try {
        if (resumeDataRef.current) {
          localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(resumeDataRef.current));
        }
      } catch (err) {
        console.error('Flush sync error:', err);
      }
    };

    window.addEventListener('beforeunload', handleFlushSync);
    window.addEventListener('pagehide', handleFlushSync);

    return () => {
      window.removeEventListener('beforeunload', handleFlushSync);
      window.removeEventListener('pagehide', handleFlushSync);
    };
  }, [isGuest]);

  const loadExistingResume = async () => {
    if (isGuest) {
      const cached = localStorage.getItem(GUEST_STORAGE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const merged = {
            ...defaultStarterResume,
            ...parsed,
            personal_info: {
              ...defaultStarterResume.personal_info,
              ...(parsed.personal_info || {})
            }
          };
          setResumeData(merged);
          setLastSavedData(JSON.parse(JSON.stringify(merged)));
          document.title = merged.title || 'Careerly CV Builder';
          return;
        } catch (e) {
          console.error('Failed to parse cached guest resume:', e);
        }
      }
      setResumeData(defaultStarterResume);
      setLastSavedData(JSON.parse(JSON.stringify(defaultStarterResume)));
      document.title = 'Careerly CV Builder (Free Mode)';
      return;
    }

    try {
      const { data } = await api.get(`/api/resumes/get/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (data.resume) {
        const dbResume = data.resume;
        const mappedData = {
          _id: dbResume.id,
          title: dbResume.title || 'Untitled Resume',
          personal_info: dbResume.personal_info || {},
          professional_summary: dbResume.professional_summary || '',
          experience: dbResume.experiences || [],
          education: dbResume.education || [],
          project: dbResume.projects || [],
          skills: dbResume.skills || [],
          template: dbResume.template || 'classic',
          accent_color: dbResume.accent_color || '#F46200',
          public: dbResume.is_public || false
        };

        setResumeData(mappedData);
        setLastSavedData(JSON.parse(JSON.stringify(mappedData)));
        localStorage.setItem('lastActiveResumeBuilder', `/app/builder/${resumeId}`);
        document.title = dbResume.title || 'Careerly CV Builder';
      }
    } catch (error) {
      console.error('Error loading resume details:', error);
    }
  };

  useEffect(() => {
    loadExistingResume();
  }, [resumeId, token]);

  useEffect(() => {
    if (isGuest) {
      window.resumeBuilderDirty = false;
      return;
    }
    if (lastSavedData) {
      window.resumeBuilderDirty = JSON.stringify(resumeData) !== JSON.stringify(lastSavedData);
    } else {
      window.resumeBuilderDirty = false;
    }
    return () => {
      window.resumeBuilderDirty = false;
    };
  }, [resumeData, lastSavedData, isGuest]);

  useEffect(() => {
    const handleShowConfirm = (e) => {
      setNavTarget(e.detail.targetUrl);
      setShowBackConfirmModal(true);
    };
    window.addEventListener('show-leave-builder-confirm', handleShowConfirm);
    return () => {
      window.removeEventListener('show-leave-builder-confirm', handleShowConfirm);
    };
  }, []);

  const handleBackToDashboard = () => {
    const target = isGuest ? '/' : '/app';
    if (isGuest) {
      try {
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(resumeData));
      } catch (e) {}
      navigate(target);
      return;
    }

    if (lastSavedData && JSON.stringify(resumeData) === JSON.stringify(lastSavedData)) {
      navigate(target);
    } else {
      setNavTarget(target);
      setShowBackConfirmModal(true);
    }
  };

  const saveResume = async () => {
    try {
      if (isGuest) {
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(resumeData));
        setLastSavedData(JSON.parse(JSON.stringify(resumeData)));
        setSaveStatus('saved');
        window.resumeBuilderDirty = false;
        toast.success('CV saved to your browser! You can download your PDF anytime.');
        return true;
      }

      let updatedResumeData = structuredClone(resumeData);
      if (typeof resumeData.personal_info.image_url === 'object') {
        delete updatedResumeData.personal_info.image_url;
      }

      const formData = new FormData();
      formData.append('resumeId', resumeId);
      formData.append('resumeData', JSON.stringify(updatedResumeData));
      if (removeBackground) formData.append('removeBackground', 'yes');
      if (resumeData.personal_info.image_url instanceof File) {
        formData.append('image', resumeData.personal_info.image_url);
      }

      const { data } = await api.put('/api/resumes/update', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const savedResume = {
        _id: data.resume.id,
        title: data.resume.title || resumeData.title,
        personal_info: data.resume.personal_info || {},
        professional_summary: data.resume.professional_summary || '',
        experience: data.resume.experiences || [],
        education: data.resume.education || [],
        project: data.resume.projects || [],
        skills: data.resume.skills || [],
        template: data.resume.template || resumeData.template,
        accent_color: data.resume.accent_color || resumeData.accent_color,
        public: data.resume.is_public ?? resumeData.public
      };

      setResumeData(savedResume);
      setLastSavedData(JSON.parse(JSON.stringify(savedResume)));
      window.resumeBuilderDirty = false;
      toast.success(data.message || 'Saved successfully!');
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Failed to save');
      return false;
    }
  };

  const handleResetGuestResume = () => {
    if (window.confirm('Reset this CV back to starter sample data? All your edits will be cleared.')) {
      try {
        localStorage.removeItem(GUEST_STORAGE_KEY);
        localStorage.removeItem(GUEST_SECTION_KEY);
      } catch (e) {}
      setResumeData(defaultStarterResume);
      setLastSavedData(JSON.parse(JSON.stringify(defaultStarterResume)));
      setActiveSectionIndex(0);
      toast.success('CV reset to sample template');
    }
  };

  const handleSaveAndLeave = async () => {
    setShowBackConfirmModal(false);
    const success = await saveResume();
    if (success) {
      window.resumeBuilderDirty = false;
      if (navTarget === '/logout') {
        dispatch(logout());
        navigate('/');
      } else {
        navigate(navTarget);
      }
    }
  };

  const changeResumeVisility = async () => {
    if (isGuest) {
      toast('Public shareable web links require a free account. You can download your PDF directly!', {
        icon: '💡'
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('resumeId', resumeId);
      formData.append('resumeData', JSON.stringify({ is_public: !resumeData.public }));

      const { data } = await api.put('/api/resumes/update', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const newVisibility = !resumeData.public;
      setResumeData((prev) => ({ ...prev, public: newVisibility }));
      setLastSavedData((prev) => ({ ...prev, public: newVisibility }));
      toast.success(data.message || 'Visibility updated!');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update visibility');
    }
  };

  const handleToggleClick = () => {
    if (isGuest) {
      toast('Sign in or register to publish a permanent online share link. PDF download is free!', {
        icon: '💡'
      });
      return;
    }
    if (!resumeData.public) {
      setShowVisibilityModal(true);
    } else {
      changeResumeVisility();
    }
  };

  const handleShare = () => {
    if (isGuest) {
      toast('Create a free account to generate a shareable web link. You can download the PDF right away!', {
        icon: '💡'
      });
      return;
    }
    const frontendUrl = window.location.href.split('/app/')[0];
    const resumeUrl = frontendUrl + '/view/' + resumeId;
    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: 'My Resume' });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(resumeUrl);
      toast.success('Resume link copied to clipboard!');
    } else {
      alert('Share not supported on this browser.');
    }
  };

  const downloadResume = () => {
    const previewEl = document.getElementById('resume-preview');
    if (!previewEl) {
      window.print();
      return;
    }

    const clone = previewEl.cloneNode(true);
    clone.id = 'print-clone';
    document.body.appendChild(clone);
    document.body.classList.add('printing-resume-active');

    setTimeout(() => {
      window.print();
      document.body.removeChild(clone);
      document.body.classList.remove('printing-resume-active');
    }, 100);
  };

  return (
    <>
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap border-b border-gray-200/60 bg-white/50 backdrop-blur-xs">
        <button
          onClick={handleBackToDashboard}
          className="inline-flex gap-2 items-center text-slate-600 hover:text-slate-900 transition-colors duration-200 cursor-pointer text-sm font-semibold"
        >
          <ArrowLeftIcon className="size-4" />
          <span>{isGuest ? 'Back to Home' : 'Back to Dashboard'}</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Guest Auto-Save status badge */}
          {isGuest && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                saveStatus === 'saving'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
              title="Your progress is continuously preserved in your browser"
            >
              {saveStatus === 'saving' ? (
                <>
                  <Loader2 className="size-3 animate-spin text-amber-600" />
                  <span className="hidden sm:inline">Saving draft...</span>
                </>
              ) : (
                <>
                  <Check className="size-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Progress saved</span>
                </>
              )}
            </div>
          )}

          {/* Quick Save button */}
          <button
            onClick={saveResume}
            className="flex items-center p-2 px-3.5 gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
            title="Save changes"
          >
            <Save className="size-3.5" />
            <span>{isGuest ? 'Save Now' : 'Save'}</span>
          </button>

          {/* Reset sample button for guest users */}
          {isGuest && (
            <button
              onClick={handleResetGuestResume}
              className="flex items-center p-2 px-2.5 gap-1 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Reset CV to clean sample starter"
            >
              <RotateCcw className="size-3.5" />
              <span className="hidden md:inline">Reset Sample</span>
            </button>
          )}

          {/* Share button */}
          {resumeData.public && (
            <button
              onClick={handleShare}
              className="flex items-center p-2 px-3.5 gap-1.5 text-xs bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 font-semibold rounded-lg ring-blue-300 hover:ring transition-colors cursor-pointer"
            >
              <Share2Icon className="size-3.5" />
              <span>Share</span>
            </button>
          )}

          {/* Visibility toggle */}
          <button
            onClick={handleToggleClick}
            className={`flex items-center p-2 px-3.5 gap-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              resumeData.public
                ? 'bg-purple-100 text-purple-700 ring-purple-300 hover:ring'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {resumeData.public ? <EyeIcon className="size-3.5" /> : <EyeOffIcon className="size-3.5" />}
            <span>{resumeData.public ? 'Public' : 'Private'}</span>
          </button>

          {/* Free Download button */}
          <button
            onClick={downloadResume}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-[#F46200] hover:bg-[#DC5800] rounded-lg shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <DownloadIcon className="size-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Free mode gentle banner for guests */}
      {isGuest && (
        <div className="bg-[#FFF3EB] border-b border-[#FAD7C0] px-4 py-2 text-center text-xs text-[#5A554E] flex items-center justify-center gap-2 flex-wrap">
          <Sparkles className="size-3.5 text-[#F46200] shrink-0" />
          <span>
            <strong>Free CV Builder Mode:</strong> Your work is automatically saved in this browser. You can edit, customize templates, and download your PDF anytime.
          </span>
          <Link to="/login" className="font-semibold text-[#F46200] hover:underline ml-1">
            Log in to save online
          </Link>
        </div>
      )}

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden sticky top-0 z-30 bg-white py-2 shadow-xs max-w-7xl mx-auto px-4 mb-4 border-b border-gray-100">
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              activeTab === 'edit' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Edit CV
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              activeTab === 'preview' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Live Preview
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 pb-12">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Editor (5 cols) */}
          <div className={`relative lg:col-span-5 rounded-xl ${activeTab !== 'edit' ? 'max-lg:hidden' : ''}`}>
            <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-6 pt-3 relative overflow-hidden">
              {/* Progress bar */}
              <div
                className="absolute top-0 left-0 h-1 bg-[#F46200] transition-all duration-300"
                style={{ width: `${(activeSectionIndex * 100) / (sections.length - 1)}%` }}
              />

              {/* Section Tools: Templates & ColorPicker */}
              <div className="sticky top-0 z-20 bg-white py-3 flex flex-wrap justify-between items-center mb-6 border-b border-gray-100 gap-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={(template) => setResumeData((prev) => ({ ...prev, template }))}
                  />
                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={(color) => setResumeData((prev) => ({ ...prev, accent_color: color }))}
                  />
                </div>

                {/* Next / Previous step */}
                <div className="flex items-center gap-1">
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() => setActiveSectionIndex((prev) => prev - 1)}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      title="Previous Step"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                  )}
                  {activeSectionIndex < sections.length - 1 && (
                    <button
                      onClick={() => setActiveSectionIndex((prev) => prev + 1)}
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      title="Next Step"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Step Icons Tabs */}
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100 overflow-x-auto gap-1">
                {sections.map((sec, idx) => {
                  const Icon = sec.icon;
                  const isActive = activeSectionIndex === idx;
                  const isDone = idx < activeSectionIndex;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => setActiveSectionIndex(idx)}
                      className={`flex flex-col items-center p-2 rounded-xl transition-all cursor-pointer min-w-[56px] ${
                        isActive
                          ? 'bg-[#FFF3EB] text-[#F46200] font-semibold'
                          : isDone
                          ? 'text-gray-700 hover:bg-gray-50'
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <div className="relative">
                        <Icon className="size-5" />
                        {isDone && (
                          <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                        )}
                      </div>
                      <span className="text-[10px] mt-1 whitespace-nowrap">{sec.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Section Forms */}
              <div className="space-y-4">
                {activateSection.id === 'personal' && (
                  <PersonalInfoForm
                    data={resumeData.personal_info || {}}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, personal_info: data }))}
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}

                {activateSection.id === 'summary' && (
                  <ProfessionalSummaryForm
                    data={resumeData.professional_summary || ''}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, professional_summary: data }))}
                    setResumeData={setResumeData}
                  />
                )}

                {activateSection.id === 'experience' && (
                  <ExperienceForm
                    data={resumeData.experience || []}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, experience: data }))}
                  />
                )}

                {activateSection.id === 'education' && (
                  <EducationForm
                    data={resumeData.education || []}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, education: data }))}
                  />
                )}

                {activateSection.id === 'projects' && (
                  <ProjectForm
                    data={resumeData.project || []}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, project: data }))}
                  />
                )}

                {activateSection.id === 'skills' && (
                  <SkillsForm
                    data={resumeData.skills || []}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, skills: data }))}
                  />
                )}
              </div>

              {/* Bottom Step Actions */}
              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
                {activeSectionIndex > 0 ? (
                  <button
                    type="button"
                    onClick={() => setActiveSectionIndex((prev) => prev - 1)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {activeSectionIndex < sections.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setActiveSectionIndex((prev) => prev + 1)}
                    className="px-5 py-2 text-xs font-semibold text-white bg-[#F46200] hover:bg-[#DC5800] rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Next: {sections[activeSectionIndex + 1].name}</span>
                    <ChevronRight className="size-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={downloadResume}
                    className="px-6 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <DownloadIcon className="size-3.5" />
                    <span>Download CV PDF</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Live A4 Resume Preview (7 cols) */}
          <div className={`lg:col-span-7 ${activeTab !== 'preview' ? 'max-lg:hidden' : ''}`}>
            <div className="sticky top-20 bg-white rounded-2xl p-4 sm:p-6 border border-gray-200/80 shadow-xs flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-4 pb-2 border-b border-gray-100 text-xs text-gray-500">
                <span className="font-semibold text-gray-700">Live A4 Paper Preview</span>
                <span className="text-[11px] bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                  Template: <strong className="capitalize">{resumeData.template}</strong>
                </span>
              </div>

              <div id="resume-preview" className="w-full flex justify-center overflow-hidden">
                <ResumePreview
                  data={{
                    personal_info: resumeData.personal_info || {},
                    professional_summary: resumeData.professional_summary || '',
                    experience: resumeData.experience || [],
                    education: resumeData.education || [],
                    project: resumeData.project || [],
                    skills: resumeData.skills || []
                  }}
                  template={resumeData.template}
                  accentColor={resumeData.accent_color}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visibility Confirmation Modal */}
      {showVisibilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-[340px] w-full mx-4 shadow-xl border border-slate-100 animate-in zoom-in-95 duration-200 text-center">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Make CV Public?</h3>
            <p className="text-xs text-slate-500 mb-5 px-2 leading-relaxed">
              Making your CV public generates a web link that anyone can access to view your CV online.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowVisibilityModal(false)}
                className="w-1/2 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 font-semibold rounded-xl transition-all text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowVisibilityModal(false);
                  changeResumeVisility();
                }}
                className="w-1/2 py-2 bg-[#F46200] hover:bg-[#DC5800] text-white font-semibold rounded-xl transition-all text-xs cursor-pointer"
              >
                Yes, Make Public
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back Confirmation Modal */}
      {showBackConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-[340px] w-full mx-4 shadow-xl border border-slate-100 animate-in zoom-in-95 duration-200 text-center">
            <div className="mx-auto w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-3">
              <LogOut className="size-5 text-[#F46200]" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Unsaved Changes</h3>
            <p className="text-xs text-slate-500 mb-5 px-2 leading-relaxed">
              You have unsaved edits in your CV. Would you like to save before leaving?
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSaveAndLeave}
                className="w-full py-2.5 bg-[#F46200] hover:bg-[#DC5800] text-white font-bold rounded-xl transition-all text-xs cursor-pointer shadow-xs"
              >
                Save & Leave
              </button>
              <button
                onClick={() => {
                  setShowBackConfirmModal(false);
                  window.resumeBuilderDirty = false;
                  if (navTarget === '/logout') {
                    dispatch(logout());
                    navigate('/');
                  } else {
                    navigate(navTarget);
                  }
                }}
                className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 font-semibold rounded-xl transition-all text-xs cursor-pointer"
              >
                Discard & Leave
              </button>
              <button
                onClick={() => setShowBackConfirmModal(false)}
                className="w-full py-2 text-slate-400 hover:text-slate-600 font-medium transition-all text-xs cursor-pointer mt-1"
              >
                Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResumeBuilder;
