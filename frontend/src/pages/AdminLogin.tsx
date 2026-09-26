import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, Lock, Mail, Loader2, AlertCircle,
  CheckCircle, Shield, Terminal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Secret admin login — URL not linked anywhere in the public website
// Access: navigate directly to /aust-ipms-admin
export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !password) {
      setError('Both fields are required.');
      return;
    }

    const result = await login(email.trim().toLowerCase(), password);

    if (result.success) {
      setSuccess(`Access granted. Redirecting…`);
      setTimeout(() => navigate(from, { replace: true }), 700);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 pb-12 relative overflow-hidden">
      {/* Subtle dark background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(192,132,252,0.6), transparent)' }} />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full blur-3xl opacity-8"
          style={{ background: 'radial-gradient(circle, rgba(248,113,113,0.5), transparent)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Card */}
        <div className="rounded-3xl p-8"
          style={{ background: 'var(--bg-surface)', border: '1px solid rgba(192,132,252,0.2)', boxShadow: '0 25px 60px rgba(0,0,0,0.4), 0 0 40px rgba(192,132,252,0.06)' }}>

          {/* Icon + Title */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, rgba(192,132,252,0.15), rgba(248,113,113,0.08))', border: '1px solid rgba(192,132,252,0.3)' }}>
              <Terminal size={26} style={{ color: '#c084fc' }} />
            </div>
            <h1 className="text-xl font-bold mb-1" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
              Secure Access
            </h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              AUST-IPMS Administrative Portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                Email
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="administrator@aust.edu"
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', color: 'var(--text-primary)' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(192,132,252,0.6)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(192,132,252,0.1)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-soft)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••••••"
                  autoComplete="off"
                  className="w-full pl-10 pr-11 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', color: 'var(--text-primary)' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(192,132,252,0.6)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(192,132,252,0.1)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-soft)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-80"
                  style={{ color: 'var(--text-muted)' }}>
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Error / Success */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
                  style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171' }}>
                  <AlertCircle size={13} className="flex-shrink-0" /> {error}
                </motion.div>
              )}
              {success && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
                  style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80' }}>
                  <CheckCircle size={13} className="flex-shrink-0" /> {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
              style={{
                background: loading ? 'rgba(192,132,252,0.15)' : 'linear-gradient(135deg, #7c3aed, #be185d)',
                color: loading ? '#c084fc' : 'white',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(124,58,237,0.35)',
              }}
            >
              {loading
                ? <><Loader2 size={15} className="animate-spin" /> Authenticating…</>
                : <><Shield size={15} /> Authenticate</>}
            </button>
          </form>

          {/* Security notice */}
          <p className="text-center text-[11px] mt-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Unauthorized access is strictly prohibited.<br />
            All sessions are logged and monitored.
          </p>
        </div>

        {/* Tiny AUST watermark */}
        <p className="text-center text-[10px] mt-4" style={{ color: 'rgba(255,255,255,0.15)' }}>
          AUST-IPMS · ICT Center · Office of the Proctor
        </p>
      </motion.div>
    </div>
  );
}
