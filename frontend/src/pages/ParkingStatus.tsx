import { useState, useEffect, useRef } from 'react';
import {
  RefreshCw, TrendingUp, Car, Users, UserCheck,
  CheckCircle2, Layers, Activity
} from 'lucide-react';
import { SimulatedBadge, CardBgPattern } from '../components/index';
import { parkingZones, dashboardStats } from '../data/mockData';
import type { ParkingZone } from '../types';

/* ─── CSS-based fade-in so it always works in production ─── */
const fadeIn: React.CSSProperties = {
  animation: 'ps-fadein 0.4s ease both',
};
const style = document.createElement('style');
style.textContent = `
@keyframes ps-fadein { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@keyframes ps-tabslide-in-right { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }
@keyframes ps-tabslide-in-left  { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: translateX(0); } }
@keyframes ps-bar-grow { from { width: 0; } to { width: var(--bar-w); } }
`;
if (!document.getElementById('ps-styles')) { style.id = 'ps-styles'; document.head.appendChild(style); }

const ZONE_COLORS: Record<string, string> = {
  Student: '#22d3ee',
  Faculty: '#4ade80',
  Guest:   '#a78bfa',
};

const CAR_COLORS = ['#f87171', '#38bdf8', '#f472b6', '#fb923c', '#a78bfa', '#60a5fa', '#34d399', '#94a3b8'];

/* ─── Occupancy ring (pure SVG, no framer-motion) ─── */
function OccupancyRing({ pct, color, size = 60 }: { pct: number; color: string; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={6} strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ - dash}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  );
}

