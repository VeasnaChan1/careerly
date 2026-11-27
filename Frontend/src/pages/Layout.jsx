import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavbarDashboard from '../components/Navbar-Dashboard';
import { useSelector } from 'react-redux';
import { Loader } from '../components/Loader';
import { Login } from './Login.jsx';

const Layout = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }
  

  // Allow access to CV Builder, Interview Preparation, and Job Finder without requiring login
  const isBuilderRoute = location.pathname.includes('/builder');
  const isInterviewRoute = location.pathname.includes('/interview');
  const isJobsRoute = location.pathname.includes('/jobs');

  if (user || isBuilderRoute || isInterviewRoute || isJobsRoute) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavbarDashboard />
        <Outlet />
      </div>
    );
  }

  return <Login />;
};

export default Layout;
