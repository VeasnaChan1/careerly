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
import { Login } from './pages/Login';

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
      setCurrentHash(window.location.hash);
      window.scrollTo(0, 0);
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
        <Toaster />
        <AuthPage initialMode="signin" onNavigateHome={navigateToHome} />
      </>
    );
  }

  if (location.pathname === '/' && (currentHash === '#signup' || currentHash === '#register')) {
    return (
      <>
        <Toaster />
        <AuthPage initialMode="signup" onNavigateHome={navigateToHome} />
      </>
    );
  }

  return (
    <>
      <LenisScroll />
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage initialMode="signin" onNavigateHome={navigateToHome} />} />
        <Route path="/signup" element={<AuthPage initialMode="signup" onNavigateHome={navigateToHome} />} />
        <Route path="/about" element={<Footer />} />

        {/* Protected Dashboard and CV Builder Layout */}
        <Route path="app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Public view for shared resume links */}
        <Route path="view/:resumeId" element={<Preview />} />
      </Routes>
    </>
  );
}
