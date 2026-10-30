import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#FAF8F4] border-t border-[#E7E2D8] pt-16 pb-12 text-[#5A554E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#E7E2D8]">
          
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight text-[#2D2D2D] mb-4">
              <span className="font-sans font-extrabold text-2xl tracking-tight text-[#2D2D2D]">
                Careerly
              </span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#D4111A] translate-y-[-4px]" aria-hidden="true"></span>
            </Link>
            
            <p className="text-sm text-[#5A554E] max-w-sm leading-relaxed mb-6">
              A straightforward English CV builder, verified local job finder, and AI interview prep tool created for Cambodian university students and recent graduates.
            </p>

            <div className="text-xs text-[#8A847C] space-y-1">
              <p>Cambodia Academy of Digital Technology (CADT)</p>
              <p>Bridge 2, National Road 6A, Prek Leap, Chroy Changvar, Phnom Penh</p>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D2D2D] mb-4">
              Features
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/app/builder/guest" className="hover:text-[#2D2D2D] transition-colors">
                  Build Free CV
                </Link>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-[#2D2D2D] transition-colors">
                  AI Suggestion Engine
                </a>
              </li>
              <li>
                <a href="/#features" className="hover:text-[#2D2D2D] transition-colors">
                  Job Finder
                </a>
              </li>
              <li>
                <a href="/#pricing" className="hover:text-[#2D2D2D] transition-colors">
                  Student Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Year 3 CADT Capstone Note */}
          <div>
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
            <Link to="/app/builder/guest" className="hover:text-[#2D2D2D] transition-colors">
              Build my CV
            </Link>
            <a href="/#pricing" className="hover:text-[#2D2D2D] transition-colors">
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
