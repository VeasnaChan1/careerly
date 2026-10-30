import React from 'react';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const freeFeatures = [
    '1 professional English CV with live formatting',
    'Real-time English grammar & action-verb suggestions',
    'Standard A4 clean layout templates',
    'Instant watermark-free PDF download',
    'Search & filter verified local entry-level jobs',
    'Community access & Telegram channel tips'
  ];

  const premiumFeatures = [
    'Unlimited CV variations & role-targeted versions',
    'Deep ATS scoring & keyword match for specific job posts',
    '50+ realistic AI mock interview sessions with spoken audio',
    'Tailored interview feedback scoring & ideal model answers',
    '1-click AI Cover Letter generation tailored to each employer',
    'Priority job alerts sent straight to your Telegram/Email'
  ];

  return (
    <section id="pricing" className="py-20 md:py-28 bg-[#FAF8F4] border-t border-[#E7E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F4] border border-[#E7E2D8] text-xs font-semibold uppercase tracking-wider text-[#5A554E] mb-4">
            <span>04 — Fair Pricing</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-[#2D2D2D] tracking-tight mb-4">
            Transparent pricing designed for student budgets.
          </h2>

          <p className="text-base text-[#5A554E] leading-relaxed">
            Free forever for your essential CV and job search. Upgrade only if you want deep AI interview coaching and tailored role preparation.
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

            <Link
              to="/app/builder/guest"
              className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-full text-sm font-semibold text-[#2D2D2D] bg-[#FAF8F4] border border-[#D5CFC3] hover:bg-[#EFECE6] active:scale-[0.99] transition-all text-center focus-visible:ring-2 focus-visible:ring-[#F46200]"
            >
              Start for free
            </Link>
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
                <p className="text-sm text-[#C5C0B8] mt-2">
                  The equivalent of one cafe coffee in BKK1 for full AI career coaching.
                </p>
              </div>

              <div className="pt-6 border-t border-[#404040] mb-8">
                <p className="text-xs font-bold uppercase tracking-wider text-[#E7E2D8] mb-4">
                  Everything in Free, plus:
                </p>
                <ul className="space-y-3.5 text-sm text-[#E7E2D8]">
                  {premiumFeatures.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <span className="p-0.5 rounded-full bg-[#F46200]/20 text-[#F46200] shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-[#F46200]" />
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <Link
                to="/signup"
                className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-full text-base font-semibold text-white bg-[#F46200] hover:bg-[#DC5800] active:scale-[0.99] transition-all shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2D2D2D] focus-visible:ring-[#F46200]"
              >
                <span>Upgrade to Premium ($2.99)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-center text-[11px] text-[#8A847C] mt-3">
                Pay with Bakong KHQR, ABA PayWay, or card. Cancel anytime with one click.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
