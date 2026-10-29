import React from 'react';

export default function Problem() {
  const problems = [
    {
      number: '01',
      title: 'Writing an English CV when English isn\'t your first language is stressful.',
      description:
        'You have the actual skills, but translating your coursework and projects into professional English with strong action verbs is tough. International templates are often rigid and don\'t guide your phrasing.',
    },
    {
      number: '02',
      title: 'Job openings are scattered across dozens of chat channels and feeds.',
      description:
        'Instead of one reliable directory, job postings are buried in private Telegram channels, Facebook group posts, and stale portals. You waste hours scrolling feeds and sending emails into the void.',
    },
    {
      number: '03',
      title: 'Walking into an interview room without any realistic practice.',
      description:
        'Most university programs never teach students how to handle real interviews. Fresh graduates freeze when asked situational questions in English—not from lack of talent, but simply from lack of practice.',
    },
  ];

  return (
    <section id="problem" className="py-20 border-t border-[#E7E2D8] bg-[#FAF8F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with deck-style 01 counter and thin rule */}
        <div className="flex items-baseline gap-3 mb-4">
          <span className="font-serif italic text-2xl sm:text-3xl font-normal text-[#F46200]">
            01
          </span>
          <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#5A554E]">
            The Problem We Solve
          </span>
        </div>

        <div className="max-w-3xl mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2D2D2D] tracking-tight leading-snug">
            Job hunting in Phnom Penh shouldn't feel like a constant guess.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#5A554E] leading-relaxed">
            We talked with Cambodian undergraduates and recent alumni across CADT, RUPP, and Norton. Three hurdles kept coming up again and again.
          </p>
        </div>

        {/* 3 Human Problem Items in an editorial row with clean vertical dividers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-b border-[#E7E2D8]">
          {problems.map((item, index) => (
            <div
              key={item.number}
              className={`py-8 md:py-10 ${
                index !== 0 ? 'md:border-l border-t md:border-t-0 border-[#E7E2D8]' : ''
              } ${index === 0 ? 'md:pr-8' : index === 1 ? 'md:px-8' : 'md:pl-8'}`}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F46200]">
                  Hurdle {item.number}
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#2D2D2D] leading-snug mb-3">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-[#5A554E] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
