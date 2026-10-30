import React from 'react';
import { ArrowRight, Check } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-20 border-t border-[#E7E2D8] bg-[#FAF8F4]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-[#E7E2D8] text-center shadow-[0_15px_35px_-15px_rgba(45,45,45,0.06)] relative overflow-hidden">
          
          {/* Subtle Warm Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF3EB] border border-[#FAD7C0] text-xs font-semibold text-[#F46200] mb-6">
            <span>Free Forever Starter Tier</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2D2D2D] tracking-tight leading-tight max-w-2xl mx-auto mb-6">
            Your next job starts with a CV you feel proud to share.
          </h2>

          <p className="text-base sm:text-lg text-[#5A554E] max-w-xl mx-auto leading-relaxed mb-8">
            Join Cambodian university students and fresh graduates who use Careerly to format their experience and practice real interviews.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href="#signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white bg-[#F46200] hover:bg-[#DC5800] active:scale-[0.99] transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F46200]"
            >
              <span>Build my CV for free</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-full text-base font-medium text-[#2D2D2D] hover:bg-[#FAF8F4] transition-colors"
            >
              View pricing details
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#8A847C]">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#F46200]" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#F46200]" />
              Works smoothly on mobile
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#F46200]" />
              Instant PDF export
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
