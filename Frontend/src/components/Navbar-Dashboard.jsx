import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../app/features/authSlice';
import { User, LogIn } from 'lucide-react';

const NavbarDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isMyCVsActive = location.pathname === '/app' || location.pathname === '/app/my-cvs';
  const isInterviewPrepActive = ['/app/interview', '/app/interview-prep'].includes(location.pathname);
  const navigationLinks = [
    ...(user ? [{ to: '/app', label: 'My CVs', active: isMyCVsActive }] : []),
    { to: '/app/jobs', label: 'Jobs', active: location.pathname === '/app/jobs' },
    { to: '/app/interview-prep', label: 'Interview Prep', active: isInterviewPrepActive },
    { to: '/app/interview-guide', label: 'Interview Guide', active: location.pathname === '/app/interview-guide' },
  ];

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
    <div className="sticky top-0 z-40 border-b border-border-hairline bg-white">
      <nav aria-label="Dashboard" className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] grid-rows-[minmax(3.5rem,auto)] items-center gap-x-3 px-4 text-charcoal sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:grid-rows-[minmax(4rem,auto)] sm:px-6">
        <Link
          to="/"
          onClick={(e) => handleNavigation('/', e)}
          className="flex items-center gap-1.5 justify-self-start rounded-lg"
        >
          <span className="font-sans font-extrabold text-2xl tracking-tight text-[#2D2D2D]">
            Careerly
          </span>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#F46200] translate-y-[-4px]" aria-hidden="true"></span>
        </Link>

          {user && (
            <>
              <Link
                to="/app"
                onClick={(e) => handleNavigation('/app', e)}
                className="hidden sm:inline-flex text-xs font-semibold uppercase tracking-wider text-[#5A554E] hover:text-[#F46200] transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/app/jobs"
                onClick={(e) => handleNavigation('/app/jobs', e)}
                className="hidden sm:inline-flex text-xs font-semibold uppercase tracking-wider text-[#5A554E] hover:text-[#F46200] transition-colors"
              >
                Jobs
              </Link>
            </>
          )}
        <div className="col-span-2 row-start-2 flex items-center justify-center gap-2 pb-1 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:gap-6 sm:pb-0">
          {navigationLinks.map(({ to, label, active }) => (
            <Link
              key={to}
              to={to}
              aria-current={active ? 'page' : undefined}
              onClick={(e) => handleNavigation(to, e)}
              className={`flex min-h-11 items-center whitespace-nowrap rounded-md px-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-brand-orange motion-reduce:transition-none ${
                active
                  ? 'text-charcoal underline decoration-brand-orange decoration-2 underline-offset-8'
                  : 'text-ink-muted hover:text-charcoal'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="col-start-2 row-start-1 flex items-center gap-3 justify-self-end text-sm sm:col-start-3 sm:gap-4">
          {user ? (
            <>
              <Link
                to="/app/profile"
                aria-label="My profile"
                onClick={(e) => handleNavigation('/app/profile', e)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <p className="hidden max-w-40 truncate font-medium text-charcoal lg:block">Hi, {user?.name || user?.email?.split('@')[0] || 'User'}</p>
                <div className="rounded-full p-1.5 border border-[#E7E2D8] bg-[#FAF8F4]">
                  <User className="size-4 text-[#5A554E]" />
                </div>
              </Link>
              <button
                onClick={logoutUser}
                className="bg-white hover:bg-rose-50 border border-[#E7E2D8] hover:border-rose-200 text-[#5A554E] hover:text-rose-600 px-4 sm:px-6 py-1.5 rounded-full text-xs font-semibold active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs text-[#8A847C]">Free Guest Mode</span>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-[#F46200] bg-white border border-[#F46200] hover:bg-[#F46200] hover:text-white transition-all shadow-xs active:scale-95"
              >
                <LogIn className="size-3.5" />
                <span>Log in</span>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavbarDashboard;
