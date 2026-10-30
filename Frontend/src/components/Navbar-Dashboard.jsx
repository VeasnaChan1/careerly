import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../app/features/authSlice';
import { User, LogOut, ArrowLeft } from 'lucide-react';

const NavbarDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNavigation = (to, e) => {
    if (window.resumeBuilderDirty) {
      if (e) e.preventDefault();
      window.dispatchEvent(
        new CustomEvent('show-leave-builder-confirm', { detail: { targetUrl: to } })
      );
      return;
    }
    navigate(to);
  };

  const logoutUser = () => {
    if (window.resumeBuilderDirty) {
      window.dispatchEvent(
        new CustomEvent('show-leave-builder-confirm', { detail: { targetUrl: '/logout' } })
      );
      return;
    }
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className='bg-white border-b border-[#E7E2D8] shadow-xs sticky top-0 z-40'>
      <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-[#2D2D2D] transition-all'>
        <div className="flex items-center gap-6">
          <Link to='/' onClick={(e) => handleNavigation('/', e)} className="flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#F46200] rounded-lg">
            <span className="font-sans font-extrabold text-2xl tracking-tight text-[#2D2D2D]">
              Careerly
            </span>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#F46200] translate-y-[-4px]" aria-hidden="true"></span>
          </Link>

          <Link
            to="/app"
            onClick={(e) => handleNavigation('/app', e)}
            className="hidden sm:inline-flex text-xs font-semibold uppercase tracking-wider text-[#5A554E] hover:text-[#F46200] transition-colors"
          >
            Dashboard
          </Link>
        </div>

        <div className='flex items-center gap-3 sm:gap-4 text-sm'>
          <Link to="/app/profile" onClick={(e) => handleNavigation('/app/profile', e)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <p className="font-medium text-[#2D2D2D]">Hi, {user?.name || user?.email?.split('@')[0] || 'User'}</p>
            <div className='rounded-full p-1.5 border border-[#E7E2D8] bg-[#FAF8F4]'>
              <User className='size-4 text-[#5A554E]' />
            </div>
          </Link>
          <button
            onClick={logoutUser}
            className='bg-white hover:bg-rose-50 border border-[#E7E2D8] hover:border-rose-200 text-[#5A554E] hover:text-rose-600 px-4 sm:px-6 py-1.5 rounded-full text-xs font-semibold active:scale-95 transition-all cursor-pointer flex items-center gap-1.5'
          >
            <LogOut className="size-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default NavbarDashboard;
