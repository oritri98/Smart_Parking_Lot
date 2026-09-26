import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Users, Briefcase, LogIn, Eye, EyeOff,
  Lock, Mail, AlertCircle, Clock, ParkingCircle, Camera,
  BarChart3, Bell, Cpu, ChevronRight, Building2
} from 'lucide-react';
import Logo from '../components/Logo';

type LoginTab = 'student' | 'faculty' | 'staff';

const TAB_CONFIG = {
  student: {
    label: 'Student',
    icon: <GraduationCap size={16} />,
    color: '#22d3ee',
    placeholder: 'e.g. 20020001@student.aust.edu',
    idLabel: 'Student ID / Institutional Email',
    description: 'Login with your AUST Student ID or assigned institutional email address.',
    statusLabel: 'Student Portal',
    comingSoon: true,
  },
  faculty: {
    label: 'Faculty',
    icon: <Users size={16} />,
    color: '#4ade80',
    placeholder: 'e.g. your.name@aust.edu',
    idLabel: 'Employee ID / Institutional Email',
    description: 'Login with your faculty or staff employee ID and institutional email.',
    statusLabel: 'Faculty Portal',
    comingSoon: true,
  },
  staff: {
    label: 'Staff & Security',
    icon: <Briefcase size={16} />,
    color: '#fb923c',
    placeholder: 'e.g. sec.officer@aust.edu',
    idLabel: 'Staff Email',
    description: 'For security personnel, administrative staff, and support services.',
    statusLabel: 'Staff Portal',
    comingSoon: true,
  },
};

const UPCOMING_FEATURES = [
  { icon: <ParkingCircle size={14} />, label: 'Real-Time Slot Availability', color: '#22d3ee' },
  { icon: <Camera size={14} />, label: 'Camera Feed Monitoring', color: '#4ade80' },
  { icon: <BarChart3 size={14} />, label: 'Personal Parking History', color: '#c084fc' },
  { icon: <Bell size={14} />, label: 'Push Notifications', color: '#fbbf24' },
  { icon: <Cpu size={14} />, label: 'ML-Based Predictions', color: '#fb923c' },
  { icon: <Building2 size={14} />, label: 'Vehicle Registration', color: '#60a5fa' },
];

export default function Login() {
  const [activeTab, setActiveTab] = useState<LoginTab>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const cfg = TAB_CONFIG[activeTab];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // All public logins are coming soon — no action
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 pb-12 px-4">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.5), transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.4), transparent)' }} />
      </div>

      <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center">

        {/* ── LEFT — Branding & Info ── */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          className="hidden lg:block">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(145deg, #0c1e3a, #0d3554)', border: '1.5px solid rgba(34,211,238,0.4)', boxShadow: '0 0 30px rgba(34,211,238,0.2)' }}>
              <Logo size="32" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>AUST-IPMS</h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Intelligent Parking Management System</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-3 leading-tight" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
            Campus Parking<br />
            <span style={{ color: 'var(--accent)' }}>Made Smarter</span>
          </h2>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Your personalized parking experience at <strong style={{ color: 'var(--text-primary)' }}>Ahsanullah University of Science and Technology</strong>.
            Check slot availability, get notified, and manage your registered vehicle — all in one place.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {UPCOMING_FEATURES.map((f) => (
              <div key={f.label} className="flex items-center gap-2.5 p-3 rounded-xl"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${f.color}12`, color: f.color }}>{f.icon}</div>
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{f.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl"
            style={{ background: 'rgba(34,211,238,0.05)', border: '1px solid rgba(34,211,238,0.15)' }}>
            <Clock size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              <strong style={{ color: 'var(--text-secondary)' }}>AUST-IPMS</strong> is open <strong style={{ color: 'var(--accent)' }}>7 days a week, 7:30 AM – 9:00 PM</strong>, supporting all university events and activities.
            </p>
          </div>
        </motion.div>

        {/* ── RIGHT — Login Form ── */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <div className="rounded-3xl p-8"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)', boxShadow: 'var(--card-shadow)' }}>

            {/* Header */}
            <div className="text-center mb-7">
              <div className="lg:hidden flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(145deg, #0c1e3a, #0d3554)', border: '1.5px solid rgba(34,211,238,0.4)' }}>
                  <Logo size="22" />
                </div>
                <span className="font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>AUST-IPMS</span>
              </div>
              <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                Welcome Back
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Sign in to your AUST-IPMS account
              </p>
            </div>

            {/* Role Tabs */}
            <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'var(--bg-elevated)' }}>
              {(Object.entries(TAB_CONFIG) as [LoginTab, typeof TAB_CONFIG.student][]).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => { setActiveTab(key); setEmail(''); setPassword(''); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={activeTab === key
                    ? { background: 'var(--bg-surface)', color: val.color, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }
                    : { color: 'var(--text-muted)' }}
                >
                  <span style={{ color: activeTab === key ? val.color : 'inherit' }}>{val.icon}</span>
                  <span className="hidden sm:inline">{val.label}</span>
                  <span className="sm:hidden">{val.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}>

                {/* Coming Soon Banner */}
                <div className="mb-5 p-4 rounded-xl flex items-start gap-3"
                  style={{ background: `${cfg.color}08`, border: `1px solid ${cfg.color}25` }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${cfg.color}15`, color: cfg.color }}>
                    {cfg.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: cfg.color }}>{cfg.statusLabel}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: `${cfg.color}15`, color: cfg.color }}>
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{cfg.description}</p>
                  </div>
                </div>

                {/* Form — inputs disabled, coming soon */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      {cfg.idLabel}
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                      <input
                        type="email" disabled value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder={cfg.placeholder}
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none opacity-50 cursor-not-allowed"
                        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Password
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                      <input
                        type={showPassword ? 'text' : 'password'} disabled value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••••"
                        className="w-full pl-10 pr-12 py-3 rounded-xl text-sm outline-none opacity-50 cursor-not-allowed"
                        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', color: 'var(--text-primary)' }}
                      />
                      <button type="button" onClick={() => setShowPassword(p => !p)} tabIndex={-1}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-40" style={{ color: 'var(--text-muted)' }}>
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Coming Soon submit */}
                  <button type="submit" disabled
                    className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
                    style={{ background: `linear-gradient(135deg, ${cfg.color}60, ${cfg.color}30)`, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                    <LogIn size={15} />
                    Sign In — {cfg.statusLabel} Coming Soon
                  </button>
                </form>

                {/* Info note */}
                <div className="mt-5 p-3 rounded-xl flex items-start gap-2"
                  style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)' }}>
                  <AlertCircle size={13} className="mt-0.5 flex-shrink-0" style={{ color: '#fbbf24' }} />
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    The {cfg.label} portal is currently under development. Login will be enabled after LPR hardware installation and ICT Center integration.
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Live status & features */}
            <div className="mt-6 pt-5 flex items-center justify-between" style={{ borderTop: '1px solid var(--border-soft)' }}>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-medium text-green-400">System Live</span>
              </div>
              <a href="/parking-status"
                className="flex items-center gap-1 text-xs font-semibold transition-all hover:opacity-80"
                style={{ color: 'var(--accent)' }}>
                View Live Parking <ChevronRight size={12} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
