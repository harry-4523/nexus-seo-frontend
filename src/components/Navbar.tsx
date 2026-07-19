import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Zap, History, LogIn, LogOut, User, Menu, X } from 'lucide-react';
import { useAnalysisStore } from '../store/analysis.store';

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAnalysisStore();

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.1 }
    );
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const links = [
    { label: 'Analyze', path: '/analyze', icon: <Zap size={15} /> },
    { label: 'History', path: '/history', icon: <History size={15} /> },
  ];

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cosmos/90 backdrop-blur-xl border-b border-border shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-lg bg-ink flex items-center justify-center group-hover:bg-violet transition-colors duration-300">
            <svg viewBox="0 0 32 32" className="w-[18px] h-[18px]" fill="none">
              <path d="M8 24L16 8L24 24" stroke="#F7F7F4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.5 19h11" stroke="#F7F7F4" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="16" cy="8" r="2" fill="#3F98A3"/>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight font-display">
            <span className="text-ink">NEX</span>
            <span className="text-violet">US</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ label, path, icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === path
                  ? 'text-ink bg-violet/10 border border-violet/25'
                  : 'text-ink-soft hover:text-ink hover:bg-ink/[0.04]'
              }`}
            >
              {icon}{label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet/8 border border-violet/20">
                <div className="w-6 h-6 rounded-full bg-violet flex items-center justify-center">
                  <User size={12} className="text-[#F7F7F4]" />
                </div>
                <span className="text-sm text-violet font-medium">
                  {user.name || user.email.split('@')[0]}
                </span>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-ink-soft hover:text-ink hover:bg-ink/[0.04] transition-all">
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/auth" className="flex items-center gap-1.5 btn-primary text-sm py-2 px-4">
              <LogIn size={14} /> Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-ink-soft hover:text-ink" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-border px-6 py-4 space-y-2">
          {links.map(({ label, path, icon }) => (
            <Link key={path} to={path} onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-ink-soft hover:text-ink hover:bg-violet/8 transition-all">
              {icon}{label}
            </Link>
          ))}
          {!user && (
            <Link to="/auth" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-violet hover:bg-violet/8 transition-all">
              <LogIn size={15} /> Sign In
            </Link>
          )}
          {user && (
            <button onClick={() => { handleLogout(); setMenuOpen(false); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-nova hover:bg-nova/10 transition-all w-full text-left">
              <LogOut size={15} /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
