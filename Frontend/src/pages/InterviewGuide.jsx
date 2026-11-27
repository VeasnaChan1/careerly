import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  BookOpen,
  Briefcase,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getInterviewGuide } from '../services/interviewApi';

const FALLBACK_GUIDE = {
  title: 'How an Interview Works & Preparation Guide',
  subtitle:
    'Understand each stage of the hiring process and follow a clear, step-by-step plan to prepare with confidence.',
  stages: [
    {
      stage: 1,
      title: 'Application & HR Screening Call',
      duration: '15–20 minutes',
      whatToExpect:
        'A recruiter or HR coordinator reviews your CV and calls or chats to verify your basic qualifications, availability, expected salary, and English communication.',
      howToPrepare: [
        "Keep a 60-second 'Tell me about yourself' pitch ready.",
        'Know the key points on your CV so you can explain them clearly.',
        "Research the company's main product or service before the call."
      ]
    },
    {
      stage: 2,
      title: 'Skills or Technical Assessment',
      duration: '30–90 minutes',
      whatToExpect:
        'Depending on the role, you may complete a practical task, coding exercise, portfolio walkthrough, or role-specific problem-solving session.',
      howToPrepare: [
        'Review fundamentals listed in the job description.',
        'Explain your thought process step by step instead of staying silent.',
        'Ask clarifying questions if any requirement is ambiguous.'
      ]
    },
    
    {
      stage: 3,
      title: 'Behavioral & Team Interview',
      duration: '30–45 minutes',
      whatToExpect:
        'Hiring managers or future teammates ask how you handle challenges, teamwork, deadlines, and mistakes to see how you work with others.',
      howToPrepare: [
        'Prepare 3–4 real stories from university projects, internships, or jobs.',
        'Use the STAR method (Situation, Task, Action, Result) to stay structured.',
        'Focus on what YOU personally did and the measurable outcome.'
      ]
    },
    {
      stage: 4,
      title: 'Final Round & Questions to Ask',
      duration: '20–45 minutes',
      whatToExpect:
        'A final conversation with a team lead, manager, or founder about long-term fit, growth goals, and your questions about the role.',
      howToPrepare: [
        'Prepare 2–3 thoughtful questions about team workflow, onboarding, or success metrics.',
        'Confirm next steps and timeline politely before ending the interview.',
        'Send a short thank-you message within 24 hours.'
      ]
    }
  ],
  instructions: [
    {
      step: 1,
      title: 'Research the Company & Role',
      description:
        "Spend 20 minutes studying the company's product, recent news, and the exact tools listed on the job description."
    },
    {
      step: 2,
      title: 'Structure Every Story with STAR',
      description:
        'Structure behavioral answers into Situation (15%), Task (15%), Action (50%), and Result (20%).'
    },
    {
      step: 3,
      title: 'Rehearse Out Loud in English',
      description:
        'Practice speaking your answers aloud at a steady, clear pace (120–140 words per minute).'
    },
    {
      step: 4,
      title: 'Prepare 2–3 Questions to Ask',
      description:
        'Asking thoughtful questions at the end shows curiosity, preparation, and genuine interest in the team.'
    }
  ],
  starMethod: {
    title: 'The STAR Framework',
    overview:
      'A simple 4-part structure used by employers to evaluate behavioral and experience-based answers.',
    components: [
      {
        letter: 'S',
        phase: 'Situation',
        targetPercent: '15%',
        explanation: 'Set the context briefly: where you were working or studying and the initial setup.',
        example:
          'During our final semester capstone project, our 4-person team had 8 weeks to build an e-commerce web platform.'
      },
      {
        letter: 'T',
        phase: 'Task',
        targetPercent: '15%',
        explanation: 'Define the specific challenge, goal, or responsibility you needed to handle.',
        example:
          'Two weeks before the demo, our team needed authentication and payment integration finished on schedule.'
      },
      {
        letter: 'A',
        phase: 'Action',
        targetPercent: '50%',
        explanation: 'Walk through the exact steps YOU took, tools you used, and how you collaborated.',
        example:
          'I took ownership of the auth module, documented the API endpoints, and ran daily 15-minute syncs with my partner.'
      },
      {
        letter: 'R',
        phase: 'Result',
        targetPercent: '20%',
        explanation: 'Share the concrete outcome, metric, or lesson learned from your work.',
        example:
          'We delivered the demo 2 days early with zero breaking bugs during live testing.'
      }
    ]
  },
  englishTips: [
    {
      title: 'Slow Down Your Pacing',
      tip: 'Take a 2-second breath before answering. Speaking at a steady pace makes your answers clearer and more confident.'
    },
    {
      title: 'Use Clear Transition Phrases',
      tip: "Guide the interviewer with signposts like 'First, I analyzed...', 'Next, I built...', and 'As a result...'."
    },
    {
      title: "Highlight 'I' Alongside 'We'",
      tip: "Give credit to your team, then clearly state your personal contribution: 'My specific responsibility was...'."
    },
    {
      title: 'Clarify Politely When Unsure',
      tip: "If you miss a word or detail, ask politely: 'Could you please clarify what you mean by...?'."
    }
  ],
  checklists: {
    inPerson: [
      'Bring 2–3 clean printed copies of your CV in a folder.',
      'Arrive 10–15 minutes early.',
      'Greet the interviewer politely with eye contact.',
      'Wear clean business-casual or formal attire.'
    ],
    online: [
      'Test your microphone, camera, and internet 30 minutes early.',
      'Place your camera at eye level with good front lighting.',
      'Choose a quiet background free of distractions.',
      'Keep your CV, a pen, and a notebook nearby.'
    ]
  }
};

