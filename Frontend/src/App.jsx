import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Features from './components/Features';
import WhoItIsFor from './components/WhoItIsFor';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import Footer from './components/Footer';
import { AuthPage } from './components/ui/sign-in';

function App() {
  const [currentHash, setCurrentHash] = useState(() => window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToHome = () => {
    window.location.hash = '';
  };

  // If hash points to login / signin
  if (currentHash === '#login' || currentHash === '#signin') {
    return <AuthPage initialMode="signin" onNavigateHome={navigateToHome} />;
  }

  // If hash points to signup / register
  if (currentHash === '#signup' || currentHash === '#register') {
    return <AuthPage initialMode="signup" onNavigateHome={navigateToHome} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#2D2D2D] selection:bg-[#F46200]/20 selection:text-[#F46200]">
      {/* 1. Navigation */}
      <Navbar />

      <main className="flex-grow">
        {/* 2. Hero with live HTML/CSS CV preview */}
        <Hero />

        {/* 3. Problem (01 Counter) */}
        <Problem />

        {/* 4. Features (02 Counter, Uneven Bento Layout) */}
        <Features />

        {/* 5. Who It Is For (03 Counter) */}
        <WhoItIsFor />

        {/* 6. Pricing (04 Counter, Free vs Premium $2.99/mo) */}
        <Pricing />

        {/* 7. Final Call to Action */}
        <CTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;

