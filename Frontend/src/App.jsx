import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Features from './components/Features';
import WhoItIsFor from './components/WhoItIsFor';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import Footer from './components/Footer';
import { AuthPage } from './components/ui/sign-in';
import LenisScroll from './components/lenis-scroll';

import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import Preview from './pages/Preview';
import Profile from './pages/Profile';

import api from './config/api';
import { login, setLoading } from './app/features/authSlice';

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#2D2D2D] selection:bg-[#F46200]/20 selection:text-[#F46200]">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Problem />
        <Features />
        <WhoItIsFor />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}


const toasterConfig = {
  position: 'top-center',
  toastOptions: {
    duration: 4000,
    style: {
      background: '#FFFFFF',
      color: '#2D2D2D',
      border: '1px solid #E7E2D8',
      borderRadius: '16px',
      padding: '12px 18px',
      fontSize: '14px',
      boxShadow: '0 12px 32px rgba(45, 45, 45, 0.1)',
      fontWeight: '500',
    },
    error: {
      iconTheme: {
        primary: '#D4111A',
        secondary: '#FFFFFF',
      },
      style: {
        border: '1px solid rgba(212, 17, 26, 0.25)',
      },
    },
    success: {
      iconTheme: {
        primary: '#F46200',
        secondary: '#FFFFFF',
      },
      style: {
        border: '1px solid rgba(244, 98, 0, 0.25)',
      },
    },
  },
};

export default function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentHash, setCurrentHash] = useState(() => window.location.hash);

  const getUserData = async () => {
    const token = localStorage.getItem('token');
    try {
      if (token) {
        const { data } = await api.get('/api/users/data', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        dispatch(
          login({
            token,
            user: data
          })
        );
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error.message);
      localStorage.removeItem('token');
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setCurrentHash(hash);
      if (hash === '#login' || hash === '#signin' || hash === '#signup' || hash === '#register') {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToHome = () => {
    window.location.hash = '';
    navigate('/');
  };

  // If hash points to login / signin / signup / register on the root route
  if (location.pathname === '/' && (currentHash === '#login' || currentHash === '#signin')) {
    return (
      <>
        <Toaster {...toasterConfig} />
        <AuthPage initialMode="signin" onNavigateHome={navigateToHome} />
      </>
    );
  }

  if (location.pathname === '/' && (currentHash === '#signup' || currentHash === '#register')) {
    return (
      <>
        <Toaster {...toasterConfig} />
        <AuthPage initialMode="signup" onNavigateHome={navigateToHome} />
      </>
    );
  }

  return (
    <>
      <LenisScroll />
      <Toaster {...toasterConfig} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage initialMode="signin" onNavigateHome={navigateToHome} />} />
        <Route path="/signup" element={<AuthPage initialMode="signup" onNavigateHome={navigateToHome} />} />
        <Route path="/about" element={<Footer />} />

        {/* Dashboard and CV Builder Layout */}
        <Route path="app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
          <Route path="builder" element={<ResumeBuilder />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Standalone builder routes */}
        <Route path="builder" element={<Layout />}>
          <Route index element={<ResumeBuilder />} />
          <Route path=":resumeId" element={<ResumeBuilder />} />
        </Route>

        {/* Public view for shared resume links */}
        <Route path="view/:resumeId" element={<Preview />} />
      </Routes>
    </>
  );
}
