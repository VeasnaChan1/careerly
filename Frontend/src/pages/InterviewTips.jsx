import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  Sparkles,
  Award,
  BookOpen,
  Play,
  ArrowRight,
  Clock,
  Printer,
  RotateCcw,
  Copy,
  Check,
  Calendar,
  Briefcase,
  Video,
  Building,
  Mail,
  ChevronRight,
  Compass,
  Lightbulb,
  ShieldCheck,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  getInterviewTips,
  getCompletedChecklistItems,
  toggleChecklistItem,
  resetChecklist
} from '../services/interviewApi';

// Fallback static checklist items if API is unavailable or offline
const defaultFallbackTips = {
  title: 'Essential Interview Checklist & Confidence Tips',
  subtitle:
    'Short, confidence-building steps before, during, and after your interview to turn anxiety into composure.',
  stages: [
    {
      id: 'before',
      name: 'Before the Interview',
      subtitle: 'Preparation & Mindset (1 week to morning of)',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      confidenceBooster:
        'They reviewed your CV and chose to invite you. You already qualify — the interview is simply to meet the person behind the paper.',
      items: [
        {
          id: 'before-research-company',
          title: 'Research Company & Role Basics',
          description:
            'Learn their mission, main products, and recent milestones. Identifying 1-2 reasons why you want to work there transforms nervousness into authentic enthusiasm.',
          category: 'preparation',
          timeframe: '2-3 days before',
          format: 'both'
        },
        {
          id: 'before-review-cv',
          title: 'Know Your CV & Key Projects',
          description:
            'Re-read your CV line-by-line. Pick 2-3 projects you are proud of so you can explain your individual contributions with confidence.',
          category: 'preparation',
          timeframe: '1-2 days before',
          format: 'both'
        },
        {
          id: 'before-prepare-star',
          title: 'Rehearse 2-3 STAR Stories',
          description:
            'Structure real examples using Situation, Task, Action (60%), and Result. Having go-to stories for challenges, teamwork, and leadership prevents freezing.',
          category: 'practice',
          timeframe: '2 days before',
          format: 'both'
        },
        {
          id: 'before-prepare-questions',
          title: 'Prepare 2-3 Strategic Questions',
          description:
            'Draft questions about team expectations, engineering culture, or 90-day goals. Remember: interviews are a mutual conversation, not a one-way test.',
          category: 'preparation',
          timeframe: '1 day before',
          format: 'both'
        },
        {
          id: 'before-attire-logistics',
          title: 'Check Tech Setup & Travel Route',
          description:
            'In-person: iron clean professional attire and plan to arrive 10-15 minutes early. Online: test camera, microphone, stable Wi-Fi, and quiet lighting.',
          category: 'logistics',
          timeframe: 'Evening before',
          format: 'both'
        },
        {
          id: 'before-rest-mindset',
          title: 'Rest & Grounding Breath',
          description:
            'Sleep 7-8 hours. On interview morning, hydrate, take 3 slow belly breaths, and remind yourself: they invited you because you belong in the room.',
          category: 'mindset',
          timeframe: 'Morning of',
          format: 'both'
        }
      ]
    },
    {
      id: 'during',
      name: 'During the Interview',
      subtitle: 'Presence, Delivery & Communication',
      badgeColor: 'bg-[#FFF3EB] text-[#F46200] border-[#FAD7C0]',
      confidenceBooster:
        'Silence is thinking, not stumbling. A calm 2-second breath before answering projects maturity and keeps your English steady.',
      items: [
        {
          id: 'during-first-impression',
          title: 'Warm Greeting & Confident Posture',
          description:
            'Smile warmly, greet the interviewers by name, and sit upright with relaxed shoulders. On video calls, look into the camera lens to project natural eye contact.',
          category: 'presence',
          timeframe: 'First 60s',
          format: 'both'
        },
        {
          id: 'during-pacing-breath',
          title: 'Pause 2 Seconds Before Answering',
          description:
            'Take a calm 2-second breath before answering each question. Pausing shows senior composure and gives you space to organize your thoughts in English.',
          category: 'communication',
          timeframe: 'Throughout',
          format: 'both'
        },
        {
          id: 'during-star-structure',
          title: 'Anchor Answers with STAR Method',
          description:
            'Keep background brief (~25%). Focus 60% of your response on the specific actions YOU executed, and conclude with the tangible result.',
          category: 'structure',
          timeframe: 'Behavioral',
          format: 'both'
        },
        {
          id: 'during-clarify-honesty',
          title: 'Ask for Clarification Without Fear',
          description:
            "If an English term or question is unclear, ask politely: 'Could you please clarify what you mean by X?' Asking shows active listening and maturity.",
          category: 'communication',
          timeframe: 'When needed',
          format: 'both'
        },
        {
          id: 'during-honest-problem-solving',
          title: 'Handle Unknowns with Curiosity',
          description:
            "If you don't know an answer, don't guess blindly. Say: 'I haven't used that tool directly yet, but here is how I would approach investigating and solving it.'",
          category: 'mindset',
          timeframe: 'Technical',
          format: 'both'
        },
        {
          id: 'during-ask-questions',
          title: 'Ask Your Prepared Questions',
          description:
            'When invited at the end, ask your prepared questions. Asking thoughtful questions demonstrates ambition, engagement, and genuine interest in the team.',
          category: 'engagement',
          timeframe: 'Final 10m',
          format: 'both'
        }
      ]
    },
    {
      id: 'after',
      name: 'After the Interview',
      subtitle: 'Follow-Up, Reflection & Momentum',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      confidenceBooster:
        'Every interview makes you stronger. Celebrate your courage for stepping up, and let the process unfold while keeping your search momentum.',
      items: [
        {
          id: 'after-closing-thanks',
          title: 'Warm Closing & Clarify Next Steps',
          description:
            "Warmly thank the interviewers for their time, express enthusiasm for the role, and ask: 'What are the expected next steps in your hiring process?'",
          category: 'closing',
          timeframe: 'Wrap-up',
          format: 'both'
        },
        {
          id: 'after-write-notes',
          title: '5-Minute Immediate Reflection Notes',
          description:
            'While details are fresh, jot down the questions asked, what went well, and areas to polish. Every interview makes you a sharper, stronger candidate.',
          category: 'reflection',
          timeframe: 'Within 30m',
          format: 'both'
        },
        {
          id: 'after-thank-you-email',
          title: 'Send a 24-Hour Thank-You Email',
          description:
            'Send a concise 3-4 sentence thank-you note referencing one specific discussion topic from the call. Use our built-in copyable email template.',
          category: 'followup',
          timeframe: 'Within 24h',
          format: 'both'
        },
        {
          id: 'after-celebrate-effort',
          title: 'Celebrate Your Effort & Courage',
          description:
            'Take a moment to acknowledge your hard work. Interviewing in a professional setting takes courage—be proud of showing up and presenting your story.',
          category: 'mindset',
          timeframe: 'Same day',
          format: 'both'
        },
        {
          id: 'after-keep-momentum',
          title: 'Maintain Search Momentum',
          description:
            'Never pause your job search for a single employer until an official offer letter is signed. Keep applying, networking, and practicing.',
          category: 'mindset',
          timeframe: 'Ongoing',
          format: 'both'
        }
      ]
    }
  ],
  thankYouTemplate: {
    subject: 'Thank you - [Your Name] - [Position Title] Interview',
    body: `Dear [Interviewer Name],

Thank you very much for your time today to discuss the [Position Title] role at [Company Name]. I really enjoyed learning more about [specific topic or challenge discussed, e.g. the team's upcoming dashboard redesign].

Our conversation reinforced my enthusiasm for the position, and I am confident that my experience with [1-2 key skills, e.g. React and API integration] will allow me to contribute positively to the team.

Please let me know if you need any additional samples or information. I look forward to hearing about the next steps.

Warm regards,
[Your Name]
[Your Phone Number] | [Your LinkedIn]`
  }
};

