import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  Award,
  Search,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  RotateCcw,
  Clock,
  ArrowRight,
  Lightbulb,
  Check,
  Compass,
  Briefcase,
  HelpCircle,
  Eye,
  EyeOff,
  Filter,
  Layers,
  ArrowLeft,
  Share2,
  Printer
} from 'lucide-react';
import toast from 'react-hot-toast';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  getInterviewQuestions,
  getInterviewCategories,
  getInterviewGuide,
  getPracticedQuestionIds,
  togglePracticedQuestion,
  getBookmarkedQuestionIds,
  toggleBookmarkedQuestion,
  getSavedPracticeAnswers,
  savePracticeAnswer
} from '../services/interviewApi';

// Helper: Format Answer with highlighted STAR tags
function FormattedAnswer({ text }) {
  if (!text) return null;

  // Split into paragraphs / sections
  const parts = text.split(/(?=\[(?:Situation|Task|Action|Result)\]:?)/gi);

  if (parts.length > 1) {
    return (
      <div className="space-y-3.5 my-2">
        {parts.map((part, index) => {
          const match = part.match(/^\[(Situation|Task|Action|Result)\]:?\s*/i);
          if (match) {
            const starType = match[1].toLowerCase();
            const body = part.replace(/^\[(Situation|Task|Action|Result)\]:?\s*/i, '');

            const starStyles = {
              situation: {
                badge: 'bg-blue-50 text-blue-700 border-blue-200',
                bar: 'border-l-blue-400',
                label: 'Situation (15%)'
              },
              task: {
                badge: 'bg-amber-50 text-amber-700 border-amber-200',
                bar: 'border-l-amber-400',
                label: 'Task (15%)'
              },
              action: {
                badge: 'bg-[#FFF3EB] text-[#F46200] border-[#FAD7C0]',
                bar: 'border-l-[#F46200]',
                label: 'Action (55% - Core execution)'
              },
              result: {
                badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                bar: 'border-l-emerald-500',
                label: 'Result (15% - Measurable impact)'
              }
            };

            const conf = starStyles[starType] || starStyles.action;

            return (
              <div
                key={index}
                className={`bg-white/80 p-3.5 rounded-xl border border-[#E7E2D8] border-l-4 ${conf.bar} shadow-xs`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide border ${conf.badge}`}
                  >
                    {conf.label}
                  </span>
                </div>
                <p className="text-sm text-[#2D2D2D] leading-relaxed whitespace-pre-line">{body}</p>
              </div>
            );
          }

          return (
            <p key={index} className="text-sm text-[#2D2D2D] leading-relaxed whitespace-pre-line">
              {part}
            </p>
          );
        })}
      </div>
    );
  }

  return (
    <div className="text-sm text-[#2D2D2D] leading-relaxed whitespace-pre-line bg-[#FAF8F4]/80 p-4 rounded-xl border border-[#E7E2D8]">
      {text}
    </div>
  );
}

// Difficulty Badge
function DifficultyBadge({ difficulty }) {
  const diff = (difficulty || 'Easy').toLowerCase();
  if (diff === 'easy') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Beginner / Intern
      </span>
    );
  }
  if (diff === 'medium') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Intermediate
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
      Advanced
    </span>
  );
}

// Category Badge
function CategoryBadge({ category }) {
  const cat = (category || 'general').toLowerCase();
  const map = {
    behavioral: { label: 'Behavioral & STAR', color: 'bg-[#FFF3EB] text-[#F46200] border-[#FAD7C0]' },
    technical: { label: 'Technical & Logic', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    general: { label: 'Background & Fit', color: 'bg-stone-100 text-stone-700 border-stone-300' },
    'career-growth': { label: 'Career Switcher', color: 'bg-violet-50 text-violet-700 border-violet-200' },
    'questions-to-ask': { label: 'Questions to Ask', color: 'bg-teal-50 text-teal-700 border-teal-200' }
  };
  const item = map[cat] || { label: category, color: 'bg-gray-100 text-gray-700 border-gray-200' };

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide border ${item.color}`}>
      {item.label}
    </span>
  );
}

export default function InterviewPractice({ publicMode = true }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Active Main Tab: 'bank' | 'practice' | 'guide'
  const [activeTab, setActiveTab] = useState('bank');

  // Question Data
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [guide, setGuide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [onlyUnpracticed, setOnlyUnpracticed] = useState(false);

  // Expanded Accordion State for Question Bank
  const [expandedIds, setExpandedIds] = useState({});

  // Local Storage Tracking
  const [practicedIds, setPracticedIds] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  // Practice Mode State
  const [practiceQuestion, setPracticeQuestion] = useState(null);
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [savedAnswers, setSavedAnswers] = useState({});

  // Practice Timer (Seconds)
  const [timerSeconds, setTimerSeconds] = useState(120); // 2 minutes default
  const [timerInitial, setTimerInitial] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  // Load Initial Data
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const [qRes, catRes, guideRes] = await Promise.all([
          getInterviewQuestions(),
          getInterviewCategories(),
          getInterviewGuide()
        ]);

        if (isMounted) {
          if (qRes && qRes.questions) setQuestions(qRes.questions);
          if (catRes && catRes.categories) setCategories(catRes.categories);
          if (guideRes) setGuide(guideRes);

          // Local storage state
          setPracticedIds(getPracticedQuestionIds());
          setBookmarkedIds(getBookmarkedQuestionIds());
          setSavedAnswers(getSavedPracticeAnswers());

          // Check if URL specifies a question or mode
          const searchParams = new URLSearchParams(location.search);
          const qIdParam = searchParams.get('id');
          const tabParam = searchParams.get('tab');

          if (tabParam && ['bank', 'practice', 'guide'].includes(tabParam)) {
            setActiveTab(tabParam);
          }

          if (qIdParam && qRes?.questions) {
            const found = qRes.questions.find((q) => q.id === qIdParam);
            if (found) {
              setPracticeQuestion(found);
              setActiveTab('practice');
            }
          }
        }
      } catch (err) {
        console.error('Failed to load interview data:', err);
        toast.error('Could not load online questions; using local storage.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [location.search]);

  // Set default practice question if none selected when switching to practice mode
  useEffect(() => {
    if (activeTab === 'practice' && !practiceQuestion && questions.length > 0) {
      setPracticeQuestion(questions[0]);
    }
  }, [activeTab, practiceQuestion, questions]);

  // Sync practice answer text when active question changes
  useEffect(() => {
    if (practiceQuestion) {
      const existing = savedAnswers[practiceQuestion.id]?.answer || '';
      setPracticeAnswer(existing);
      setIsAnswerRevealed(false);
      setIsTimerRunning(false);
      setTimerSeconds(timerInitial);
    }
  }, [practiceQuestion]);

  // Timer Tick
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            toast('Practice timer finished! Review your answer.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  // Handle Practice Timer Controls
  const toggleTimer = () => setIsTimerRunning((prev) => !prev);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(timerInitial);
  };
  const setTimerDuration = (seconds) => {
    setTimerInitial(seconds);
    setTimerSeconds(seconds);
    setIsTimerRunning(false);
  };

  // Toggle Bookmark
  const handleToggleBookmark = (id, e) => {
    if (e) e.stopPropagation();
    const updated = toggleBookmarkedQuestion(id);
    setBookmarkedIds(updated);
    const isNow = updated.includes(id);
    toast.success(isNow ? 'Saved to bookmarks' : 'Removed from bookmarks');
  };

  // Toggle Practiced Status
  const handleTogglePracticed = (id, e) => {
    if (e) e.stopPropagation();
    const updated = togglePracticedQuestion(id);
    setPracticedIds(updated);
    const isNow = updated.includes(id);
    toast.success(isNow ? 'Marked as practiced!' : 'Unmarked question');
  };

  // Toggle Accordion in Question Bank
  const toggleExpand = (id) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Start Practicing specific question
  const startPracticeForQuestion = (q) => {
    setPracticeQuestion(q);
    setActiveTab('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save candidate notes in practice mode
  const handleSaveNotes = () => {
    if (!practiceQuestion) return;
    const updated = savePracticeAnswer(practiceQuestion.id, practiceAnswer);
    setSavedAnswers(updated);
    toast.success('Your practice answer has been saved!');
  };

  // Rate self in practice mode
  const handleSelfRating = (rating) => {
    if (!practiceQuestion) return;
    const updated = savePracticeAnswer(practiceQuestion.id, practiceAnswer, rating);
    setSavedAnswers(updated);

    // Auto mark as practiced if rating is positive
    if (!practicedIds.includes(practiceQuestion.id)) {
      const upPracticed = togglePracticedQuestion(practiceQuestion.id);
      setPracticedIds(upPracticed);
    }
    toast.success(`Saved rating: "${rating}"`);
  };

  // Move to next question in practice
  const handleNextPracticeQuestion = (direction = 1) => {
    if (!practiceQuestion || filteredQuestions.length === 0) return;
    const currentIndex = filteredQuestions.findIndex((q) => q.id === practiceQuestion.id);
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = filteredQuestions.length - 1;
    if (nextIndex >= filteredQuestions.length) nextIndex = 0;
    setPracticeQuestion(filteredQuestions[nextIndex]);
  };

  // Filtered Questions Memo
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // Category filter
      if (selectedCategory !== 'all' && q.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Difficulty filter
      if (selectedDifficulty !== 'all' && q.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) {
        return false;
      }
      // Bookmarked filter
      if (onlyBookmarked && !bookmarkedIds.includes(q.id)) {
        return false;
      }
      // Unpracticed filter
      if (onlyUnpracticed && practicedIds.includes(q.id)) {
        return false;
      }
      // Search term
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesQuestion = q.question.toLowerCase().includes(query);
        const matchesRole = q.job_role?.toLowerCase().includes(query);
        const matchesAnswer = q.suggested_answer?.toLowerCase().includes(query);
        const matchesTips = q.tips?.toLowerCase().includes(query);
        if (!matchesQuestion && !matchesRole && !matchesAnswer && !matchesTips) {
          return false;
        }
      }
      return true;
    });
  }, [questions, selectedCategory, selectedDifficulty, searchQuery, onlyBookmarked, onlyUnpracticed, bookmarkedIds, practicedIds]);

  // Overall Stats
  const totalQuestions = questions.length;
  const practicedCount = practicedIds.filter((id) => questions.some((q) => q.id === id)).length;
  const practicedPercent = totalQuestions > 0 ? Math.round((practicedCount / totalQuestions) * 100) : 0;
  const bookmarkedCount = bookmarkedIds.filter((id) => questions.some((q) => q.id === id)).length;

  // Format timer seconds into mm:ss
  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#2D2D2D] selection:bg-[#F46200]/20 selection:text-[#F46200]">
      {publicMode && <Navbar />}

      <main className="flex-grow py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header & Hero Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E7E2D8] shadow-[0_10px_30px_-15px_rgba(45,45,45,0.05)] mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-[#E7E2D8]">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF3EB] border border-[#FAD7C0] text-xs font-bold text-[#F46200] mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive Interview Preparation & STAR Method</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl text-[#2D2D2D] tracking-tight leading-snug">
                  Master your job interviews with confidence.
                </h1>
                <p className="mt-3 text-base text-[#5A554E] leading-relaxed">
                  Curated questions asked by Cambodian tech firms, local commercial banks, and international NGOs.
                  Learn how to structure answers with the STAR framework, build English fluency, and test yourself before your interview.
                </p>
                {!publicMode && (
                  <Link to="/app/interview-prep" className="mt-3 inline-flex rounded-sm text-sm font-semibold text-[#AD4500] underline underline-offset-4 focus-visible:outline-brand-orange">
                    Browse beginner questions
                  </Link>
                )}
              </div>

              {/* Progress Card */}
              <div className="bg-[#FAF8F4] p-5 rounded-2xl border border-[#E7E2D8] min-w-[280px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5A554E]">Your Progress</span>
                  <span className="text-xs font-extrabold text-[#F46200]">{practicedPercent}% Practiced</span>
                </div>
                <div className="w-full bg-[#E7E2D8] rounded-full h-2.5 overflow-hidden mb-3">
                  <div
                    className="bg-[#F46200] h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${practicedPercent}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-white py-2 px-3 rounded-xl border border-[#E7E2D8]">
                    <p className="text-lg font-bold text-[#2D2D2D]">{practicedCount} / {totalQuestions}</p>
                    <p className="text-[11px] text-[#8A847C]">Completed</p>
                  </div>
                  <div className="bg-white py-2 px-3 rounded-xl border border-[#E7E2D8]">
                    <p className="text-lg font-bold text-[#2D2D2D]">{bookmarkedCount}</p>
                    <p className="text-[11px] text-[#8A847C]">Saved / Review</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="pt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('bank')}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'bank'
                    ? 'bg-[#F46200] text-white shadow-xs'
                    : 'bg-[#FAF8F4] text-[#5A554E] hover:text-[#2D2D2D] hover:bg-[#EFECE6] border border-[#E7E2D8]'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Question Bank ({totalQuestions})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('practice')}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'practice'
                    ? 'bg-[#F46200] text-white shadow-xs'
                    : 'bg-[#FAF8F4] text-[#5A554E] hover:text-[#2D2D2D] hover:bg-[#EFECE6] border border-[#E7E2D8]'
                }`}
              >
                <Play className="w-4 h-4" />
                <span>Self-Test Practice Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('guide')}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'guide'
                    ? 'bg-[#F46200] text-white shadow-xs'
                    : 'bg-[#FAF8F4] text-[#5A554E] hover:text-[#2D2D2D] hover:bg-[#EFECE6] border border-[#E7E2D8]'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>STAR Framework & Master Guide</span>
              </button>
            </div>
          </div>

          {/* TAB 1: QUESTION BANK */}
          {activeTab === 'bank' && (
            <div className="space-y-6">
              {/* Filter Controls Bar */}
              <div className="bg-white p-5 rounded-2xl border border-[#E7E2D8] shadow-xs space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 sm:items-center lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)_auto]">
                  {/* Search Input */}
                  <div className="relative min-w-0">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A847C]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search interview questions"
                      placeholder="Search by keyword, topic, or role"
                      className="min-h-11 w-full pl-10 pr-12 py-2 text-sm bg-[#FAF8F4] border border-[#E7E2D8] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F46200]/30 focus:border-[#F46200] text-[#2D2D2D] placeholder-[#8A847C]"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A847C] hover:text-[#2D2D2D]"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="flex min-w-0 items-center gap-2">
                    <label htmlFor="interview-category" className="text-sm font-semibold text-[#5A554E]">
                      Category
                    </label>
                    <div className="relative min-w-0 flex-1">
                      <select
                        id="interview-category"
                        value={selectedCategory}
                        onChange={(event) => setSelectedCategory(event.target.value)}
                        className="min-h-11 w-full cursor-pointer appearance-none truncate rounded-xl border border-[#E7E2D8] bg-[#FAF8F4] py-2 pl-3 pr-9 text-sm font-medium text-[#2D2D2D] hover:border-[#C9C0B1] focus-visible:outline-2 focus-visible:outline-[#AD4500]"
                      >
                        <option value="all">All categories ({totalQuestions})</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name} ({category.count})
                          </option>
                        ))}
                      </select>
                      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#5A554E]" />
                    </div>
                  </div>

                  {/* Difficulty Selector */}
                  <div className="flex items-center gap-2">
                    <label htmlFor="interview-level" className="text-sm font-semibold text-[#5A554E]">Level</label>
                    <select
                      id="interview-level"
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="min-h-11 text-sm font-medium py-2 px-3 bg-[#FAF8F4] border border-[#E7E2D8] rounded-xl text-[#2D2D2D] focus:outline-none focus:border-[#F46200] cursor-pointer"
                    >
                      <option value="all">All Difficulties</option>
                      <option value="Easy">Beginner / Intern</option>
                      <option value="Medium">Intermediate</option>
                      <option value="Hard">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* Quick Toggle Filters */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-[#5A554E]">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-[#2D2D2D]">
                      <input
                        type="checkbox"
                        checked={onlyBookmarked}
                        onChange={(e) => setOnlyBookmarked(e.target.checked)}
                        className="custom-checkbox"
                      />
                      <span>Saved for Review ({bookmarkedCount})</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer hover:text-[#2D2D2D]">
                      <input
                        type="checkbox"
                        checked={onlyUnpracticed}
                        onChange={(e) => setOnlyUnpracticed(e.target.checked)}
                        className="custom-checkbox"
                      />
                      <span>Unpracticed Only ({totalQuestions - practicedCount})</span>
                    </label>
                  </div>

                  <span className="text-xs font-medium text-[#8A847C]">
                    Showing <strong className="text-[#2D2D2D]">{filteredQuestions.length}</strong> of {totalQuestions} questions
                  </span>
                </div>
              </div>

              {/* Questions List */}
              {isLoading ? (
                <div className="py-20 text-center">
                  <div className="inline-block w-8 h-8 border-3 border-[#F46200] border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-sm text-[#5A554E]">Loading interview questions...</p>
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-[#E7E2D8]">
                  <HelpCircle className="w-10 h-10 text-[#8A847C] mx-auto mb-3" />
                  <h3 className="font-serif text-lg font-bold text-[#2D2D2D]">No questions match your filter</h3>
                  <p className="text-xs text-[#5A554E] max-w-sm mx-auto mt-1 mb-4">
                    Try adjusting your search keywords, clear category filters, or uncheck the saved/unpracticed options.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedDifficulty('all');
                      setSearchQuery('');
                      setOnlyBookmarked(false);
                      setOnlyUnpracticed(false);
                    }}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-[#F46200] bg-[#FFF3EB] border border-[#FAD7C0] hover:bg-[#F46200] hover:text-white transition-all cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredQuestions.map((q, idx) => {
                    const isExpanded = !!expandedIds[q.id];
                    const isPracticed = practicedIds.includes(q.id);
                    const isBookmarked = bookmarkedIds.includes(q.id);

                    return (
                      <div
                        key={q.id}
                        className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                          isExpanded
                            ? 'border-[#FAD7C0] shadow-md ring-1 ring-[#F46200]/15'
                            : 'border-[#E7E2D8] hover:border-[#D5CFC3] shadow-xs'
                        }`}
                      >
                        {/* Question Card Header */}
                        <div
                          onClick={() => toggleExpand(q.id)}
                          className="p-5 sm:p-6 cursor-pointer flex flex-col md:flex-row md:items-start justify-between gap-4"
                        >
                          <div className="space-y-2.5 flex-grow">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-serif italic text-[#8A847C]">
                                #{idx + 1}
                              </span>
                              <CategoryBadge category={q.category} />
                              <DifficultyBadge difficulty={q.difficulty} />
                              {q.job_role && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#5A554E] bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
                                  <Briefcase className="w-3 h-3 text-[#8A847C]" />
                                  {q.job_role}
                                </span>
                              )}
                              {isPracticed && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3" /> Practiced
                                </span>
                              )}
                            </div>

                            <h3 className="text-base sm:text-lg font-semibold text-[#2D2D2D] leading-snug">
                              {q.question}
                            </h3>
                          </div>

                          {/* Action Buttons */}
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 shrink-0 self-end md:self-start pt-2 md:pt-0"
                          >
                            <button
                              type="button"
                              onClick={(e) => handleToggleBookmark(q.id, e)}
                              title={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
                              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                isBookmarked
                                  ? 'bg-[#FFF3EB] border-[#FAD7C0] text-[#F46200]'
                                  : 'bg-white border-[#E7E2D8] text-[#8A847C] hover:text-[#2D2D2D] hover:bg-[#FAF8F4]'
                              }`}
                            >
                              {isBookmarked ? (
                                <BookmarkCheck className="w-4 h-4 fill-current" />
                              ) : (
                                <Bookmark className="w-4 h-4" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => startPracticeForQuestion(q)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#F46200] hover:bg-[#DC5800] transition-all cursor-pointer shadow-xs active:scale-95"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Practice</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleExpand(q.id)}
                              aria-label="Expand answer details"
                              className="p-2 rounded-xl border border-[#E7E2D8] bg-white text-[#5A554E] hover:text-[#2D2D2D] hover:bg-[#FAF8F4] transition-all cursor-pointer"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Accordion Expanded Content */}
                        {isExpanded && (
                          <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#EFECE6] bg-[#FAF8F4]/40 space-y-5">
                            {/* Why Interviewers Ask This */}
                            {q.why_asked && (
                              <div className="bg-[#FFF8F3] p-4 rounded-xl border border-[#FAD7C0]">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[#F46200] flex items-center gap-1.5 mb-1.5">
                                  <Lightbulb className="w-3.5 h-3.5" />
                                  <span>Why Hiring Managers Ask This</span>
                                </h4>
                                <p className="text-xs sm:text-sm text-[#5A554E] leading-relaxed">
                                  {q.why_asked}
                                </p>
                              </div>
                            )}

                            {/* Model Answer (With STAR highlights) */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D] flex items-center gap-1.5">
                                  <Award className="w-3.5 h-3.5 text-[#F46200]" />
                                  <span>Suggested Model Answer</span>
                                </h4>
                                <span className="text-[11px] text-[#8A847C]">
                                  Use this as inspiration; personalize with your experience.
                                </span>
                              </div>
                              <FormattedAnswer text={q.suggested_answer} />
                            </div>

                            {/* Pro Tips & Common Mistakes */}
                            {q.tips && (
                              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-1.5">
                                  <Compass className="w-3.5 h-3.5" />
                                  <span>Tips for Cambodian Graduates & Common Mistakes</span>
                                </h4>
                                <p className="text-xs sm:text-sm text-[#5A554E] leading-relaxed">
                                  {q.tips}
                                </p>
                              </div>
                            )}

                            {/* Bottom Card Controls */}
                            <div className="pt-3 border-t border-[#E7E2D8]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                              <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#2D2D2D]">
                                <input
                                  type="checkbox"
                                  checked={isPracticed}
                                  onChange={(e) => handleTogglePracticed(q.id, e)}
                                  className="custom-checkbox"
                                />
                                <span>I have practiced answering this question</span>
                              </label>

                              <button
                                type="button"
                                onClick={() => startPracticeForQuestion(q)}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-[#F46200] hover:text-[#DC5800] cursor-pointer"
                              >
                                <span>Open in interactive practice simulator</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INTERACTIVE PRACTICE MODE */}
          {activeTab === 'practice' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Flashcard & Simulator (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {practiceQuestion ? (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E2D8] shadow-[0_10px_30px_-15px_rgba(45,45,45,0.05)] space-y-6">
                    {/* Top Navigator */}
                    <div className="flex items-center justify-between pb-4 border-b border-[#E7E2D8]">
                      <div className="flex items-center gap-2">
                        <CategoryBadge category={practiceQuestion.category} />
                        <DifficultyBadge difficulty={practiceQuestion.difficulty} />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleNextPracticeQuestion(-1)}
                          className="px-3 py-1.5 rounded-xl border border-[#E7E2D8] text-xs font-semibold text-[#5A554E] hover:text-[#2D2D2D] hover:bg-[#FAF8F4] transition-all cursor-pointer"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNextPracticeQuestion(1)}
                          className="px-3 py-1.5 rounded-xl border border-[#E7E2D8] text-xs font-semibold text-[#5A554E] hover:text-[#2D2D2D] hover:bg-[#FAF8F4] transition-all cursor-pointer"
                        >
                          Next Question
                        </button>
                      </div>
                    </div>

                    {/* Question Statement */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#F46200] mb-2">
                        Target Role: {practiceQuestion.job_role || 'General / Tech Roles'}
                      </p>
                      <h2 className="font-serif text-2xl sm:text-3xl text-[#2D2D2D] leading-tight">
                        "{practiceQuestion.question}"
                      </h2>
                      {practiceQuestion.why_asked && (
                        <p className="text-xs text-[#8A847C] mt-2 italic">
                          Interviewer intent: {practiceQuestion.why_asked}
                        </p>
                      )}
                    </div>

                    {/* Timer Bar */}
                    <div className="bg-[#FAF8F4] p-4 rounded-2xl border border-[#E7E2D8] flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${isTimerRunning ? 'bg-[#FFF3EB] text-[#F46200] animate-pulse' : 'bg-white text-[#5A554E] border border-[#E7E2D8]'}`}>
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#8A847C] uppercase">Practice Timer</p>
                          <p className={`text-xl font-extrabold tracking-tight ${timerSeconds < 30 && isTimerRunning ? 'text-[#D4111A]' : 'text-[#2D2D2D]'}`}>
                            {formatTime(timerSeconds)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={toggleTimer}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isTimerRunning
                              ? 'bg-amber-500 hover:bg-amber-600 text-white'
                              : 'bg-[#F46200] hover:bg-[#DC5800] text-white shadow-xs'
                          }`}
                        >
                          {isTimerRunning ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                          <span>{isTimerRunning ? 'Pause' : 'Start Timer'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={resetTimer}
                          title="Reset Timer"
                          className="p-2 rounded-xl border border-[#E7E2D8] bg-white text-[#5A554E] hover:text-[#2D2D2D] hover:bg-stone-50 cursor-pointer"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>

                        <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-[#E7E2D8]">
                          {[60, 120, 180].map((sec) => (
                            <button
                              key={sec}
                              type="button"
                              onClick={() => setTimerDuration(sec)}
                              className={`px-2 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${
                                timerInitial === sec
                                  ? 'bg-[#2D2D2D] text-white'
                                  : 'bg-white text-[#5A554E] border border-[#E7E2D8] hover:bg-stone-50'
                              }`}
                            >
                              {sec / 60}m
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Candidate Answer Box */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D] flex items-center gap-1.5">
                          <span>Your Drafted Response</span>
                          <span className="text-[11px] font-normal text-[#8A847C]">(Auto-saved in browser)</span>
                        </label>
                        <span className="text-[11px] text-[#8A847C]">
                          {practiceAnswer.trim() ? `${practiceAnswer.trim().split(/\s+/).length} words` : '0 words'}
                        </span>
                      </div>

                      <textarea
                        rows={7}
                        value={practiceAnswer}
                        onChange={(e) => setPracticeAnswer(e.target.value)}
                        placeholder="Draft your bullet points or full response here using the STAR format:&#10;Situation: Where did this happen? (e.g. In my Year 3 web project at CADT)&#10;Task: What challenge or goal was assigned to you?&#10;Action: What specific technologies or steps did YOU take?&#10;Result: What was the measurable outcome or grade?"
                        className="w-full p-4 text-sm bg-[#FAF8F4] border border-[#E7E2D8] rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F46200]/30 focus:border-[#F46200] text-[#2D2D2D] placeholder-[#8A847C]/70 leading-relaxed font-sans"
                      />

                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={handleSaveNotes}
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-[#E7E2D8] text-[#2D2D2D] hover:bg-[#FAF8F4] cursor-pointer"
                        >
                          Save My Notes
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsAnswerRevealed((prev) => !prev)}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isAnswerRevealed
                              ? 'bg-stone-200 text-[#2D2D2D]'
                              : 'bg-[#FFF3EB] text-[#F46200] border border-[#FAD7C0] hover:bg-[#F46200] hover:text-white'
                          }`}
                        >
                          {isAnswerRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{isAnswerRevealed ? 'Hide Model Answer' : 'Reveal Model Answer & STAR Analysis'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Revealed Model Answer Section */}
                    {isAnswerRevealed && (
                      <div className="pt-6 border-t border-[#E7E2D8] space-y-4 animate-element">
                        <div className="bg-[#FAF8F4] p-5 rounded-2xl border border-[#E7E2D8]">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F46200] flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4" />
                              <span>Model Answer Breakdown</span>
                            </h3>
                            <span className="text-[11px] text-[#8A847C]">Compare with your answer above</span>
                          </div>

                          <FormattedAnswer text={practiceQuestion.suggested_answer} />

                          {practiceQuestion.tips && (
                            <div className="mt-4 pt-3 border-t border-[#E7E2D8]/80 text-xs text-[#5A554E] leading-relaxed">
                              <strong className="text-[#2D2D2D]">Coaching Tip: </strong>
                              {practiceQuestion.tips}
                            </div>
                          )}
                        </div>

                        {/* Self-Evaluation Evaluation Buttons */}
                        <div className="bg-white p-5 rounded-2xl border border-[#E7E2D8] space-y-3">
                          <p className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D]">
                            How did you perform on this question?
                          </p>
                          <div className="grid grid-cols-3 gap-2.5">
                            <button
                              type="button"
                              onClick={() => handleSelfRating('Needs Practice')}
                              className="py-2.5 px-3 rounded-xl text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-all cursor-pointer text-center"
                            >
                              Needs Practice
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSelfRating('Good')}
                              className="py-2.5 px-3 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all cursor-pointer text-center"
                            >
                              Feeling Good
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSelfRating('Mastered')}
                              className="py-2.5 px-3 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-all cursor-pointer text-center"
                            >
                              Mastered
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-12 text-center border border-[#E7E2D8]">
                    <HelpCircle className="w-10 h-10 text-[#8A847C] mx-auto mb-3" />
                    <p className="text-sm font-semibold text-[#2D2D2D]">Please select a question to practice.</p>
                  </div>
                )}
              </div>

              {/* Right Column: Question Queue / Switcher (4 cols) */}
              <div className="lg:col-span-4 space-y-5">
                <div className="bg-white rounded-3xl p-5 border border-[#E7E2D8] shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E7E2D8]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D]">
                      Question Queue ({filteredQuestions.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        const random = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
                        if (random) setPracticeQuestion(random);
                      }}
                      className="text-xs font-semibold text-[#F46200] hover:text-[#DC5800] cursor-pointer"
                    >
                      Shuffle / Random
                    </button>
                  </div>

                  <div className="max-h-[560px] overflow-y-auto space-y-2 pr-1">
                    {filteredQuestions.map((q, idx) => {
                      const isCurrent = practiceQuestion?.id === q.id;
                      const isPracticed = practicedIds.includes(q.id);

                      return (
                        <div
                          key={q.id}
                          onClick={() => setPracticeQuestion(q)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                            isCurrent
                              ? 'bg-[#FFF3EB] border-[#FAD7C0] text-[#2D2D2D] shadow-xs ring-1 ring-[#F46200]/20'
                              : 'bg-white border-[#E7E2D8] hover:border-[#D5CFC3] hover:bg-[#FAF8F4]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A847C]">
                              #{idx + 1} | {q.category}
                            </span>
                            {isPracticed && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs font-semibold text-[#2D2D2D] line-clamp-2">
                            {q.question}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Tips Box */}
                <div className="bg-[#FAF8F4] p-5 rounded-3xl border border-[#E7E2D8]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D] mb-2 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-[#F46200]" />
                    <span>Self-Practice Best Practices</span>
                  </h4>
                  <ul className="text-xs text-[#5A554E] space-y-2 leading-relaxed">
                    <li className="flex items-start gap-1.5">
                                            <span><strong>Speak Out Loud:</strong> Do not just think in your head; record yourself or speak aloud to build English muscle memory.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                                            <span><strong>Stick to 2 Minutes:</strong> Most behavioral questions should be answered in 90 to 120 seconds.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                                            <span><strong>Focus on Action:</strong> 60% of your time should be what YOU did, using action verbs (built, designed, debugged, presented).</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STAR FRAMEWORK & MASTER GUIDE */}
          {activeTab === 'guide' && guide && (
            <div className="space-y-10">
              {/* STAR Framework Visual Deep-Dive */}
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E7E2D8] shadow-[0_10px_30px_-15px_rgba(45,45,45,0.05)]">
                <div className="max-w-3xl mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF3EB] border border-[#FAD7C0] text-xs font-bold text-[#F46200] mb-3">
                    <Award className="w-3.5 h-3.5" />
                    <span>The Gold Standard for Competency-Based Interviews</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#2D2D2D] tracking-tight">
                    {guide.starMethod?.title || 'The STAR Framework'}: The 4-Part Winning Structure
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-[#5A554E] leading-relaxed">
                    {guide.starMethod?.overview || 'The industry standard formula used by top employers to evaluate candidate answers.'}
                  </p>
                </div>

                {/* 4 STAR Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {(guide.starMethod?.components || []).map((st, i) => {
                    const colors = [
                      { bg: 'bg-blue-50/70', border: 'border-blue-200', text: 'text-blue-800' },
                      { bg: 'bg-amber-50/70', border: 'border-amber-200', text: 'text-amber-800' },
                      { bg: 'bg-[#FFF3EB]', border: 'border-[#FAD7C0]', text: 'text-[#F46200]' },
                      { bg: 'bg-emerald-50/70', border: 'border-emerald-200', text: 'text-emerald-800' }
                    ][i % 4];

                    return (
                      <div
                        key={st.letter}
                        className={`rounded-2xl p-5 border ${colors.bg} ${colors.border} flex flex-col justify-between`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-serif text-3xl font-bold text-[#2D2D2D]">
                              {st.letter}
                            </span>
                            <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border ${colors.border} ${colors.text}`}>
                              {st.targetPercent || '25%'}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-[#2D2D2D] mb-2">
                            {st.phase}
                          </h3>
                          <p className="text-xs text-[#5A554E] leading-relaxed mb-4">
                            {st.explanation}
                          </p>
                        </div>

                        {st.example && (
                          <div className="pt-3 border-t border-black/5">
                            <p className="text-[11px] font-bold text-[#2D2D2D] mb-1">Example in Action:</p>
                            <p className="text-xs italic text-[#5A554E] bg-white/70 p-2.5 rounded-xl border border-black/5">
                              "{st.example}"
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4-Step UX Preparation Roadmap */}
              {guide.instructions && (
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E7E2D8] shadow-xs">
                  <div className="max-w-2xl mb-8">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="font-serif italic text-2xl font-normal text-[#F46200]">
                        Roadmap
                      </span>
                      <span className="text-xs font-bold tracking-widest uppercase text-[#5A554E]">
                        Step-by-Step Preparation
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl text-[#2D2D2D]">
                      4 Steps to Prepare for Cambodian Tech & Business Interviews
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {guide.instructions.map((step) => (
                      <div
                        key={step.step}
                        className="p-6 rounded-2xl bg-[#FAF8F4] border border-[#E7E2D8] flex gap-4"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#F46200] text-white font-bold flex items-center justify-center shrink-0">
                          {step.step}
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-base font-bold text-[#2D2D2D]">
                            {step.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-[#5A554E] leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* English Fluency Tips for Cambodian Non-Native Speakers */}
              {guide.englishTips && (
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E7E2D8] shadow-xs">
                  <div className="max-w-2xl mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Designed for Non-Native English Speakers</span>
                    </div>
                    <h3 className="font-serif text-2xl text-[#2D2D2D]">
                      English Interview Confidence & Pacing Tips
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5A554E] mt-1">
                      Hiring managers in Cambodia care most about clear communication, logical answers, and a positive attitude.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {guide.englishTips.map((tip, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl border border-[#E7E2D8] bg-[#FAF8F4]/70 space-y-2"
                      >
                        <h4 className="text-sm font-bold text-[#2D2D2D] flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#F46200] shrink-0" />
                          <span>{tip.title}</span>
                        </h4>
                        <p className="text-xs text-[#5A554E] leading-relaxed">
                          {tip.tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Checklists: In-Person vs Online */}
              {guide.checklists && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* In Person Checklist */}
                  {guide.checklists.inPerson && (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E2D8] shadow-xs space-y-4">
                      <div className="flex items-center gap-2 text-[#2D2D2D]">
                        <Briefcase className="w-5 h-5 text-[#F46200]" />
                        <h3 className="font-serif text-lg font-bold">
                          In-Person Interview Checklist (Phnom Penh)
                        </h3>
                      </div>
                      <ul className="space-y-2.5">
                        {guide.checklists.inPerson.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#5A554E]">
                            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Online Zoom / Meet Checklist */}
                  {guide.checklists.online && (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E2D8] shadow-xs space-y-4">
                      <div className="flex items-center gap-2 text-[#2D2D2D]">
                        <Sparkles className="w-5 h-5 text-[#F46200]" />
                        <h3 className="font-serif text-lg font-bold">
                          Online Video Interview Checklist (Zoom / Google Meet)
                        </h3>
                      </div>
                      <ul className="space-y-2.5">
                        {guide.checklists.online.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#5A554E]">
                            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {publicMode && <Footer />}
    </div>
  );
}
