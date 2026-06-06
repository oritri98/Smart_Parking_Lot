import { motion } from 'framer-motion';

interface SimulatedBadgeProps { size?: 'sm' | 'md'; className?: string; }
export function SimulatedBadge({ size = 'sm', className = '' }: SimulatedBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-full ${className} ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'}`}
      style={{ background: 'rgba(192,132,252,0.12)', color: '#c084fc', border: '1px solid rgba(192,132,252,0.3)' }}>
      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
      Simulated
    </span>
  );
}

interface StatusBadgeProps { status: 'Available' | 'Limited' | 'Full' | 'Offline' | 'Online' | 'Pending'; className?: string; }
export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    Available: { bg: 'rgba(74,222,128,0.1)', color: '#4ade80', border: 'rgba(74,222,128,0.3)' },
    Limited:   { bg: 'rgba(251,146,60,0.1)',  color: '#fb923c', border: 'rgba(251,146,60,0.3)' },
    Full:      { bg: 'rgba(248,113,113,0.1)', color: '#f87171', border: 'rgba(248,113,113,0.3)' },
    Offline:   { bg: 'rgba(100,116,139,0.1)', color: '#94a3b8', border: 'rgba(100,116,139,0.3)' },
    Online:    { bg: 'rgba(74,222,128,0.1)',  color: '#4ade80', border: 'rgba(74,222,128,0.3)' },
    Pending:   { bg: 'rgba(251,191,36,0.1)',  color: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
  };
  const s = styles[status] ?? styles.Offline;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${className}`}
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
      {status}
    </span>
  );
}

export function CardBgPattern({ label, color }: { label: string; color: string }) {
  const lbl = label.toLowerCase();
  if (lbl.includes('total vehicles')) {
    return (
      <svg className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-[0.08]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="0" r="80" stroke={color} strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="100" cy="0" r="60" stroke={color} strokeWidth="1.5" />
        <circle cx="100" cy="0" r="40" stroke={color} strokeWidth="2" strokeDasharray="8 4" />
        <line x1="20" y1="0" x2="100" y2="80" stroke={color} strokeWidth="1" />
        <line x1="50" y1="0" x2="100" y2="50" stroke={color} strokeWidth="1" />
      </svg>
    );
  } else if (lbl.includes('occupancy') || lbl.includes('utilization')) {
    return (
      <svg className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-[0.08]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="0" r="90" stroke={color} strokeWidth="1" />
        <circle cx="100" cy="0" r="70" stroke={color} strokeWidth="1.2" />
        <circle cx="100" cy="0" r="50" stroke={color} strokeWidth="1.5" />
        <circle cx="100" cy="0" r="30" stroke={color} strokeWidth="2.2" />
        <path d="M10 80C30 80 40 20 60 20C80 20 90 60 100 60" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="2 2" />
      </svg>
    );
  } else if (lbl.includes('peak hour')) {
    return (
      <svg className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-[0.09]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="0" r="80" stroke={color} strokeWidth="1.2" />
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const x1 = 100 - Math.cos(angle) * 25;
          const y1 = 0 + Math.sin(angle) * 25;
          const x2 = 100 - Math.cos(angle) * 75;
          const y2 = 0 + Math.sin(angle) * 75;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={i % 2 === 0 ? "1.8" : "1"} />;
        })}
      </svg>
    );
  } else if (lbl.includes('predicted') || lbl.includes('demand')) {
    return (
      <svg className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-[0.08]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="75" cy="25" r="3" fill={color} />
        <circle cx="55" cy="55" r="4.5" fill={color} />
        <circle cx="35" cy="35" r="2.5" fill={color} />
        <circle cx="85" cy="75" r="3.5" fill={color} />
        <circle cx="45" cy="85" r="4" fill={color} />
        <line x1="75" y1="25" x2="55" y2="55" stroke={color} strokeWidth="0.8" />
        <line x1="75" y1="25" x2="35" y2="35" stroke={color} strokeWidth="0.6" />
        <line x1="55" y1="55" x2="35" y2="35" stroke={color} strokeWidth="0.8" />
        <line x1="55" y1="55" x2="85" y2="75" stroke={color} strokeWidth="0.8" />
        <line x1="55" y1="55" x2="45" y2="85" stroke={color} strokeWidth="1.2" />
        <line x1="85" y1="75" x2="45" y2="85" stroke={color} strokeWidth="0.6" />
      </svg>
    );
  } else if (lbl.includes('active zones') || lbl.includes('slots') || lbl.includes('days')) {
    return (
      <svg className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-[0.09]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="100,20 70,37.5 70,72.5 100,90 130,72.5 130,37.5" stroke={color} strokeWidth="1.2" />
        <polygon points="100,40 82.5,50 82.5,70 100,80 117.5,70 117.5,50" stroke={color} strokeWidth="0.8" />
        <line x1="100" y1="0" x2="100" y2="100" stroke={color} strokeWidth="0.6" strokeDasharray="3 3" />
        <line x1="50" y1="50" x2="150" y2="50" stroke={color} strokeWidth="0.6" strokeDasharray="3 3" />
      </svg>
    );
  }
  return (
    <svg className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-[0.07]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="0" r="85" stroke={color} strokeWidth="1.2" />
      <circle cx="100" cy="0" r="65" stroke={color} strokeWidth="1.2" strokeDasharray="4 4" />
      <circle cx="100" cy="0" r="45" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

interface StatCardProps { label: string; value: string | number; icon: React.ReactNode; color?: string; subtext?: string; isSimulated?: boolean; delay?: number; }
export function StatCard({ label, value, icon, color = '#22d3ee', subtext, isSimulated, delay = 0 }: StatCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}
      className="card p-5 relative overflow-hidden">
      <CardBgPattern label={label} color={color} />
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18`, color }}>
          {icon}
        </div>
        {isSimulated && <SimulatedBadge />}
      </div>
      <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>{value}</p>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      {subtext && <p className="text-xs mt-1" style={{ color }}>{subtext}</p>}
    </motion.div>
  );
}

