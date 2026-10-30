import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-[#E7E2D8] bg-[#FAF8F4] text-[#5A554E] pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#E7E2D8]">
          
          {/* Brand & Mission */}
          <div className="md:col-span-6 flex flex-col items-start">
            <a href="#" className="flex items-center gap-1.5 text-2xl font-bold tracking-tight text-[#2D2D2D] mb-3">
              <span className="font-sans font-extrabold text-2xl tracking-tight text-[#2D2D2D]">
                Careerly
              </span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#D4111A] translate-y-[-4px]" aria-hidden="true"></span>
            </a>

            <p className="text-sm text-[#5A554E] max-w-md leading-relaxed mb-4">
              "Delivering innovative digital solutions that help unemployed to be hired."
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFECE6] text-xs font-medium text-[#2D2D2D]">
              <span>careerly.com</span>
              <span className="text-[#8A847C]">·</span>
              <span>Group 3, Phnom Penh, Cambodia</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D] mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="hover:text-[#F46200] transition-colors">
                  Features & Bento
                </a>
              </li>
              <li>
                <a href="#problem" className="hover:text-[#F46200] transition-colors">
                  The Problem
                </a>
              </li>
              <li>
                <a href="#who-it-is-for" className="hover:text-[#F46200] transition-colors">
                  Who It Is For
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[#F46200] transition-colors">
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Student Project Note */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D] mb-3">
              About This Project
            </h4>
            <p className="text-xs text-[#5A554E] leading-relaxed mb-2">
              Developed as a Year 3 Capstone / Term project by Group 3 at Cambodia Academy of Digital Technology (CADT).
            </p>
            <p className="text-xs text-[#8A847C]">
              Phnom Penh, Cambodia
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A847C]">
          <p>© {new Date().getFullYear()} Careerly (Group 3). Student project, Phnom Penh.</p>
          <div className="flex items-center gap-6">
            <a href="#start" className="hover:text-[#2D2D2D] transition-colors">
              Build my CV
            </a>
            <a href="#pricing" className="hover:text-[#2D2D2D] transition-colors">
              Pricing ($2.99/mo)
            </a>
            <span className="text-[#2D2D2D] font-medium">
              careerly.com
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