/* ─── Slot grid — always horizontal rows, scrollable on mobile ─── */
function SlotGrid({ zones, basement }: { zones: ParkingZone[]; basement: 'B1' | 'B2' | 'All' }) {
  const filtered = basement === 'All' ? zones : zones.filter(z => z.basement === basement);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {filtered.map(zone => {
        const slotsPerRow = zone.category === 'Student' ? 14 : zone.category === 'Faculty' ? 12 : 10;
        const totalSlots = zone.totalSlots;
        const numRows = Math.ceil(totalSlots / slotsPerRow);

        const occupiedIndices = new Set<number>();
        let count = 0;
        const seed = zone.id === 'student-b1' ? 3 : zone.id === 'faculty-b2' ? 7 : 11;
        while (occupiedIndices.size < zone.occupiedSlots && count < 1000) {
          occupiedIndices.add((count * seed) % zone.totalSlots);
          count++;
        }
        for (let i = 0; i < zone.totalSlots; i++) {
          if (occupiedIndices.size >= zone.occupiedSlots) break;
          occupiedIndices.add(i);
        }

        const rows = Array.from({ length: numRows }, (_, rIndex) => {
          const start = rIndex * slotsPerRow;
          const end = Math.min(start + slotsPerRow, totalSlots);
          return {
            name: `Row ${String.fromCharCode(65 + rIndex)}`,
            slots: Array.from({ length: end - start }, (_, sIndex) => {
              const idx = start + sIndex;
              return {
                id: idx,
                status: occupiedIndices.has(idx) ? 'occupied' : 'available' as 'occupied' | 'available',
              };
            }),
          };
        });

        const color = ZONE_COLORS[zone.category];

        return (
          <div key={zone.id} className="card" style={{ padding: '16px 16px', ...fadeIn, overflow: 'hidden' }}>
            {/* Zone header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${color}18`, color, fontSize: 11, fontWeight: 800 }}>
                  {zone.basement}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>{zone.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{zone.totalSlots} slots · {zone.availableSlots} available</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color }}>{zone.occupancyPercentage}%</span>
                <div style={{ width: 64, height: 5, borderRadius: 99, background: 'var(--stats-bar-bg)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 99, background: color, width: `${zone.occupancyPercentage}%`, transition: 'width 1s ease' }} />
                </div>
              </div>
            </div>

            {/* Rows — always horizontal, scroll on mobile */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rows.map((row) => (
                <div key={row.name} style={{ display: 'flex', alignItems: 'flex-start', gap: 8,
                  paddingBottom: 8, borderBottom: '1px dashed var(--border-soft)' }}>
                  <span style={{ width: 36, fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: 1, color: 'var(--text-muted)', paddingTop: 12, flexShrink: 0 }}>
                    {row.name}
                  </span>
                  {/* Horizontal scroll container */}
                  <div style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', paddingBottom: 4 }}>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 5, width: 'max-content' }}>
                      {row.slots.map(slot => {
                        const carColor = CAR_COLORS[slot.id % CAR_COLORS.length];
                        return slot.status === 'available' ? (
                          <div key={slot.id} style={{
                            width: 24, height: 36, flexShrink: 0, borderRadius: 2, display: 'flex',
                            flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '3px 0',
                            background: 'rgba(74,222,128,0.03)',
                            borderLeft: '2px solid rgba(74,222,128,0.4)',
                            borderRight: '2px solid rgba(74,222,128,0.4)',
                            borderTop: '1px dashed rgba(74,222,128,0.18)',
                            borderBottom: '1px dashed rgba(74,222,128,0.18)',
                          }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 5px #4ade80', display: 'block' }} />
                            <span style={{ fontSize: 7, fontFamily: 'monospace', opacity: 0.3, color: 'var(--text-secondary)' }}>
                              {String(slot.id + 1).padStart(2, '0')}
                            </span>
                          </div>
                        ) : (
                          <div key={slot.id} style={{
                            width: 24, height: 36, flexShrink: 0, borderRadius: 2, display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            background: 'rgba(255,255,255,0.01)',
                            borderLeft: '2px solid var(--border-soft)',
                            borderRight: '2px solid var(--border-soft)',
                            borderTop: '1px dashed var(--border-soft)',
                            borderBottom: '1px dashed var(--border-soft)',
                          }}>
                            <svg width="16" height="28" viewBox="0 0 24 40" fill="none">
                              <rect x="4" y="4" width="16" height="31" rx="3.5" fill={carColor} />
                              <rect x="5.5" y="10" width="13" height="15" rx="2" fill="#111827" opacity="0.85" />
                              <path d="M6.5 12L7.5 16H16.5L17.5 12H6.5Z" fill="#374151" />
                              <circle cx="7" cy="5" r="1" fill="#fef08a" />
                              <circle cx="17" cy="5" r="1" fill="#fef08a" />
                            </svg>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 16, marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border-soft)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 4px #4ade80', display: 'block' }} />
                Available ({zone.availableSlots})
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f87171', display: 'block' }} />
                Occupied ({zone.occupiedSlots})
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── ZoneCard (no framer-motion) ─── */
function ZoneCard({ zone, animDelay }: { zone: ParkingZone; animDelay: number }) {
  const pct = zone.occupancyPercentage;
  const barColor = pct >= 85 ? '#f87171' : pct >= 60 ? '#fb923c' : '#4ade80';
  return (
    <div className="card" style={{ padding: 20, ...fadeIn, animationDelay: `${animDelay}s` }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
              background: 'var(--accent-soft)', color: 'var(--accent)' }}>{zone.basement}</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>{zone.name}</div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 99,
          background: zone.status === 'Available' ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
          color: zone.status === 'Available' ? '#4ade80' : '#f87171',
          border: `1px solid ${zone.status === 'Available' ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}` }}>
          {zone.status}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
        {[
          { label: 'Total', val: zone.totalSlots, color: 'var(--text-primary)' },
          { label: 'Available', val: zone.availableSlots, color: '#4ade80' },
          { label: 'Occupied', val: zone.occupiedSlots, color: '#f87171' },
        ].map(m => (
          <div key={m.label} style={{ textAlign: 'center', padding: '8px 4px', borderRadius: 8, background: 'var(--bg-elevated)' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: m.color, fontFamily: 'Outfit, sans-serif' }}>{m.val}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Occupancy: {pct}%</div>
      <div style={{ height: 6, borderRadius: 99, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 99, width: `${pct}%`, transition: 'width 1s ease',
          background: `linear-gradient(90deg, ${barColor}88, ${barColor})` }} />
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function ParkingStatus() {
  const [basement, setBasement] = useState<'B1' | 'B2' | 'All'>('All');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'slots'>('slots');
  const [prevTab, setPrevTab] = useState<'overview' | 'slots'>('slots');
  const mountedRef = useRef(true);

  const stats = dashboardStats;
  const zones = parkingZones;

  const handleTabChange = (tab: 'overview' | 'slots') => {
    if (tab === activeTab) return;
    setPrevTab(activeTab);
    setActiveTab(tab);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => { if (mountedRef.current) { setLastUpdate(new Date()); setIsRefreshing(false); } }, 800);
  };

  useEffect(() => {
    mountedRef.current = true;
    const id = setInterval(() => { if (mountedRef.current) setLastUpdate(new Date()); }, 30000);
    return () => { mountedRef.current = false; clearInterval(id); };
  }, []);

  const totalByCategory = {
    Student: zones.filter(z => z.category === 'Student').reduce((a, z) => a + z.totalSlots, 0),
    Faculty: zones.filter(z => z.category === 'Faculty').reduce((a, z) => a + z.totalSlots, 0),
    Guest:   zones.filter(z => z.category === 'Guest').reduce((a, z) => a + z.totalSlots, 0),
  };
  const availByCategory = {
    Student: zones.filter(z => z.category === 'Student').reduce((a, z) => a + z.availableSlots, 0),
    Faculty: zones.filter(z => z.category === 'Faculty').reduce((a, z) => a + z.availableSlots, 0),
    Guest:   zones.filter(z => z.category === 'Guest').reduce((a, z) => a + z.availableSlots, 0),
  };

  const filteredZones = basement === 'All' ? zones : zones.filter(z => z.basement === basement);

  // Direction of tab animation
  const tabAnimKey = `${activeTab}-${basement}`;
  const slideDir = activeTab === 'slots' && prevTab === 'overview' ? 'left' : 'right';

  return (
    <div style={{ minHeight: '100vh', paddingTop: 64 }}>

      {/* ── HEADER ── */}
      <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-soft)', position: 'relative', overflow: 'hidden' }}>
        <div className="dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 16px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Layers size={14} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--accent)' }}>Live Dashboard</span>
                <SimulatedBadge />
              </div>
              <h1 style={{ fontSize: 'clamp(18px, 4vw, 28px)', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)', margin: 0 }}>
                AUST Parking Status
              </h1>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                B1 &amp; B2 · 220 slots · {lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Tab switcher with animated underline */}
              <div style={{ display: 'flex', borderRadius: 12, padding: 4, background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', position: 'relative' }}>
                {(['slots', 'overview'] as const).map(tab => (
                  <button key={tab} onClick={() => handleTabChange(tab)}
                    style={{
                      padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                      border: 'none', cursor: 'pointer', transition: 'all 0.25s ease', position: 'relative',
                      background: activeTab === tab ? 'var(--accent)' : 'transparent',
                      color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
                      boxShadow: activeTab === tab ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                      transform: activeTab === tab ? 'scale(1.02)' : 'scale(1)',
                    }}>
                    {tab === 'slots' ? '🗺 Slot Map' : '📊 Overview'}
                  </button>
                ))}
              </div>
              <button onClick={handleRefresh}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 10, fontSize: 12,
                  fontWeight: 600, border: '1px solid var(--border-soft)', cursor: 'pointer',
                  background: 'var(--accent-soft)', color: 'var(--accent)', transition: 'all 0.2s' }}>
                <RefreshCw size={13} style={{ animation: isRefreshing ? 'spin 0.8s linear infinite' : 'none' }} />
                <span style={{ display: 'none' }} className="sm-inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── STATS ROW ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }} className="lg-4col">
          {[
            { icon: <Activity size={16}/>, label: 'Occupancy', val: `${stats.occupancyRate}%`, sub: 'of 220 slots', color: '#22d3ee' },
            { icon: <CheckCircle2 size={16}/>, label: 'Available', val: String(stats.availableSlots), sub: 'Open now', color: '#4ade80' },
            { icon: <Car size={16}/>, label: 'Occupied', val: String(stats.occupiedSlots), sub: 'Parked', color: '#f87171' },
            { icon: <TrendingUp size={16}/>, label: 'Peak Hour', val: stats.peakHour, sub: 'Forecast', color: '#fb923c' },
          ].map((s, i) => (
            <div key={s.label} className="card" style={{ padding: '14px 16px', position: 'relative', overflow: 'hidden', ...fadeIn, animationDelay: `${i * 0.06}s` }}>
              <CardBgPattern label={s.label} color={s.color} />
              <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${s.color}18`, color: s.color, marginBottom: 8 }}>
                {s.icon}
              </div>
              <div style={{ fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: 900, color: s.color, fontFamily: 'Outfit, sans-serif' }}>{s.val}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', marginTop: 1 }}>{s.label}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── CATEGORY CARDS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: 12 }} className="sm-3col">
          {(['Student', 'Faculty', 'Guest'] as const).map((cat, i) => {
            const total = totalByCategory[cat];
            const avail = availByCategory[cat];
            const occ = total - avail;
            const pct = Math.round((occ / total) * 100);
            const color = ZONE_COLORS[cat];
            const icons = { Student: <Users size={15}/>, Faculty: <UserCheck size={15}/>, Guest: <Car size={15}/> };
            const basements = { Student: 'Basement 1', Faculty: 'Basement 2', Guest: 'Basement 2' };
            return (
              <div key={cat} className="card" style={{ padding: '16px', ...fadeIn, animationDelay: `${0.1 + i * 0.08}s` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: `${color}18`, color }}>{icons[cat]}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>{cat} Parking</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{basements[cat]}</div>
                    </div>
                  </div>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <OccupancyRing pct={pct} color={color} size={56} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 10, fontWeight: 900, color }}>{pct}%</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {[
                    { label: 'Total', val: total, color: 'var(--text-secondary)' },
                    { label: 'Free', val: avail, color: '#4ade80' },
                    { label: 'Used', val: occ, color: '#f87171' },
                  ].map(m => (
                    <div key={m.label} style={{ textAlign: 'center', padding: '7px 4px', borderRadius: 8, background: 'var(--bg-elevated)' }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: m.color, fontFamily: 'Outfit, sans-serif' }}>{m.val}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── FLOOR SELECTOR — always horizontal ── */}
        <div style={{ overflowX: 'auto', padding: '2px 0' }}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 8, padding: 6, borderRadius: 16,
            width: 'max-content', margin: '0 auto',
            background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)' }}>
            {([
              { label: 'All Floors', value: 'All' as const, desc: '220 slots' },
              { label: 'Basement 1', value: 'B1' as const, desc: 'Student · 140' },
              { label: 'Basement 2', value: 'B2' as const, desc: 'Faculty & Guest · 80' },
            ]).map(tab => (
              <button key={tab.value} onClick={() => setBasement(tab.value)}
                style={{
                  padding: '8px 18px', borderRadius: 10, cursor: 'pointer', whiteSpace: 'nowrap',
                  textAlign: 'center', transition: 'all 0.25s ease',
                  background: basement === tab.value ? 'var(--accent-soft)' : 'transparent',
                  border: basement === tab.value ? '1px solid var(--border-hover)' : '1px solid transparent',
                  color: basement === tab.value ? 'var(--accent)' : 'var(--text-muted)',
                  transform: basement === tab.value ? 'scale(1.02)' : 'scale(1)',
                }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{tab.label}</div>
                <div style={{ fontSize: 10, opacity: 0.7, marginTop: 1 }}>{tab.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ── MAIN CONTENT — CSS animated tab switch ── */}
        <div key={tabAnimKey} style={{
          animation: `${slideDir === 'right' ? 'ps-tabslide-in-right' : 'ps-tabslide-in-left'} 0.28s ease both`,
        }}>
          {activeTab === 'overview' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: 12 }} className="sm-2col lg-3col">
              {filteredZones.map((zone, i) => (
                <ZoneCard key={zone.id} zone={zone} animDelay={i * 0.05} />
              ))}
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                  <span style={{ width: 14, height: 10, borderRadius: 2, display: 'inline-block',
                    background: 'rgba(74,222,128,0.2)', border: '1px solid rgba(74,222,128,0.5)' }} />
                  Available
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                  <span style={{ width: 14, height: 10, borderRadius: 2, display: 'inline-block',
                    background: 'rgba(248,113,113,0.2)', border: '1px solid rgba(248,113,113,0.4)' }} />
                  Occupied
                </div>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 'auto' }}>← scroll rows →</span>
              </div>
              <SlotGrid zones={zones} basement={basement} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
