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
  

  // Allow access to CV Builder and Interview Preparation without requiring login
  const isBuilderRoute = location.pathname.includes('/builder');
  const isInterviewRoute = location.pathname.includes('/interview');

  if (user || isBuilderRoute || isInterviewRoute) {
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
