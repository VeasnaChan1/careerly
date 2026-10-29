import React from 'react';
import { GraduationCap, Award, RefreshCw } from 'lucide-react';

export default function WhoItIsFor() {
  const personas = [
    {
      icon: GraduationCap,
      category: 'Stage 01',
      title: 'University Students & Interns',
      pain: '"I have zero formal full-time experience to put on a resume."',
      solution:
        'Careerly helps you structure coursework, student club responsibilities, hackathons, and volunteer activities into convincing, professional English bullet points.',
      takeaway: 'Turn campus assignments into verified credentials.',
    },
    {
      icon: Award,
      category: 'Stage 02',
      title: 'Fresh Graduates',
      pain: '"My CV feels unpolished and foreign tools cost $20 a month."',
      solution:
        'Get an employer-ready CV without spending lunch money. Use our post-completion audit to catch formatting errors before applying directly to local partner companies.',
      takeaway: 'Land your first full-time role with confidence.',
    },
    {
      icon: RefreshCw,
      category: 'Stage 03',
      title: 'Career Switchers',
      pain: '"How do I explain five years in hospitality when applying for tech?"',
      solution:
        'Highlight transferable problem-solving and communication skills. Re-phrase past achievements to align with new roles and rehearse career-shift interview questions.',
      takeaway: 'Transition between industries with clear narrative.',
    },
  ];

  return (
    <section id="who-it-is-for" className="py-20 border-t border-[#E7E2D8] bg-[#FAF8F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Counter */}
        <div className="flex items-baseline gap-3 mb-4">
          <span className="font-serif italic text-2xl sm:text-3xl font-normal text-[#F46200]">
            03
          </span>
          <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#5A554E]">
            Target Audience
          </span>
        </div>

        <div className="max-w-3xl mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2D2D2D] tracking-tight leading-snug">
            Designed specifically for where you stand right now.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#5A554E] leading-relaxed">
            Most resume tools assume you have ten years of Silicon Valley experience. Careerly was built in Phnom Penh for students and candidates starting out.
          </p>
        </div>

        {/* 3 Personas with distinct editorial styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {personas.map((persona) => {
            const Icon = persona.icon;
            return (
              <div
                key={persona.title}
                className="bg-white rounded-3xl p-8 border border-[#E7E2D8] flex flex-col justify-between shadow-[0_10px_25px_-15px_rgba(45,45,45,0.05)] hover:border-[#D5CFC3] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F46200]">
                      {persona.category}
                    </span>
                    <Icon className="w-5 h-5 text-[#5A554E]" />
                  </div>

                  <h3 className="font-serif text-2xl text-[#2D2D2D] leading-tight mb-3">
                    {persona.title}
                  </h3>

                  {/* Honest Pain Quote */}
                  <div className="p-3 rounded-xl bg-[#FAF8F4] border-l-2 border-[#F46200] mb-4">
                    <p className="text-xs italic text-[#5A554E] leading-relaxed">
                      {persona.pain}
                    </p>
                  </div>

                  <p className="text-sm text-[#5A554E] leading-relaxed mb-6">
                    {persona.solution}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EFECE6]">
                  <p className="text-xs font-semibold text-[#2D2D2D]">
                    {persona.takeaway}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