export default function InterviewGuide({ publicMode = false }) {
  const [guide, setGuide] = useState(FALLBACK_GUIDE);

  useEffect(() => {
    let active = true;
    getInterviewGuide()
      .then((remoteGuide) => {
        if (active && remoteGuide) {
          setGuide({
            ...FALLBACK_GUIDE,
            ...remoteGuide,
            stages:
              Array.isArray(remoteGuide.stages) && remoteGuide.stages.length > 0
                ? remoteGuide.stages
                : FALLBACK_GUIDE.stages
          });
        }
      })
      .catch(() => {
        // Fallback content already loaded
      });
    return () => {
      active = false;
    };
  }, []);

  const practicePath = publicMode ? '/interview' : '/app/interview';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#2D2D2D]">
      {publicMode && <Navbar />}

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 space-y-10">
          {/* Header */}
          <header className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E7E2D8] shadow-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF3EB] border border-[#FAD7C0] text-xs font-bold text-[#F46200] mb-4">
              <Compass className="w-3.5 h-3.5" />
              <span>Interview Guide</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#2D2D2D]">
              How an Interview Works
            </h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-[#5A554E] leading-relaxed">
              {guide.subtitle}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={practicePath}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-[#F46200] text-white hover:bg-[#DC5800] transition-colors shadow-xs"
              >
                <BookOpen className="w-4 h-4" />
                <span>Practice Interview Questions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </header>

          {/* Section 1: Interview Stages */}
          <section aria-labelledby="interview-stages-heading" className="space-y-5">
            <div>
              <h2 id="interview-stages-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2D2D]">
                1. Typical Interview Stages
              </h2>
              <p className="mt-1 text-sm text-[#5A554E]">
                Most hiring processes follow four main stages from your first call to the final offer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {guide.stages.map((item) => (
                <article
                  key={item.stage}
                  className="bg-white rounded-2xl p-6 border border-[#E7E2D8] shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F46200] bg-[#FFF3EB] px-2.5 py-1 rounded-full border border-[#FAD7C0]">
                        Stage {item.stage}
                      </span>
                      {item.duration && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#5A554E]">
                          <Clock className="w-3.5 h-3.5 text-[#8A847C]" />
                          {item.duration}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-[#2D2D2D]">{item.title}</h3>
                    <p className="text-sm text-[#5A554E] leading-relaxed">{item.whatToExpect}</p>
                  </div>

                  {Array.isArray(item.howToPrepare) && item.howToPrepare.length > 0 && (
                    <div className="pt-4 border-t border-[#E7E2D8]">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D] mb-2">
                        How to prepare
                      </p>
                      <ul className="space-y-1.5">
                        {item.howToPrepare.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#5A554E]">
                            <CheckCircle2 className="w-4 h-4 text-[#F46200] shrink-0 mt-0.5" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>

          {/* Section 2: Step-by-Step Preparation Roadmap */}
          {guide.instructions && (
            <section
              aria-labelledby="prep-roadmap-heading"
              className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E7E2D8] shadow-xs"
            >
              <div className="max-w-2xl mb-7">
                <h2 id="prep-roadmap-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2D2D]">
                  2. How to Prepare Step by Step
                </h2>
                <p className="mt-1 text-sm text-[#5A554E]">
                  Follow these four habits before every interview to feel calm and ready.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {guide.instructions.map((step) => (
                  <div
                    key={step.step}
                    className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#E7E2D8] flex gap-4"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#F46200] text-white font-bold flex items-center justify-center shrink-0 text-sm">
                      {step.step}
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-[#2D2D2D]">{step.title}</h3>
                      <p className="text-xs sm:text-sm text-[#5A554E] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 3: STAR Answer Method */}
          {guide.starMethod && (
            <section
              aria-labelledby="star-method-heading"
              className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E7E2D8] shadow-xs"
            >
              <div className="max-w-3xl mb-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF3EB] border border-[#FAD7C0] text-xs font-bold text-[#F46200] mb-3">
                  <Award className="w-3.5 h-3.5" />
                  <span>Answer Structure</span>
                </div>
                <h2 id="star-method-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2D2D]">
                  3. {guide.starMethod.title}
                </h2>
                <p className="mt-1 text-sm text-[#5A554E] leading-relaxed">
                  {guide.starMethod.overview}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {(guide.starMethod.components || []).map((st, i) => {
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
                          <span className="font-serif text-3xl font-bold text-[#2D2D2D]">{st.letter}</span>
                          <span
                            className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border ${colors.border} ${colors.text}`}
                          >
                            {st.targetPercent || '25%'}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-[#2D2D2D] mb-2">{st.phase}</h3>
                        <p className="text-xs text-[#5A554E] leading-relaxed mb-4">{st.explanation}</p>
                      </div>

                      {st.example && (
                        <div className="pt-3 border-t border-black/5">
                          <p className="text-[11px] font-bold text-[#2D2D2D] mb-1">Example:</p>
                          <p className="text-xs italic text-[#5A554E] bg-white/70 p-2.5 rounded-xl border border-black/5">
                            "{st.example}"
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Section 4: English Tips */}
          {guide.englishTips && (
            <section
              aria-labelledby="english-tips-heading"
              className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E7E2D8] shadow-xs"
            >
              <div className="max-w-2xl mb-6">
                <h2 id="english-tips-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2D2D]">
                  4. Communication & Confidence Tips
                </h2>
                <p className="text-sm text-[#5A554E] mt-1">
                  Clear structure and calm pacing matter more than complex vocabulary.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {guide.englishTips.map((tip, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-[#E7E2D8] bg-[#FAF8F4]/70 space-y-2">
                    <h3 className="text-sm font-bold text-[#2D2D2D] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#F46200] shrink-0" />
                      <span>{tip.title}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5A554E] leading-relaxed">{tip.tip}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 5: Day-of Checklists */}
          {guide.checklists && (
            <section aria-labelledby="checklists-heading" className="space-y-4">
              <h2 id="checklists-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2D2D]">
                5. Interview Day Checklists
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guide.checklists.inPerson && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E2D8] shadow-xs space-y-4">
                    <div className="flex items-center gap-2 text-[#2D2D2D]">
                      <Briefcase className="w-5 h-5 text-[#F46200]" />
                      <h3 className="font-serif text-lg font-bold">In-Person Interview</h3>
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

                {guide.checklists.online && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E2D8] shadow-xs space-y-4">
                    <div className="flex items-center gap-2 text-[#2D2D2D]">
                      <Sparkles className="w-5 h-5 text-[#F46200]" />
                      <h3 className="font-serif text-lg font-bold">Online Video Interview</h3>
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
            </section>
          )}
        </div>
      </main>

      {publicMode && <Footer />}
    </div>
  );
}
