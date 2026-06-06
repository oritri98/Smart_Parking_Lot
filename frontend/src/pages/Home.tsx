import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Eye, Brain, Camera, Map, Cpu, Activity,
  Car, Scan, GitBranch, ChevronRight, Clock, Calendar,
  TrendingUp, ParkingCircle, BarChart3
} from 'lucide-react';
import { dashboardStats } from '../data/mockData';

const features = [
  { icon: <Map size={22} />, title: 'Smart Basement Monitoring', desc: 'Real-time slot monitoring across Basement 1 & 2 with zone-specific availability tracking.' },
  { icon: <Activity size={22} />, title: 'Zone-Specific Analytics', desc: 'Dedicated analytics for Student, Faculty, and Guest zones with historical trends.' },
  { icon: <Brain size={22} />, title: 'AI Occupancy Prediction', desc: 'ML models calibrated against the AUST academic calendar for intelligent demand forecasting.', isComingSoon: true },
  { icon: <Camera size={22} />, title: 'Camera Integration', desc: 'Computer vision infrastructure for real-time basement surveillance and vehicle detection.', isComingSoon: true },
  { icon: <Scan size={22} />, title: 'License Plate Recognition', desc: 'Automated LPR/ANPR system for vehicle identification and zone access management.', isComingSoon: true },
  { icon: <Cpu size={22} />, title: 'Intelligent Campus Mobility', desc: 'University-wide mobility intelligence integrating parking, transport pool, and campus event data.', isComingSoon: true },
];

