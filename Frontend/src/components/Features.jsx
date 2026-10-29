import React from 'react';
import { FileText, CheckCircle2, Briefcase, MessageSquare, ArrowRight, Sparkles, Smartphone, Download } from 'lucide-react';

export default function Features() {
  return (
    <section id="features" className="py-20 border-t border-[#E7E2D8] bg-[#FAF8F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Counter */}
        <div className="flex items-baseline gap-3 mb-4">
          <span className="font-serif italic text-2xl sm:text-3xl font-normal text-[#F46200]">
            02
          </span>
          <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#5A554E]">
            How Careerly Works
          </span>
        </div>

        <div className="max-w-3xl mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2D2D2D] tracking-tight leading-snug">
            Three connected tools designed for job seekers in Cambodia.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#5A554E] leading-relaxed">
            Most international platforms charge monthly subscription traps or fail on mobile. Careerly handles the whole journey—from your first resume draft to answering interview questions.
          </p>
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Card 1: CV Builder (Large Dominant Card - 7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-7 sm:p-9 border border-[#E7E2D8] flex flex-col justify-between shadow-[0_10px_30px_-15px_rgba(45,45,45,0.05)] hover:border-[#D5CFC3] transition-all">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF3EB] border border-[#FAD7C0] text-xs font-bold text-[#F46200]">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Part 1 · Core Platform</span>
                </div>
                <span className="text-xs font-semibold text-[#8A847C] flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" /> Mobile & Desktop
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#2D2D2D] leading-tight mb-3">
                Smart CV Builder with post-completion AI checking.
              </h3>
              
              <p className="text-base text-[#5A554E] leading-relaxed mb-6">
                Created so Khmer speakers with basic English can produce clean, international-standard resumes. Draft your experience naturally, use AI to strengthen your phrasing, and get an automated check once you are finished.
              </p>

              {/* Differentiator Highlight Box */}
              <div className="bg-[#FAF8F4] rounded-2xl p-4 sm:p-5 border border-[#E7E2D8] mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F46200]" />
                  <span>The Careerly Difference: Post-Completion Audit</span>
                </div>
                <p className="text-xs sm:text-sm text-[#5A554E] leading-relaxed">
                  Unlike Canva or FlowCV which only format text, Careerly scans your completed CV for passive grammar, missing contact details, and weak bullets before you download.
                </p>

                {/* Audit Checklist Mockup */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#E7E2D8]/60 text-xs">
                  <div className="flex items-center gap-2 text-[#2D2D2D] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Action verbs verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#2D2D2D] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Khmer English phrasing polished</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#2D2D2D] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>ATS readable layout</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#2D2D2D] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant clean PDF download</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EFECE6] flex items-center justify-between">
              <span className="text-xs font-medium text-[#8A847C]">Includes free professional templates</span>
              <a
                href="#start"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#F46200] hover:text-[#DC5800]"
              >
                <span>Try CV Builder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Two Stacked Bento Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Card 2: Job Matching (Top Right) */}
            <div className="bg-white rounded-3xl p-7 border border-[#E7E2D8] flex flex-col justify-between shadow-[0_10px_30px_-15px_rgba(45,45,45,0.05)] hover:border-[#D5CFC3] transition-all">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F4] border border-[#E7E2D8] text-xs font-bold text-[#2D2D2D] mb-4">
                  <Briefcase className="w-3.5 h-3.5 text-[#F46200]" />
                  <span>Part 2 · Direct Matching</span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-[#2D2D2D] leading-tight mb-2">
                  Unified local job board with 1-click apply.
                </h3>

                <p className="text-sm text-[#5A554E] leading-relaxed mb-4">
                  Stop hunting through endless Telegram threads. Browse verified opportunities from Cambodian companies and apply directly using your Careerly CV.
                </p>

                {/* Job Ticket Mockup */}
                <div className="p-3.5 rounded-xl bg-[#FAF8F4] border border-[#E7E2D8] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#2D2D2D]">Junior Associate / Tech Intern</p>
                    <p className="text-[11px] text-[#8A847C]">Phnom Penh · Direct Employer Contact</p>
                  </div>
                  <span className="text-[11px] font-semibold text-[#F46200] bg-[#FFF3EB] px-2.5 py-1 rounded-full">
                    Direct Apply
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#EFECE6] flex items-center justify-between">
                <span className="text-xs text-[#8A847C]">Companies recruit for free</span>
                <span className="text-xs font-semibold text-[#2D2D2D]">Apply in 1 tap</span>
              </div>
            </div>

            {/* Card 3: Interview Preparation (Bottom Right) */}
            <div className="bg-white rounded-3xl p-7 border border-[#E7E2D8] flex flex-col justify-between shadow-[0_10px_30px_-15px_rgba(45,45,45,0.05)] hover:border-[#D5CFC3] transition-all">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F4] border border-[#E7E2D8] text-xs font-bold text-[#2D2D2D] mb-4">
                  <MessageSquare className="w-3.5 h-3.5 text-[#F46200]" />
                  <span>Part 3 · Interview Prep</span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-[#2D2D2D] leading-tight mb-2">
                  Practice questions and AI mock interviews.
                </h3>

                <p className="text-sm text-[#5A554E] leading-relaxed mb-4">
                  Overcome interview anxiety with curated questions asked by local hiring managers, salary negotiation tips, and on-demand AI mock practice sessions (Premium).
                </p>

                {/* Question preview mockup */}
                <div className="p-3 rounded-xl bg-[#FFF8F3] border border-[#FAD7C0] text-xs text-[#2D2D2D]">
                  <p className="font-semibold text-[#F46200] text-[11px] uppercase tracking-wider mb-1">
                    Sample Practice Question
                  </p>
                  <p className="italic text-[#2D2D2D]">
                    "How do you handle working on a team project when teammates disagree on the approach?"
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#EFECE6] flex items-center justify-between">
                <span className="text-xs text-[#8A847C]">Instant feedback on your answers</span>
                <span className="text-xs font-semibold text-[#F46200]">AI Mock Simulator</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
