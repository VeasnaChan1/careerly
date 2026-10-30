import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles, Download, ArrowDown } from 'lucide-react';

export default function Hero() {
  const [aiAccepted, setAiAccepted] = useState(true);

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Subtle background hairline grid/accent without glowing blobs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#2D2D2D] leading-[1.12] tracking-tight mb-6">
              Build your <span className="italic font-normal underline decoration-[#F46200]/30 underline-offset-8">CV</span>. Find your <span className="italic font-normal underline decoration-[#F46200]/30 underline-offset-8">job</span>. Ace your <span className="italic font-normal underline decoration-[#F46200]/30 underline-offset-8">interview</span>.
            </h1>

            {/* Subheading in plain words */}
            <p className="text-lg sm:text-xl text-[#5A554E] leading-relaxed max-w-2xl mb-8">
              A straightforward platform for Cambodian students and graduates. Write a professional English CV with real-time AI checking, find verified local jobs, and practice realistic interviews without expensive fees.
            </p>

            {/* Actions: Primary CTA + Secondary Link */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <a
                href="#signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white bg-[#F46200] hover:bg-[#DC5800] active:scale-[0.99] transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F46200]"
              >
                <span>Build my CV for free</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-1.5 px-6 py-4 rounded-full text-base font-medium text-[#2D2D2D] hover:text-[#F46200] transition-colors group"
              >
                <span>See how it works</span>
                <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              </a>
            </div>

            {/* Trust Points */}
            <div className="pt-6 border-t border-[#E7E2D8] w-full flex flex-wrap items-center gap-y-2 gap-x-8 text-xs sm:text-sm text-[#5A554E]">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#F46200]" />
                Free basic tier forever
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#F46200]" />
                Built for mobile screens
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#F46200]" />
                Instant PDF download
              </span>
            </div>
          </div>

          {/* Right Column: Handcrafted HTML/CSS CV Preview */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md w-full">
              
              {/* CV Sheet Container */}
              <div className="bg-white rounded-2xl border border-[#E7E2D8] shadow-[0_20px_40px_-15px_rgba(45,45,45,0.07)] p-6 sm:p-7 relative transition-all">
                
                {/* CV Header */}
                <div className="border-b border-[#EFECE6] pb-5 mb-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-[#2D2D2D] tracking-tight">
                        Dara Sok
                      </h2>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#F46200] mt-0.5">
                        Junior Frontend Developer
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#5A554E] bg-[#FAF8F4] px-2.5 py-1 rounded-full border border-[#E7E2D8]">
                      Phnom Penh, KH
                    </span>
                  </div>

                  <p className="text-xs text-[#5A554E] mt-2 leading-relaxed">
                    dara.sok@cadtedu.kh · github.com/darasok · (+855) 12 345 678
                  </p>
                </div>

                {/* CV Education */}
                <div className="mb-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D] mb-1.5">
                    Education
                  </h3>
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[#2D2D2D]">Cambodia Academy of Digital Technology</span>
                    <span className="text-[#8A847C]">2022 – 2026</span>
                  </div>
                  <p className="text-xs text-[#5A554E]">B.S. in Computer Science · GPA: 3.7 / 4.0</p>
                </div>

                {/* CV Experience with LIVE AI Suggestion */}
                <div className="mb-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D] mb-1.5">
                    Experience & Projects
                  </h3>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-[#2D2D2D]">Frontend Intern · Cadence Tech Studio</span>
                    <span className="text-[#8A847C]">2025</span>
                  </div>

                  {/* Bullet Point with Interactive AI Badge */}
                  <div className="relative mt-2 p-2.5 rounded-xl bg-[#FFF8F3] border border-[#FAD7C0] transition-all">
                    
                    {/* Small Header for the AI Suggestion */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#F46200]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Careerly AI Phrasing</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAiAccepted(!aiAccepted)}
                        className="text-[10px] font-semibold text-[#2D2D2D] underline hover:text-[#F46200]"
                      >
                        {aiAccepted ? 'Show original' : 'Apply AI fix'}
                      </button>
                    </div>

                    {/* Text content comparison */}
                    {aiAccepted ? (
                      <p className="text-xs text-[#2D2D2D] font-medium leading-relaxed">
                        • Rebuilt client portal with React and Tailwind CSS, speeding up page load time by 34% and drafting bilingual release notes in clear English.
                        <span className="inline-flex items-center gap-1 ml-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          <Check className="w-3 h-3" /> Accepted
                        </span>
                      </p>
                    ) : (
                      <p className="text-xs text-[#8A847C] line-through leading-relaxed">
                        • Made the website faster with React and wrote some English notes for clients.
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-[#5A554E] mt-2.5 leading-relaxed">
                    • Built responsive capstone dashboard using Vite and REST APIs for campus student clubs.
                  </p>
                </div>

                {/* CV Skills */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D] mb-1.5">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {['React.js', 'Tailwind CSS', 'JavaScript (ES6)', 'Git / GitHub', 'Technical English'].map((skill) => (
                      <span
                        key={skill}
                        className="text-[11px] font-medium px-2 py-0.5 bg-[#FAF8F4] text-[#2D2D2D] rounded border border-[#E7E2D8]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Floating Bottom Badge */}
                <div className="mt-5 pt-4 border-t border-[#EFECE6] flex items-center justify-between text-xs text-[#5A554E]">
                  <span className="flex items-center gap-1.5 font-semibold text-[#2D2D2D]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    CV Quality Score: 94/100
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium text-[#F46200]">
                    <Download className="w-3.5 h-3.5" />
                    Export PDF
                  </span>
                </div>

              </div>

              {/* Decorative warm label badge */}
              <div className="hidden sm:flex items-center gap-2 absolute -bottom-5 -right-3 bg-[#2D2D2D] text-white px-3.5 py-2 rounded-xl text-xs font-medium shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#F46200] animate-pulse"></span>
                <span>Live interactive HTML/CSS Preview</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
