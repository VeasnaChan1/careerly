import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      // Section IDs on page in order of appearance
      const sections = [
        { id: 'how-it-works', linkId: 'how-it-works' },
        { id: 'features', linkId: 'features' },
        { id: 'pricing', linkId: 'pricing' },
      ];

      // If at top hero area, reset active section
      if (scrollY < 120) {
        setActiveSection('');
        return;
      }

      // Find the last section whose top has scrolled into the upper viewport
      let current = '';
      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 240) {
            current = sec.linkId;
          }
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '/#features', id: 'features' },
    { label: 'How it works', href: '/#how-it-works', id: 'how-it-works' },
    { label: 'Pricing', href: '/#pricing', id: 'pricing' },
  ];

  const handleNavClick = (e, targetId) => {
    if (window.location.pathname === '/' || window.location.pathname === '') {
      const el = document.getElementById(targetId);
      if (el) {
        e.preventDefault();
        setMobileMenuOpen(false);
        const headerOffset = 85;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        window.history.pushState(null, '', `#${targetId}`);
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'py-2.5 sm:py-3.5 px-3 sm:px-6 lg:px-8 bg-transparent pointer-events-none'
          : 'py-0 px-0 bg-[#FAF8F4]/90 backdrop-blur-md border-b border-[#E7E2D8] pointer-events-auto'
      }`}
    >
      <div
        className={`mx-auto transition-all duration-300 ease-in-out ${
          isScrolled
            ? 'pointer-events-auto max-w-5xl bg-white/92 backdrop-blur-xl border border-[#E7E2D8]/90 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.07),0_2px_8px_rgb(0,0,0,0.04)] ring-1 ring-black/[0.03] px-4 sm:px-6 lg:px-8 hover:shadow-[0_14px_36px_rgb(0,0,0,0.11),0_4px_12px_rgb(0,0,0,0.05)] hover:border-[#F46200]/30 hover:bg-white/98 hover:-translate-y-0.5'
            : 'max-w-7xl px-4 sm:px-6 lg:px-8'
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled ? 'h-14 sm:h-16' : 'h-20'
          }`}
        >
          {/* Logo / Brand */}
          <Link
            to="/"
            className="flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#F46200] rounded-lg px-1 py-0.5 group"
            aria-label="Careerly Homepage"
          >
            <span
              className={`font-sans font-extrabold tracking-tight text-[#2D2D2D] group-hover:text-[#F46200] transition-colors duration-200 ${
                isScrolled ? 'text-xl sm:text-2xl' : 'text-2xl'
              }`}
            >
              Careerly
            </span>
            <span
              className={`inline-block rounded-full bg-[#D4111A] group-hover:scale-125 transition-all duration-200 ${
                isScrolled
                  ? 'w-2 h-2 translate-y-[-3px]'
                  : 'w-2.5 h-2.5 translate-y-[-4px]'
              }`}
              aria-hidden="true"
            ></span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-1.5 lg:gap-2" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`relative font-medium rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#F46200] ${
                    isScrolled ? 'text-xs sm:text-sm px-3.5 py-1.5' : 'text-sm px-3.5 py-2'
                  } ${
                    isActive
                      ? 'text-[#F46200] font-semibold bg-[#FFF3EB] shadow-xs ring-1 ring-[#F46200]/25'
                      : 'text-[#5A554E] hover:text-[#F46200] hover:bg-black/[0.04] active:bg-black/[0.07]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full bg-[#F46200] ml-1.5 align-middle"
                      aria-hidden="true"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Actions: Log In & Primary CTA */}
          <div className="hidden md:flex items-center gap-2.5">
            {user ? (
              <Link
                to="/app"
                className={`inline-flex items-center justify-center gap-1.5 rounded-full font-semibold text-white bg-[#F46200] hover:bg-[#DC5800] active:scale-[0.98] transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F46200] ${
                  isScrolled ? 'px-4 py-2 text-xs sm:text-sm' : 'px-5 py-2.5 text-sm'
                }`}
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`font-semibold rounded-full transition-all shadow-xs active:scale-[0.98] ${
                    isScrolled ? 'px-4 py-1.5 sm:py-2 text-xs sm:text-sm' : 'px-5 py-2 text-sm'
                  } text-[#F46200] bg-white border border-[#F46200] hover:bg-[#F46200] hover:text-white`}
                >
                  Log in
                </Link>
                <Link
                  to="/app/builder/guest"
                  className={`inline-flex items-center justify-center gap-1.5 rounded-full font-semibold text-white bg-[#F46200] hover:bg-[#DC5800] active:scale-[0.98] transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F46200] ${
                    isScrolled ? 'px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm' : 'px-5 py-2.5 text-sm'
                  }`}
                >
                  Build my CV
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#2D2D2D] hover:bg-black/[0.05] focus-visible:ring-2 focus-visible:ring-[#F46200] transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div
          className={`pointer-events-auto md:hidden transition-all duration-200 ${
            isScrolled
              ? 'max-w-5xl mx-auto mt-2 bg-white/95 backdrop-blur-xl border border-[#E7E2D8] rounded-2xl shadow-xl p-5 space-y-4'
              : 'border-t border-[#E7E2D8] bg-[#FAF8F4] px-4 pt-4 pb-6 space-y-4'
          }`}
        >
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`text-base font-medium px-3.5 py-2.5 rounded-xl transition-colors flex items-center justify-between ${
                    isActive
                      ? 'text-[#F46200] font-semibold bg-[#FFF3EB] border border-[#F46200]/20'
                      : 'text-[#2D2D2D] hover:text-[#F46200] hover:bg-black/[0.03]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#F46200]"></span>}
                </a>
              );
            })}
          </nav>
          <div className="pt-2 flex flex-col gap-2.5 border-t border-[#E7E2D8]/60">
            {user ? (
              <Link
                to="/app"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center py-2.5 rounded-full text-sm font-semibold text-white bg-[#F46200] hover:bg-[#DC5800] transition-colors shadow-xs"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center py-2.5 rounded-full text-sm font-semibold text-[#F46200] border border-[#F46200] bg-white hover:bg-[#F46200] hover:text-white transition-all shadow-xs"
                >
                  Log in
                </Link>
                <Link
                  to="/app/builder/guest"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center py-2.5 rounded-full text-sm font-semibold text-white bg-[#F46200] hover:bg-[#DC5800] transition-colors shadow-xs"
                >
                  Build my CV
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