export default function InterviewTips({ publicMode = true, embedded = false }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Data state
  const [tipsData, setTipsData] = useState(defaultFallbackTips);
  const [isLoading, setIsLoading] = useState(true);

  // User interactive checklist tracking
  const [completedIds, setCompletedIds] = useState(() => getCompletedChecklistItems());

  // Filter state: 'all' | 'before' | 'during' | 'after'
  const [selectedStage, setSelectedStage] = useState('all');

  // Format filter: 'all' | 'in-person' | 'online'
  const [formatFilter, setFormatFilter] = useState('all');

  // Copy state for thank-you email
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Fetch tips from backend or use fallback
  useEffect(() => {
    let isMounted = true;
    async function fetchTips() {
      setIsLoading(true);
      try {
        const data = await getInterviewTips();
        if (isMounted && data && data.stages) {
          setTipsData(data);
        }
      } catch (err) {
        // Fallback to rich embedded tips on network error
        console.warn('Using local interview tips data:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchTips();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync completed checklist items
  const handleToggleItem = (itemId) => {
    const updated = toggleChecklistItem(itemId);
    setCompletedIds(updated);
    const isChecked = updated.includes(itemId);
    if (isChecked) {
      toast.success('Task checked off! Great preparation.', { icon: '✅' });
    }
  };

  const handleResetChecklist = () => {
    if (window.confirm('Reset your checklist progress? This will uncheck all items.')) {
      const empty = resetChecklist();
      setCompletedIds(empty);
      toast.success('Checklist reset.');
    }
  };

  // Flattened total items count and progress
  const allItems = useMemo(() => {
    return (tipsData.stages || []).flatMap((st) => st.items || []);
  }, [tipsData]);

  const totalCount = allItems.length;
  const completedCount = allItems.filter((it) => completedIds.includes(it.id)).length;
  const percentCompleted = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filtered stages according to selectedStage
  const displayedStages = useMemo(() => {
    if (!tipsData.stages) return [];
    if (selectedStage === 'all') return tipsData.stages;
    return tipsData.stages.filter((s) => s.id === selectedStage);
  }, [tipsData, selectedStage]);

  // Copy thank you email
  const handleCopyEmail = () => {
    const text = tipsData.thankYouTemplate?.body || defaultFallbackTips.thankYouTemplate.body;
    navigator.clipboard.writeText(text);
    setCopiedEmail(true);
    toast.success('Thank-you email template copied to clipboard!');
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  // Print checklist
  const handlePrint = () => {
    window.print();
  };

  // Base path for interview prep
  const prepBasePath = publicMode ? '/interview' : '/app/interview';

  const content = (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Breadcrumb Navigation */}
      {!embedded && (
        <nav className="flex items-center gap-2 text-xs text-[#8A847C] mb-6 print:hidden">
          <Link to="/" className="hover:text-[#2D2D2D] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={prepBasePath} className="hover:text-[#2D2D2D] transition-colors">
            Interview Prep
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#2D2D2D] font-semibold">Tips & Checklist</span>
        </nav>
      )}

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E7E2D8] shadow-[0_10px_30px_-15px_rgba(45,45,45,0.05)] mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E7E2D8]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF3EB] border border-[#FAD7C0] text-xs font-bold text-[#F46200] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interview Day Confidence System</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#2D2D2D] tracking-tight leading-snug">
              {tipsData.title || 'Essential Interview Checklist & Confidence Tips'}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#5A554E] leading-relaxed">
              {tipsData.subtitle ||
                'A short, concise checklist for before, during, and after your interview. Check off items as you prepare to walk into your interview feeling calm and confident.'}
            </p>
          </div>

          {/* Interactive Progress & Actions Card */}
          <div className="bg-[#FAF8F4] p-5 rounded-2xl border border-[#E7E2D8] min-w-[280px] shrink-0 print:border-none">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5A554E]">
                Preparation Readiness
              </span>
              <span className="text-xs font-extrabold text-[#F46200]">{percentCompleted}% Ready</span>
            </div>
            <div className="w-full bg-[#E7E2D8] rounded-full h-2.5 overflow-hidden mb-3">
              <div
                className="bg-[#F46200] h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentCompleted}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-[#5A554E] pt-1">
              <span>
                <strong>{completedCount}</strong> of <strong>{totalCount}</strong> items checked
              </span>
              <button
                type="button"
                onClick={handleResetChecklist}
                className="text-[11px] font-semibold text-[#8A847C] hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset checklist"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-4 pt-3 border-t border-[#E7E2D8] flex items-center gap-2 print:hidden">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-[#E7E2D8] hover:border-[#D5CFC3] text-xs font-bold text-[#2D2D2D] transition-all cursor-pointer shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5 text-[#5A554E]" />
                <span>Print Checklist</span>
              </button>
              <Link
                to={`${prepBasePath}?tab=practice`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#F46200] hover:bg-[#DC5800] text-xs font-bold text-white transition-all shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Practice Now</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Preparation Flow Navigation Tabs */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
          {/* Stage Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedStage('all')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedStage === 'all'
                  ? 'bg-[#F46200] text-white shadow-xs'
                  : 'bg-[#FAF8F4] text-[#5A554E] hover:text-[#2D2D2D] hover:bg-[#EFECE6] border border-[#E7E2D8]'
              }`}
            >
              All Stages ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setSelectedStage('before')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedStage === 'before'
                  ? 'bg-[#F46200] text-white shadow-xs'
                  : 'bg-[#FAF8F4] text-[#5A554E] hover:text-[#2D2D2D] hover:bg-[#EFECE6] border border-[#E7E2D8]'
              }`}
            >
              1. Before the Interview
            </button>
            <button
              type="button"
              onClick={() => setSelectedStage('during')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedStage === 'during'
                  ? 'bg-[#F46200] text-white shadow-xs'
                  : 'bg-[#FAF8F4] text-[#5A554E] hover:text-[#2D2D2D] hover:bg-[#EFECE6] border border-[#E7E2D8]'
              }`}
            >
              2. During the Interview
            </button>
            <button
              type="button"
              onClick={() => setSelectedStage('after')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedStage === 'after'
                  ? 'bg-[#F46200] text-white shadow-xs'
                  : 'bg-[#FAF8F4] text-[#5A554E] hover:text-[#2D2D2D] hover:bg-[#EFECE6] border border-[#E7E2D8]'
              }`}
            >
              3. After the Interview
            </button>
          </div>

          {/* Quick jump to question bank & practice */}
          <div className="flex items-center gap-3">
            <Link
              to={`${prepBasePath}?tab=bank`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A554E] hover:text-[#F46200] transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Question Bank</span>
            </Link>
            <span className="text-[#E7E2D8]">|</span>
            <Link
              to={`${prepBasePath}?tab=guide`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A554E] hover:text-[#F46200] transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              <span>STAR Guide</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Checklist Stages (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {displayedStages.map((stage) => {
            const stageItems = stage.items || [];
            const stageCompletedCount = stageItems.filter((item) => completedIds.includes(item.id)).length;
            const isStageAllDone = stageItems.length > 0 && stageCompletedCount === stageItems.length;

            return (
              <div
                key={stage.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E2D8] shadow-xs relative overflow-hidden"
              >
                {/* Stage Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-[#E7E2D8]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${stage.badgeColor}`}
                      >
                        {stage.name}
                      </span>
                      {isStageAllDone && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <Check className="w-3 h-3 stroke-[3]" />
                          Stage Complete
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#8A847C] font-medium">{stage.subtitle}</p>
                  </div>

                  <span className="text-xs font-semibold text-[#5A554E] bg-[#FAF8F4] px-3 py-1 rounded-xl border border-[#E7E2D8] self-start sm:self-auto">
                    {stageCompletedCount} / {stageItems.length} checked
                  </span>
                </div>

                {/* Stage Confidence Booster Quote */}
                {stage.confidenceBooster && (
                  <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-[#FAF8F4] to-white border border-[#E7E2D8] flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#FFF3EB] border border-[#FAD7C0] flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#F46200]" />
                    </div>
                    <p className="text-xs text-[#5A554E] italic leading-relaxed">
                      <strong className="text-[#2D2D2D] not-italic font-semibold">Confidence Rule: </strong>
                      {stage.confidenceBooster}
                    </p>
                  </div>
                )}

                {/* Stage Checklist Items */}
                <div className="space-y-3.5">
                  {stageItems.map((item) => {
                    const isChecked = completedIds.includes(item.id);

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleToggleItem(item.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 select-none ${
                          isChecked
                            ? 'bg-[#FAF8F4]/80 border-[#E7E2D8] opacity-75'
                            : 'bg-white border-[#E7E2D8] hover:border-[#D5CFC3] hover:shadow-2xs'
                        }`}
                      >
                        {/* Checkbox Icon */}
                        <button
                          type="button"
                          className="mt-0.5 shrink-0 transition-transform active:scale-90"
                          aria-label={isChecked ? 'Mark uncompleted' : 'Mark completed'}
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                          ) : (
                            <Circle className="w-5 h-5 text-[#8A847C] hover:text-[#F46200] transition-colors" />
                          )}
                        </button>

                        {/* Item Details */}
                        <div className="flex-grow space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3
                              className={`text-sm font-bold transition-colors ${
                                isChecked ? 'text-[#5A554E] line-through' : 'text-[#2D2D2D]'
                              }`}
                            >
                              {item.title}
                            </h3>

                            {item.timeframe && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8A847C] bg-[#FAF8F4] px-2 py-0.5 rounded-md border border-[#E7E2D8]">
                                <Clock className="w-3 h-3 text-[#F46200]" />
                                {item.timeframe}
                              </span>
                            )}
                          </div>

                          <p
                            className={`text-xs leading-relaxed ${
                              isChecked ? 'text-[#8A847C]' : 'text-[#5A554E]'
                            }`}
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Tools, Email Template, & Pacing Guide (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Post-Interview Thank-You Email Template Box */}
          <div className="bg-white rounded-3xl p-6 border border-[#E7E2D8] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFF3EB] border border-[#FAD7C0] flex items-center justify-center text-[#F46200]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D]">
                    Thank-You Email Template
                  </h3>
                  <p className="text-[11px] text-[#8A847C]">Send within 24 hours after interview</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-[#FAF8F4] hover:bg-[#EFECE6] border border-[#E7E2D8] text-[#2D2D2D] transition-all cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#5A554E]" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-[#FAF8F4] p-3.5 rounded-2xl border border-[#E7E2D8] text-xs text-[#5A554E] font-mono whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
              {tipsData.thankYouTemplate?.body || defaultFallbackTips.thankYouTemplate.body}
            </div>

            <p className="text-[11px] text-[#8A847C] leading-normal italic">
              Tip: Personalize the bracketed sections [in brackets] with specific discussions from your call.
            </p>
          </div>

          {/* Golden Rules for Non-Native English Speakers */}
          <div className="bg-white rounded-3xl p-6 border border-[#E7E2D8] shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D]">
                  3 Golden Mindset Rules
                </h3>
                <p className="text-[11px] text-[#8A847C]">For Cambodian students & job seekers</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#FAF8F4] border border-[#E7E2D8]">
                <h4 className="text-xs font-bold text-[#2D2D2D] mb-1">1. Clarity Over Accent</h4>
                <p className="text-xs text-[#5A554E] leading-relaxed">
                  Local and international employers in Phnom Penh want to know if you can communicate clearly, not if you sound American or British. Focus on simple, confident sentences.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F4] border border-[#E7E2D8]">
                <h4 className="text-xs font-bold text-[#2D2D2D] mb-1">2. Own Your Contributions ("I" vs "We")</h4>
                <p className="text-xs text-[#5A554E] leading-relaxed">
                  Cambodian culture emphasizes modesty and collective effort. While team spirit is valued, interviewers need to evaluate YOU. Always specify: <em>"My exact role was..."</em>
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F4] border border-[#E7E2D8]">
                <h4 className="text-xs font-bold text-[#2D2D2D] mb-1">3. The 2-Minute Maximum</h4>
                <p className="text-xs text-[#5A554E] leading-relaxed">
                  Most answers should stay between 90 and 120 seconds. If an interviewer wants deeper detail, they will ask a follow-up. Avoid rambling.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Practice Mode Card */}
          <div className="bg-gradient-to-br from-[#FFF8F3] to-[#FAF8F4] rounded-3xl p-6 border border-[#FAD7C0] shadow-xs text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#F46200] text-white flex items-center justify-center mx-auto shadow-xs">
              <Play className="w-4 h-4 ml-0.5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#2D2D2D]">
              Ready to practice speaking?
            </h3>
            <p className="text-xs text-[#5A554E] leading-relaxed">
              Reading tips gives you knowledge; speaking out loud builds English fluency and muscle memory.
            </p>
            <Link
              to={`${prepBasePath}?tab=practice`}
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-full bg-[#F46200] hover:bg-[#DC5800] text-xs font-bold text-white transition-all shadow-xs"
            >
              <span>Launch Self-Test Practice Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#2D2D2D] selection:bg-[#F46200]/20 selection:text-[#F46200]">
      {publicMode && <Navbar />}
      <main className="flex-grow">{content}</main>
      {publicMode && <Footer />}
    </div>
  );
}
