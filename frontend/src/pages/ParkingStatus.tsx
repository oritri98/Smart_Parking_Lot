import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  RefreshCw, TrendingUp, Car, Users, UserCheck,
  CheckCircle2, Layers, Activity
} from 'lucide-react';
import { ZoneCard, BasementFloorSelector, SimulatedBadge, CardBgPattern } from '../components/index';
import { parkingZones, dashboardStats } from '../data/mockData';
import type { ParkingZone } from '../types';

const ZONE_COLORS: Record<string, string> = {
  Student: '#22d3ee',
  Faculty: '#4ade80',
  Guest:   '#a78bfa',
};

function OccupancyRing({ pct, color, size = 72 }: { pct: number; color: string; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
      <motion.circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  );
}

function SlotGrid({ zones, basement }: { zones: ParkingZone[]; basement: 'B1' | 'B2' | 'All' }) {
  const filtered = basement === 'All' ? zones : zones.filter(z => z.basement === basement);
  const CAR_COLORS = ['#f87171', '#38bdf8', '#f472b6', '#fb923c', '#a78bfa', '#60a5fa', '#34d399', '#94a3b8'];

  return (
    <div className="space-y-4">
      {filtered.map(zone => {
        // On mobile: fewer slots per row so they fit horizontally
        const slotsPerRow = zone.category === 'Student' ? 14 : (zone.category === 'Faculty' ? 12 : 10);
        const totalSlots = zone.totalSlots;
        const numRows = Math.ceil(totalSlots / slotsPerRow);

        const occupiedIndices = new Set<number>();
        let count = 0;
        const seed = zone.id === 'student-b1' ? 3 : (zone.id === 'faculty-b2' ? 7 : 11);
        while (occupiedIndices.size < zone.occupiedSlots && count < 1000) {
          const index = (count * seed) % zone.totalSlots;
          occupiedIndices.add(index);
          count++;
        }
        for (let i = 0; i < zone.totalSlots; i++) {
          if (occupiedIndices.size >= zone.occupiedSlots) break;
          occupiedIndices.add(i);
        }

        const rows = Array.from({ length: numRows }, (_, rIndex) => {
          const start = rIndex * slotsPerRow;
          const end = Math.min(start + slotsPerRow, totalSlots);
          const rowSlots = Array.from({ length: end - start }, (_, sIndex) => {
            const slotIndex = start + sIndex;
            return {
              id: slotIndex,
              status: occupiedIndices.has(slotIndex) ? 'occupied' : 'available' as 'occupied' | 'available',
              num: `${zone.category.substring(0, 1).toUpperCase()}-${String(slotIndex + 1).padStart(3, '0')}`
            };
          });
          return { name: `Row ${String.fromCharCode(65 + rIndex)}`, slots: rowSlots };
        });

        return (
          <motion.div key={zone.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="card p-4 sm:p-5 overflow-hidden">
            {/* Zone header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
                  style={{ background: `${ZONE_COLORS[zone.category]}15`, color: ZONE_COLORS[zone.category] }}>
                  {zone.basement}
                </div>
                <div>
                  <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>{zone.name}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{zone.totalSlots} slots · {zone.availableSlots} available</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold" style={{ color: ZONE_COLORS[zone.category] }}>{zone.occupancyPercentage}%</span>
                <div className="w-16 sm:w-20 h-1.5 rounded-full" style={{ background: 'var(--stats-bar-bg)' }}>
                  <motion.div className="h-full rounded-full"
                    initial={{ width: 0 }} animate={{ width: `${zone.occupancyPercentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{ background: ZONE_COLORS[zone.category] }} />
                </div>
              </div>
            </div>

            {/* Slot rows — always horizontal, scrollable on mobile */}
            <div className="space-y-3">
              {rows.map((row, rIdx) => (
                <div key={row.name} className="flex items-start gap-2 py-1 border-b border-dashed border-[var(--border-soft)] last:border-b-0">
                  <span className="w-10 text-[10px] font-bold uppercase tracking-wider shrink-0 pt-3" style={{ color: 'var(--text-muted)' }}>
                    {row.name}
                  </span>
                  {/* Scrollable horizontal slot strip */}
                  <div className="flex-1 overflow-x-auto pb-1">
                    <div className="flex flex-row gap-1.5 w-max">
                      {row.slots.map(slot => {
                        const carColor = CAR_COLORS[slot.id % CAR_COLORS.length];
                        return (
                          <div key={slot.id}
                            className="w-7 h-10 sm:w-8 sm:h-11 flex flex-col items-center justify-between py-0.5 relative shrink-0 rounded-sm"
                            style={slot.status === 'available'
                              ? {
                                  background: 'rgba(74,222,128,0.03)',
                                  borderLeft: '2px solid rgba(74,222,128,0.35)',
                                  borderRight: '2px solid rgba(74,222,128,0.35)',
                                  borderTop: '1px dashed rgba(74,222,128,0.15)',
                                  borderBottom: '1px dashed rgba(74,222,128,0.15)',
                                }
                              : {
                                  background: 'rgba(255,255,255,0.01)',
                                  borderLeft: '2px solid var(--border-soft)',
                                  borderRight: '2px solid var(--border-soft)',
                                  borderTop: '1px dashed var(--border-soft)',
                                  borderBottom: '1px dashed var(--border-soft)',
                                }}
                          >
                            {slot.status === 'available' ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" style={{ boxShadow: '0 0 5px #4ade80' }} />
                                <span className="text-[8px] font-mono opacity-30 select-none" style={{ color: 'var(--text-secondary)' }}>
                                  {String(slot.id + 1).padStart(2, '0')}
                                </span>
                              </>
                            ) : (
                              <svg className="w-5 h-9 mt-0.5" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="3" y="5" width="18" height="31" rx="4" fill="#000" opacity="0.25" />
                                <rect x="4" y="4" width="16" height="31" rx="3.5" fill={carColor} />
                                <rect x="5.5" y="10" width="13" height="15" rx="2" fill="#111827" opacity="0.85" />
                                <path d="M6.5 12L7.5 16H16.5L17.5 12H6.5Z" fill="#374151" />
                                <path d="M6.5 23L7.5 21H16.5L17.5 23H6.5Z" fill="#374151" />
                                <circle cx="7" cy="5" r="1" fill="#fef08a" />
                                <circle cx="17" cy="5" r="1" fill="#fef08a" />
                              </svg>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-3" style={{ borderTop: '1px solid var(--border-soft)' }}>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span className="w-2 h-2 rounded-full bg-[#4ade80]" style={{ boxShadow: '0 0 4px #4ade80' }} />
                Available ({zone.availableSlots})
              </div>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span className="w-2 h-2 rounded-full bg-[#f87171]" />
                Occupied ({zone.occupiedSlots})
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}


export default function ParkingStatus() {
  const [basement, setBasement] = useState<'B1' | 'B2' | 'All'>('All');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'slots'>('slots');
  const mountedRef = useRef(true);

  const stats = dashboardStats;
  const zones = parkingZones;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      if (mountedRef.current) {
        setLastUpdate(new Date());
        setIsRefreshing(false);
      }
    }, 800);
  };

  useEffect(() => {
    mountedRef.current = true;
    const id = setInterval(() => {
      if (mountedRef.current) setLastUpdate(new Date());
    }, 30000);
    return () => {
      mountedRef.current = false;
      clearInterval(id);
    };
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

  return (
    <div className="min-h-screen" style={{ paddingTop: 64 }}>

      {/* ── PAGE HEADER ── */}
      <div className="relative overflow-hidden" style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-soft)' }}>
        <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Layers size={14} style={{ color: 'var(--accent)' }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>Live Dashboard</span>
                <SimulatedBadge />
              </div>
              <h1 className="text-xl sm:text-3xl font-black" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                AUST Parking Status
              </h1>
              <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                B1 &amp; B2 · 220 slots · {lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Tab switcher */}
              <div className="flex rounded-xl p-1" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)' }}>
                {(['slots', 'overview'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className="px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                    style={activeTab === tab
                      ? { background: 'var(--accent)', color: '#fff' }
                      : { color: 'var(--text-secondary)' }}>
                    {tab === 'slots' ? 'Slot Map' : 'Overview'}
                  </button>
                ))}
              </div>
              <button onClick={handleRefresh}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--border-soft)' }}>
                <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-4 sm:space-y-6">

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: <Activity size={16}/>, label: 'Occupancy', val: `${stats.occupancyRate}%`, sub: 'of 220 slots', color: '#22d3ee' },
            { icon: <CheckCircle2 size={16}/>, label: 'Available', val: stats.availableSlots, sub: 'Open now', color: '#4ade80' },
            { icon: <Car size={16}/>, label: 'Occupied', val: stats.occupiedSlots, sub: 'Parked', color: '#f87171' },
            { icon: <TrendingUp size={16}/>, label: 'Peak Hour', val: stats.peakHour, sub: 'Forecast', color: '#fb923c' },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card p-4 sm:p-5 relative overflow-hidden">
              <CardBgPattern label={s.label} color={s.color} />
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center mb-2 sm:mb-3"
                style={{ background: `${s.color}15`, color: s.color }}>
                {s.icon}
              </div>
              <p className="text-xl sm:text-2xl font-black" style={{ color: s.color, fontFamily: 'Outfit, sans-serif' }}>{s.val}</p>
              <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>{s.label}</p>
              <p className="text-xs mt-0.5 hidden sm:block" style={{ color: 'var(--text-muted)' }}>{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* ── CATEGORY CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {(['Student', 'Faculty', 'Guest'] as const).map((cat, i) => {
            const total = totalByCategory[cat];
            const avail = availByCategory[cat];
            const occ = total - avail;
            const pct = Math.round((occ / total) * 100);
            const color = ZONE_COLORS[cat];
            const icons = { Student: <Users size={16}/>, Faculty: <UserCheck size={16}/>, Guest: <Car size={16}/> };
            const basements = { Student: 'Basement 1', Faculty: 'Basement 2', Guest: 'Basement 2' };
            return (
              <motion.div key={cat}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="card p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}15`, color }}>
                        {icons[cat]}
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>{cat} Parking</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{basements[cat]}</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <OccupancyRing pct={pct} color={color} size={60} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-black" style={{ color }}>{pct}%</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: 'Total', val: total, color: 'var(--text-secondary)' },
                    { label: 'Free', val: avail, color: '#4ade80' },
                    { label: 'Used', val: occ, color: '#f87171' },
                  ].map(m => (
                    <div key={m.label} className="p-2 rounded-lg" style={{ background: 'var(--bg-elevated)' }}>
                      <p className="text-base sm:text-lg font-black" style={{ color: m.color, fontFamily: 'Outfit, sans-serif' }}>{m.val}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{m.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── FLOOR SELECTOR ── always horizontal, scrollable on tiny screens */}
        <div className="overflow-x-auto">
          <div className="flex flex-row gap-2 p-1.5 rounded-2xl w-fit mx-auto"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', minWidth: 'max-content' }}>
            {([
              { label: 'All Floors', value: 'All' as const, desc: '220 slots' },
              { label: 'Basement 1', value: 'B1' as const, desc: 'Student · 140' },
              { label: 'Basement 2', value: 'B2' as const, desc: 'Faculty & Guest · 80' },
            ]).map((tab) => (
              <button key={tab.value}
                onClick={() => setBasement(tab.value)}
                className="px-4 py-2.5 rounded-xl transition-all duration-300 text-center whitespace-nowrap"
                style={basement === tab.value
                  ? { background: 'var(--accent-soft)', border: '1px solid var(--border-hover)', color: 'var(--accent)' }
                  : { color: 'var(--text-muted)', border: '1px solid transparent' }}>
                <p className="font-semibold text-sm">{tab.label}</p>
                <p className="text-xs mt-0.5 opacity-70">{tab.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── MAIN CONTENT AREA — no AnimatePresence to prevent blank screen bug ── */}
        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredZones.map((zone, i) => (
              <ZoneCard key={zone.id} zone={zone} delay={i * 0.05} />
            ))}
          </div>
        ) : (
          <div>
            {/* Legend */}
            <div className="flex items-center gap-4 mb-4 px-1 flex-wrap">
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="w-4 h-3.5 rounded-sm inline-block" style={{ background: 'rgba(74,222,128,0.2)', border: '1px solid rgba(74,222,128,0.5)' }} />
                Available
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="w-4 h-3.5 rounded-sm inline-block" style={{ background: 'rgba(248,113,113,0.2)', border: '1px solid rgba(248,113,113,0.4)' }} />
                Occupied
              </div>
              <p className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>← scroll rows to see all slots</p>
            </div>
            <SlotGrid zones={zones} basement={basement} />
          </div>
        )}

      </div>
    </div>
  );
}
