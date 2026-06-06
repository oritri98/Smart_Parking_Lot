import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, ParkingCircle, BarChart3, Camera, BookOpen,
  Info, Mail, LogIn, User, Bell, Settings, ChevronDown,
  Menu, X, Sun, Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface DropdownItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { label: 'Home', path: '/', icon: <Home size={16} /> },
  { label: 'Parking Status', path: '/parking-status', icon: <ParkingCircle size={16} /> },
  { label: 'Analytics', path: '/analytics', icon: <BarChart3 size={16} /> },
  { label: 'Camera', path: '/camera', icon: <Camera size={16} /> },
  { label: 'Rules', path: '/rules', icon: <BookOpen size={16} /> },
  { label: 'About', path: '/about', icon: <Info size={16} /> },
  { label: 'Contact', path: '/contact', icon: <Mail size={16} /> },
];

const dropdownItems: DropdownItem[] = [
  { label: 'Login',         path: '/login',         icon: <LogIn size={15} />,    badge: 'Coming Soon' },
  { label: 'Profile',       path: '/profile',       icon: <User size={15} />,     badge: 'Coming Soon' },
  { label: 'Notifications', path: '/notifications', icon: <Bell size={15} />,     badge: 'Coming Soon' },
  { label: 'Admin Panel',   path: '/admin',         icon: <Settings size={15} />, badge: 'Coming Soon' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'shadow-2xl backdrop-blur-xl' : ''
        }`}
        style={{
          fontFamily: 'Inter, sans-serif',
          background: scrolled ? 'var(--nav-bg)' : 'transparent',
          borderBottom: scrolled ? '1px solid var(--border-soft)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(145deg, #0c1e3a, #0d3554)',
                    border: '1.5px solid rgba(34,211,238,0.4)',
                    boxShadow: '0 0 18px rgba(34,211,238,0.18), inset 0 1px 0 rgba(255,255,255,0.07)',
                  }}>
                  <Logo size="24" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"
                  style={{ border: '1.5px solid rgba(6,13,27,0.8)' }} />
              </div>
              <div>
                <span className="font-bold text-base tracking-wide"
                  style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                  AUST-IPMS
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={isActive(item.path)
                    ? { color: 'var(--accent)', background: 'var(--accent-soft)' }
                    : { color: 'var(--text-secondary)' }
                  }
                  onMouseEnter={e => { if (!isActive(item.path)) { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; } }}
                  onMouseLeave={e => { if (!isActive(item.path)) { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; } }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              {/* Future Modules Dropdown */}
              <div className="relative ml-1">
                <button
                  id="future-modules-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <span>Modules</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-64 rounded-xl shadow-2xl overflow-hidden"
                      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)', backdropFilter: 'blur(20px)' }}
                    >
                      <div className="p-1.5 space-y-0.5">
                        {dropdownItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 group"
                            style={{ color: 'var(--text-secondary)' }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = 'var(--bg-hover)';
                              e.currentTarget.style.color = 'var(--text-primary)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = 'var(--text-secondary)';
                            }}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="transition-transform group-hover:scale-110 flex items-center" style={{ color: 'var(--text-muted)' }}>
                                {item.icon}
                              </span>
                              <span className="font-semibold transition-colors">{item.label}</span>
                            </div>
                            {item.badge && (
                              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider whitespace-nowrap"
                                style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--border-soft)' }}>
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right: Theme toggle + Live + mobile menu */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <button
                id="theme-toggle-btn"
                onClick={toggleTheme}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="theme-toggle"
                title={isDark ? 'Light mode' : 'Dark mode'}
              >
                <div className="theme-toggle-knob">
                  {isDark ? <Moon size={11} /> : <Sun size={11} />}
                </div>
              </button>

              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400 font-medium">Live</span>
              </div>

              <button
                id="mobile-menu-btn"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg transition-all"
                style={{ color: 'var(--text-secondary)' }}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-72 overflow-y-auto"
              style={{ background: 'var(--nav-bg)', borderLeft: '1px solid var(--border-soft)' }}
            >
              <div className="p-6 pt-20">
                <p className="text-xs uppercase tracking-widest mb-4 font-medium" style={{ color: 'var(--text-muted)' }}>Navigation</p>
                <div className="space-y-1">
                  {mainNavItems.map((item) => (
                    <Link key={item.path} to={item.path}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                      style={isActive(item.path)
                        ? { color: 'var(--accent)', background: 'var(--accent-soft)' }
                        : { color: 'var(--text-secondary)' }}
                    >
                      {item.icon} {item.label}
                    </Link>
                  ))}
                </div>

                <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border-soft)' }}>
                  <p className="text-xs uppercase tracking-widest mb-4 font-medium" style={{ color: 'var(--text-muted)' }}>Modules</p>
                  <div className="space-y-1">
                    {dropdownItems.map((item) => (
                      <Link key={item.path} to={item.path}
                        className="flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <div className="flex items-center gap-3">
                          <span style={{ color: 'var(--text-muted)' }} className="flex items-center">{item.icon}</span>
                          <span className="font-semibold">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider whitespace-nowrap"
                            style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--border-soft)' }}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close dropdown */}
      {dropdownOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
      )}
    </>
  );
}
