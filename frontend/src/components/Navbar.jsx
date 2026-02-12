import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const user = localStorage.getItem('user');
  const isLoggedIn = !!user;
  let userName = '';
  try {
    const parsed = JSON.parse(user);
    userName = parsed?.name || parsed?.username || 'User';
  } catch {
    userName = 'User';
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
    // Force re-render
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path;

  const scrollToAbout = () => {
    setIsOpen(false);
    if (location.pathname === '/home' || location.pathname === '/') {
      const element = document.getElementById('about');
      if (element) {
        // Offset for sticky navbar
        const y = element.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else {
      navigate('/home');
      // Allow time for navigation to complete
      setTimeout(() => {
        const element = document.getElementById('about');
        if (element) {
          const y = element.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 300);
    }
  };

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full ${isActive(to)
        ? 'text-white bg-white/10 shadow-inner'
        : 'text-slate-300 hover:text-white hover:bg-white/5'
        }`}
    >
      {children}
      {isActive(to) && (
        <span className="absolute bottom-0 left-1/2 w-4 h-1 -translate-x-1/2 bg-primary-500 rounded-t-full shadow-[0_-2px_8px_rgba(14,165,233,0.5)]"></span>
      )}
    </Link>
  );

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300">
                D
              </div>
              <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Debatify
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/news-feed">News Feed</NavLink>
            <NavLink to="/quiz">Quiz Arena</NavLink>
            <NavLink to="/joindebate">Debate Room</NavLink>
            <button
              onClick={scrollToAbout}
              className="relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full text-slate-300 hover:text-white hover:bg-white/5"
            >
              About
            </button>

            <div className="h-6 w-px bg-slate-800 mx-4"></div>

            {isLoggedIn ? (
              <>
                <span className="text-sm text-slate-400 mr-2">
                  Hi, <span className="text-white font-medium">{userName}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 text-sm font-medium text-white bg-red-600/80 hover:bg-red-500 rounded-full transition-all border border-red-500/50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-all border border-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 rounded-full shadow-lg shadow-primary-500/25 transition-all hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white p-2 rounded-md focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 absolute w-full animate-slide-up">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/home" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Home</Link>
            <Link to="/news-feed" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">News Feed</Link>
            <Link to="/quiz" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Quiz</Link>
            <Link to="/joindebate" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Debate Room</Link>
            <button
              onClick={scrollToAbout}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
            >
              About
            </button>
            <div className="border-t border-slate-800 my-2"></div>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-white hover:bg-red-900/50"
              >
                Logout ({userName})
              </button>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Sign In</Link>
                <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium text-primary-400 hover:text-white hover:bg-primary-900/50">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
