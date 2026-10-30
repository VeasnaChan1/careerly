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

  // Allow access to the CV Builder without requiring login
  const isBuilderRoute = location.pathname.includes('/builder');

  if (user || isBuilderRoute) {
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
