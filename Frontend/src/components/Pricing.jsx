import React from 'react';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

export default function Pricing() {
  const freeFeatures = [
    'Access to essential CV templates',
    'AI phrasing credits for 1 active CV',
    'Post-completion CV check & score',
    'Instant PDF download (no watermark)',
    'Browse & apply to local job ads',
    'Company job posting & basic recruitment',
    'General interview preparation guides',
  ];

  const premiumFeatures = [
    'Unlimited professional templates & styling',
    'Expanded AI phrasing credits for multiple CVs',
    'Comprehensive post-completion grammar check',
    'Instant ATS-optimized PDF exports',
    'Browse & apply to local job ads',
    'Company job posting & recruitment tools',
    'AI Mock Interview practice with live feedback',
    'Targeted industry question simulator',
    'Priority candidate highlight on job board',
  ];

  return (
    <section id="pricing" className="py-20 border-t border-[#E7E2D8] bg-[#FAF8F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Counter */}
        <div className="flex items-baseline gap-3 mb-4">
          <span className="font-serif italic text-2xl sm:text-3xl font-normal text-[#F46200]">
            04
          </span>
          <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#5A554E]">
            Fair & Accessible Pricing
          </span>
        </div>

        <div className="max-w-3xl mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2D2D2D] tracking-tight leading-snug">
            Simple pricing made for Cambodia.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#5A554E] leading-relaxed">
            International resume builders ask for $15–$25 monthly subscriptions with foreign credit cards. Careerly keeps it fair: a useful free tier and a $2.99 plan priced for university budgets.
          </p>
        </div>

        {/* Side by side pricing cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Free Tier (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-[#E7E2D8] flex flex-col justify-between shadow-[0_10px_25px_-15px_rgba(45,45,45,0.05)]">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A554E]">
                  Free Tier
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF8F4] text-[#5A554E] border border-[#E7E2D8]">
                  Forever Free
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-4xl sm:text-5xl font-bold text-[#2D2D2D]">
                    $0
                  </span>
                  <span className="text-sm font-medium text-[#8A847C]">/ month</span>
                </div>
                <p className="text-sm text-[#5A554E] mt-2">
                  Everything you need to write a clean English CV and find your first job.
                </p>
              </div>

              <div className="pt-6 border-t border-[#EFECE6] mb-8">
                <p className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D] mb-4">
                  What's included:
                </p>
                <ul className="space-y-3 text-sm text-[#5A554E]">
                  {freeFeatures.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#8A847C] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <a
              href="#start"
              className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-full text-sm font-semibold text-[#2D2D2D] bg-[#FAF8F4] border border-[#D5CFC3] hover:bg-[#EFECE6] active:scale-[0.99] transition-all text-center focus-visible:ring-2 focus-visible:ring-[#F46200]"
            >
              Start for free
            </a>
          </div>

          {/* Premium Tier (Visually Stronger - 7 cols, Dark Charcoal High Contrast) */}
          <div className="lg:col-span-7 bg-[#2D2D2D] text-white rounded-3xl p-8 sm:p-10 border border-[#3E3E3E] flex flex-col justify-between shadow-[0_20px_40px_-15px_rgba(0,0,0,0.25)] relative overflow-hidden">
            
            {/* Top Corner Ribbon / Badge */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F46200] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Premium Plan
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F46200] text-white">
                Most Popular
              </span>
            </div>

            <div>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-5xl sm:text-6xl font-bold text-white">
                    $2.99
                  </span>
                  <span className="text-sm font-medium text-[#C5C0B8]">/ month</span>
                </div>
                <p className="text-sm text-[#D5CFC3] mt-2">
                  Less than the cost of one iced latte in Phnom Penh. Full AI interview preparation and unlimited resume revisions.
                </p>
              </div>

              <div className="pt-6 border-t border-[#444444] mb-8">
                <p className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                  Everything in Free, plus:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#E7E2D8]">
                  {premiumFeatures.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#F46200] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#444444] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-[#A8A29A]">
                Cancel anytime · No long-term lock-in
              </span>
              <a
                href="#start"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-full text-sm font-semibold text-white bg-[#F46200] hover:bg-[#DC5800] active:scale-[0.99] transition-all shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F46200]"
              >
                <span>Upgrade to Premium</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
