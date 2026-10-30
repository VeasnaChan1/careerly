import React, { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F4]/90 backdrop-blur-md border-b border-[#E7E2D8] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand */}
          <a
            href="#"
            className="flex items-center gap-1.5 text-2xl font-bold tracking-tight text-[#2D2D2D] focus-visible:ring-2 focus-visible:ring-[#F46200] rounded-lg px-1 py-0.5"
            aria-label="Careerly Homepage"
          >
            <span className="font-sans font-extrabold text-2xl tracking-tight text-[#2D2D2D]">
              Careerly
            </span>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#D4111A] translate-y-[-4px]" aria-hidden="true"></span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#5A554E] hover:text-[#2D2D2D] transition-colors focus-visible:ring-2 focus-visible:ring-[#F46200] rounded-md px-2 py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions: Log In & Primary CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#login"
              className="px-4 py-2 text-sm font-semibold text-[#5A554E] hover:text-[#2D2D2D] hover:bg-[#EFECE6]/60 rounded-full transition-colors"
            >
              Log in
            </a>
            <a
              href="#signup"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[#F46200] hover:bg-[#DC5800] active:scale-[0.98] transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F46200]"
            >
              Build my CV
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#2D2D2D] hover:bg-[#EFECE6] focus-visible:ring-2 focus-visible:ring-[#F46200]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E7E2D8] bg-[#FAF8F4] px-4 pt-4 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#2D2D2D] hover:text-[#F46200] py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href="#login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center py-2.5 rounded-full text-sm font-semibold text-[#2D2D2D] border border-[#E7E2D8] bg-white hover:bg-[#FAF8F4] transition-colors"
            >
              Log in
            </a>
            <a
              href="#signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center py-3 rounded-full text-sm font-semibold text-white bg-[#F46200] hover:bg-[#DC5800] transition-colors"
            >
              Build my CV for free
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
