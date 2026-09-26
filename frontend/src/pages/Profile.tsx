import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, LogOut, Shield, GraduationCap, Car, Clock,
  Building2, Mail, Phone, Calendar, Settings, ChevronRight, LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/index';

const ROLE_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  admin: { label: 'System Administrator', color: '#c084fc', icon: <Settings size={16} /> },
  proctor: { label: "Proctor's Office", color: '#f87171', icon: <Shield size={16} /> },
  security: { label: 'Campus Security', color: '#fb923c', icon: <Shield size={16} /> },
  faculty: { label: 'Faculty Member', color: '#4ade80', icon: <GraduationCap size={16} /> },
  student: { label: 'Student', color: '#22d3ee', icon: <GraduationCap size={16} /> },
};

export default function Profile() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen">
        <PageHeader title="User Profile" subtitle="Manage your account and vehicle registrations." />
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="card p-10 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'var(--accent-soft)', border: '1px solid var(--border-soft)' }}>
              <User size={28} style={{ color: 'var(--accent)' }} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
              Not Signed In
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Sign in with your AUST institutional credentials to view your profile, manage vehicles, and access personalized features.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #0891b2)', color: 'white' }}>
              <LogIn size={16} /> Sign In to AUST-IPMS
            </button>
          </div>
        </div>
      </div>
    );
  }

  const roleConfig = ROLE_CONFIG[user.role] || ROLE_CONFIG.student;

  return (
    <div className="min-h-screen">
      <PageHeader
        title="User Profile"
        subtitle="Manage your account details, vehicle registrations, and system preferences."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 space-y-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="card p-6">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-2xl"
              style={{ background: `${roleConfig.color}15`, color: roleConfig.color, border: `2px solid ${roleConfig.color}30` }}>
              {user.name.split(' ').slice(-1)[0]?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                  {user.name}
                </h2>
                <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{ background: `${roleConfig.color}15`, color: roleConfig.color, border: `1px solid ${roleConfig.color}30` }}>
                  {roleConfig.icon} {roleConfig.label}
                </span>
              </div>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{user.department}</p>
            </div>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all flex-shrink-0"
              style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </motion.div>

        {/* Account Details Grid */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 gap-4">
          {[
            { icon: <Mail size={14} />, label: 'Institutional Email', value: user.email },
            { icon: <Building2 size={14} />, label: 'Department', value: user.department },
            ...(user.employeeId ? [{ icon: <Settings size={14} />, label: 'Employee ID', value: user.employeeId }] : []),
            ...(user.studentId ? [{ icon: <GraduationCap size={14} />, label: 'Student ID', value: user.studentId }] : []),
            ...(user.phone ? [{ icon: <Phone size={14} />, label: 'Contact', value: user.phone }] : []),
            ...(user.joinedDate ? [{ icon: <Calendar size={14} />, label: 'Member Since', value: new Date(user.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }] : []),
            { icon: <Clock size={14} />, label: 'Last Login', value: user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Just now' },
            { icon: <Shield size={14} />, label: 'Access Level', value: user.role.charAt(0).toUpperCase() + user.role.slice(1) },
          ].map(item => (
            <div key={item.label} className="card p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                {item.icon}
              </div>
              <div>
                <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Quick Actions</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: 'Admin Control Panel', desc: 'Manage zones, cameras, and system settings', path: '/admin', color: '#c084fc', icon: <Settings size={16} />, show: user.role === 'admin' },
              { label: 'Live Parking Status', desc: 'View real-time slot availability across B1 & B2', path: '/parking-status', color: '#22d3ee', icon: <Car size={16} />, show: true },
              { label: 'Analytics Dashboard', desc: 'Occupancy rates, peak hours, and trends', path: '/analytics', color: '#4ade80', icon: <ChevronRight size={16} />, show: true },
              { label: 'Notifications', desc: 'Campus alerts and parking announcements', path: '/notifications', color: '#fbbf24', icon: <ChevronRight size={16} />, show: true },
            ].filter(a => a.show).map(action => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="card p-4 text-left flex items-start gap-3 transition-all hover:scale-[1.01] cursor-pointer"
                style={{ background: 'var(--bg-surface)' }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${action.color}15`, color: action.color }}>
                  {action.icon}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{action.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{action.desc}</p>
                </div>
                <ChevronRight size={14} className="mt-1 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Vehicle Registrations (placeholder, ready for Phase 3) */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Registered Vehicles</h3>
          <div className="card p-5" style={{ border: '1px dashed var(--border-soft)' }}>
            <div className="flex items-center gap-3 mb-2">
              <Car size={16} style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Vehicle Registration</p>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(192,132,252,0.1)', color: '#c084fc' }}>Phase 3</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Vehicle registration and parking history will be available in Phase 3 once LPR hardware is installed.
              Your vehicles will be automatically linked to your AUST ID.
            </p>
          </div>
        </motion.div>

        {/* Governance note */}
        <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(34,211,238,0.04)', border: '1px solid rgba(34,211,238,0.12)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Account governed by AUST ICT Policy · Digital Security Act 2018 · Office of the Proctor
          </p>
        </div>
      </div>
    </div>
  );
}