const steps = [
  { icon: <Car size={22} />, step: '01', title: 'Vehicle Entry', desc: 'Vehicle approaches the basement entry gate. Entry is logged via gate sensor or LPR camera.' },
  { icon: <Scan size={22} />, step: '02', title: 'Detection & Monitoring', desc: 'Slot sensors and cameras detect occupancy in real-time across B1 and B2.' },
  { icon: <GitBranch size={22} />, step: '03', title: 'Zone Allocation', desc: 'System allocates to Student (B1), Faculty (B2), or Guest & Visitor (B2) zones.' },
  { icon: <TrendingUp size={22} />, step: '04', title: 'Analytics & AI Prediction', desc: 'Occupancy data feeds the analytics engine. ML predicts future demand from the academic calendar.' },
];

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden" style={{ paddingTop: '4.5rem', background: 'linear-gradient(160deg, var(--bg-base) 0%, var(--bg-elevated) 50%, var(--bg-base) 100%)' }}>

        {/* Animated background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute animate-orb-drift" style={{ top: '5%', left: '3%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, var(--orb-1), transparent 68%)', filter: 'blur(50px)' }} />
          <div className="absolute animate-float-slow" style={{ bottom: '8%', right: '4%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, var(--orb-2), transparent 68%)', filter: 'blur(45px)' }} />
          <div className="absolute animate-float-med" style={{ top: '45%', left: '52%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, var(--orb-3), transparent 68%)', filter: 'blur(60px)' }} />
          <div className="absolute animate-float-slow" style={{ top: '18%', right: '22%', width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.09), transparent 68%)', filter: 'blur(30px)' }} />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* ── LEFT CONTENT ── */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
                style={{ background: 'var(--accent-soft)', border: '1px solid var(--border-hover)', color: 'var(--accent)' }}>
                <ParkingCircle size={14} />
                AUST Intelligent Parking Management System
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6"
                style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                Intelligent{' '}
                <span className="gradient-text">Parking</span>.<br />
                Smarter Campus{' '}
                <span style={{ color: 'var(--accent)' }}>Mobility</span>.
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg leading-relaxed mb-8 max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                Monitor parking availability across <strong style={{ color: 'var(--text-primary)' }}>Basement 1</strong> and{' '}
                <strong style={{ color: 'var(--text-primary)' }}>Basement 2</strong> of the AUST campus — real-time, AI-ready, and always-on.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-3 mb-10">
                <Link to="/parking-status" className="btn-primary" id="hero-parking-status-btn">
                  <Eye size={17} /> View Parking Status
                </Link>
                <Link to="/analytics" className="btn-secondary" id="hero-analytics-btn">
                  <BarChart3 size={17} /> Analytics <ArrowRight size={15} />
                </Link>
              </motion.div>

              {/* Quick stats row */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.45 }}
                className="flex flex-wrap gap-3">
                {[
                  { icon: <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" style={{ boxShadow: '0 0 8px #4ade80' }} />, label: `${dashboardStats.availableSlots} Available Now`, color: '#4ade80' },
                  { icon: <Clock size={14} />, label: 'Peak: 9:30–11:00 AM', color: 'var(--accent)' },
                  { icon: <Calendar size={14} />, label: 'Sun–Thu Operating', color: '#60a5fa' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', color: 'var(--text-secondary)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    <span style={{ color: s.color }} className="flex items-center">{s.icon}</span>
                    <span>{s.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── RIGHT — GLASS DASHBOARD CARD ── */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="relative animate-float">
              <div className="relative">
                {/* Glow backdrop */}
                <div className="absolute inset-0 rounded-3xl blur-3xl opacity-25"
                  style={{ background: 'linear-gradient(135deg, var(--accent), #60a5fa)', transform: 'scale(0.92) translateY(8%)' }} />

                {/* Glass panel */}
                <div className="glass-hero p-6 relative z-10">
                  {/* Header row */}
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)' }}>Live Dashboard</p>
                      <p className="font-bold text-base" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>AUST Campus Parking</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                      style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-green-400 text-xs font-semibold">Live</span>
                    </div>
                  </div>

                  {/* Zone bars */}
                  {[
                    { label: 'B1 — Student', pct: 84, color: '#fb923c', slots: '22/140 free' },
                    { label: 'B2 — Faculty', pct: 66, color: '#4ade80', slots: '17/50 free' },
                    { label: 'B2 — Guest',   pct: 70, color: '#60a5fa', slots: '9/30 free' },
                  ].map((z) => (
                    <div key={z.label} className="mb-4">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{z.label}</span>
                        <span className="text-xs font-semibold" style={{ color: z.color }}>{z.slots}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--stats-bar-bg)' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${z.pct}%` }}
                          transition={{ duration: 1.3, delay: 0.7, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${z.color}60, ${z.color})`,
                            boxShadow: `0 0 10px ${z.color}aa`,
                          }} />
                      </div>
                    </div>
                  ))}

                  {/* Bottom stats */}
                  <div className="grid grid-cols-3 gap-3 mt-5 pt-4" style={{ borderTop: '1px solid var(--border-soft)' }}>
                    {[
                      { label: 'Total', value: '220', color: 'var(--accent)' },
                      { label: 'Occupied', value: '172', color: '#f87171' },
                      { label: 'Free', value: '48', color: '#4ade80' },
                    ].map((s) => (
                      <div key={s.label} className="text-center">
                        <p className="font-black text-xl" style={{ color: s.color, fontFamily: 'Outfit, sans-serif' }}>{s.value}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real-Time Badge — premium decorated */}
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.9, type: 'spring', stiffness: 200 }}
                  className="absolute -top-5 -right-4 z-20 rounded-2xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(8,145,178,0.18), rgba(34,211,238,0.10))',
                    border: '1px solid rgba(34,211,238,0.40)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 0 20px rgba(34,211,238,0.20), 0 4px 16px rgba(0,0,0,0.3)',
                  }}
                >
                  <div className="px-3.5 py-2.5 flex items-center gap-2.5">
                    {/* Animated signal dot */}
                    <div className="relative flex-shrink-0">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 block animate-pulse" />
                      <span className="absolute inset-0 w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-60" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black tracking-wide" style={{ color: 'var(--accent)', fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>REAL-TIME</span>
                      <span className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--text-muted)', lineHeight: 1 }}>Live Data Feed</span>
                    </div>
                    {/* Signal bars */}
                    <div className="flex items-end gap-0.5 ml-1">
                      {[3, 5, 7, 9].map((h, i) => (
                        <div key={i} className="w-1 rounded-sm"
                          style={{ height: h, background: i < 3 ? 'var(--accent)' : 'rgba(34,211,238,0.25)' }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ─────────────────────────────────────── */}
      <section className="py-10 relative overflow-hidden" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-soft)', borderBottom: '1px solid var(--border-soft)' }}>
        <div className="absolute inset-0 dot-pattern opacity-25 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="text-center text-xs uppercase tracking-widest mb-6" style={{ color: 'var(--text-muted)' }}>AUST Campus Parking — At a Glance</p>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { val: '220', label: 'Total Slots', sub: 'B1 + B2' },
              { val: '140', label: 'Student Slots', sub: 'Basement 1' },
              { val: '80', label: 'Staff Slots', sub: 'Basement 2' },
              { val: '48', label: 'Available', sub: 'Right Now' },
              { val: '5', label: 'Work Days', sub: 'Sun – Thu' },
              { val: '9:30', label: 'Peak Hour', sub: 'AM Start' },
            ].map((s, idx) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="card text-center py-4 px-2"
              >
                <p className="text-xl sm:text-2xl font-black mb-0.5 num-shimmer" style={{ fontFamily: 'Outfit, sans-serif' }}>{s.val}</p>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{s.label}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--border-soft)' }}>
              Platform Capabilities
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
              Everything You Need for Smart Parking
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Built specifically for AUST's two-basement campus parking structure with future AI integration.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="card p-6 relative overflow-hidden">
                {f.isComingSoon && (
                  <span className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: 'rgba(192,132,252,0.12)', color: '#c084fc', border: '1px solid rgba(192,132,252,0.3)' }}>
                    Coming Soon
                  </span>
                )}
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                  {f.icon}
                </div>
                <h3 className="font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-elevated)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3"
              style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>How It Works</h2>
            <p style={{ color: 'var(--text-secondary)' }}>From vehicle entry to intelligent analytics — the complete workflow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative">
                <div className="card p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                      style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                      {s.icon}
                    </div>
                    <span className="text-4xl font-black opacity-10" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                      {s.step}
                    </span>
                  </div>
                  <h3 className="font-bold mb-2" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 z-10">
                    <ChevronRight size={20} style={{ color: 'var(--accent)', opacity: 0.4 }} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="glass-hero p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                <ParkingCircle size={28} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3"
                style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                Ready to Explore the Dashboard?
              </h2>
              <p className="mb-8 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Monitor AUST's basement parking in real-time. View occupancy analytics, zone status, and plan for smarter campus mobility.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/parking-status" className="btn-primary" id="cta-parking-btn">
                  <Eye size={17} /> View Live Parking
                </Link>
                <Link to="/about" className="btn-secondary" id="cta-about-btn">
                  About AUST-IPMS <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