interface PageHeaderProps { title: string; subtitle?: string; badge?: string; children?: React.ReactNode; }
export function PageHeader({ title, subtitle, badge, children }: PageHeaderProps) {
  return (
    <div className="pt-24 pb-10 px-4 sm:px-6 lg:px-8 text-center relative">
      <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
      {badge && (
        <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
          style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--border-soft)' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
          {badge}
        </motion.span>
      )}
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
        style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          {subtitle}
        </motion.p>
      )}
      {children && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6">
          {children}
        </motion.div>
      )}
    </div>
  );
}

interface LoadingSkeletonProps { rows?: number; className?: string; }
export function LoadingSkeleton({ rows = 3, className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton h-16 w-full" />
      ))}
    </div>
  );
}

interface ComingSoonCardProps { title: string; description: string; phase: string; features: string[]; icon: React.ReactNode; }
export function ComingSoonCard({ title, description, phase, features, icon }: ComingSoonCardProps) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
      className="card p-8 text-center max-w-2xl mx-auto">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
        style={{ background: 'rgba(192,132,252,0.1)', border: '1px solid rgba(192,132,252,0.2)' }}>
        <div style={{ color: '#c084fc' }}>{icon}</div>
      </div>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
        style={{ background: 'rgba(192,132,252,0.1)', color: '#c084fc', border: '1px solid rgba(192,132,252,0.3)' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        {phase}
      </span>
      <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>{title}</h2>
      <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />
            {f}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

interface BasementFloorSelectorProps { selected: 'B1' | 'B2' | 'All'; onChange: (val: 'B1' | 'B2' | 'All') => void; }
export function BasementFloorSelector({ selected, onChange }: BasementFloorSelectorProps) {
  const tabs: Array<{ label: string; value: 'B1' | 'B2' | 'All'; desc: string }> = [
    { label: 'All Floors', value: 'All', desc: '220 total slots' },
    { label: 'Basement 1 — B1', value: 'B1', desc: 'Student Parking · 140 slots' },
    { label: 'Basement 2 — B2', value: 'B2', desc: 'Faculty & Guest · 80 slots' },
  ];
  return (
    <div className="flex flex-col sm:flex-row gap-2 p-1.5 rounded-2xl w-fit mx-auto"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)' }}>
      {tabs.map((tab) => (
        <button key={tab.value} id={`floor-tab-${tab.value.toLowerCase()}`}
          onClick={() => onChange(tab.value)}
          className="relative px-5 py-3 rounded-xl transition-all duration-300 text-left sm:text-center"
          style={selected === tab.value
            ? { background: 'var(--accent-soft)', border: '1px solid var(--border-hover)', color: 'var(--accent)' }
            : { color: 'var(--text-muted)', border: '1px solid transparent' }}>
          {selected === tab.value && (
            <motion.div layoutId="floor-indicator" className="absolute inset-0 rounded-xl"
              style={{ background: 'var(--accent-soft)' }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }} />
          )}
          <p className="font-semibold text-sm relative z-10">{tab.label}</p>
          <p className="text-xs mt-0.5 relative z-10 opacity-70">{tab.desc}</p>
        </button>
      ))}
    </div>
  );
}

interface ZoneCardProps { zone: import('../types').ParkingZone; onClick?: () => void; delay?: number; }
export function ZoneCard({ zone, onClick, delay = 0 }: ZoneCardProps) {
  const pct = zone.occupancyPercentage;
  const barColor = pct >= 85 ? '#f87171' : pct >= 60 ? '#fb923c' : '#4ade80';
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }} onClick={onClick}
      className="card p-6 cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
              {zone.basement}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{zone.floor}</span>
          </div>
          <h3 className="font-bold text-base" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>{zone.name}</h3>
        </div>
        <StatusBadge status={zone.status} />
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Total', val: zone.totalSlots, color: 'var(--text-primary)', bg: 'var(--bg-elevated)' },
          { label: 'Available', val: zone.availableSlots, color: '#4ade80', bg: 'rgba(74,222,128,0.06)' },
          { label: 'Occupied', val: zone.occupiedSlots, color: '#f87171', bg: 'rgba(248,113,113,0.06)' },
        ].map(m => (
          <div key={m.label} className="text-center p-2 rounded-lg" style={{ background: m.bg }}>
            <p className="text-xl font-bold" style={{ color: m.color, fontFamily: 'Outfit, sans-serif' }}>{m.val}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{m.label}</p>
          </div>
        ))}
      </div>
      <div className="mb-2">
        <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
          <span>Occupancy</span>
          <span style={{ color: barColor, fontWeight: 600 }}>{pct}%</span>
        </div>
        <div className="h-2 rounded-full" style={{ background: 'var(--bg-elevated)' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
            transition={{ duration: 1, delay: delay + 0.3, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${barColor}88, ${barColor})` }} />
        </div>
      </div>
      <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
        Updated {new Date(zone.lastUpdated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
      </p>
    </motion.div>
  );
}

export function ChartCard({ title, subtitle, isSimulated, children, className = '' }: {
  title: string; subtitle?: string; isSimulated?: boolean; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-bold text-base" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>{title}</h3>
          {subtitle && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
        </div>
        {isSimulated && <SimulatedBadge />}
      </div>
      {children}
    </div>
  );
}
