import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

function OccupancyRing({ pct, color, size = 80 }: { pct: number; color: string; size?: number }) {
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
    <div className="space-y-6">
      {filtered.map(zone => {
        const slotsPerRow = zone.category === 'Student' ? 20 : (zone.category === 'Faculty' ? 25 : 15);
        const totalSlots = zone.totalSlots;
        const numRows = Math.ceil(totalSlots / slotsPerRow);
        
        // Deterministic scattering of occupied slots so it looks like a real active lot
        const occupiedIndices = new Set<number>();
        let count = 0;
        let seed = zone.id === 'student-b1' ? 3 : (zone.id === 'faculty-b2' ? 7 : 11);
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
            const isOccupied = occupiedIndices.has(slotIndex);
            return {
              id: slotIndex,
              status: isOccupied ? 'occupied' : 'available' as 'occupied' | 'available',
              num: `${zone.category.substring(0, 1).toUpperCase()}-${String(slotIndex + 1).padStart(3, '0')}`
            };
          });
          return {
            name: `Row ${String.fromCharCode(65 + rIndex)}`,
            slots: rowSlots
          };
        });

        return (
          <motion.div key={zone.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="card p-5">
            <div className="flex items-center justify-between mb-5">
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
                <div className="w-20 h-1.5 rounded-full" style={{ background: 'var(--stats-bar-bg)' }}>
                  <motion.div className="h-full rounded-full"
                    initial={{ width: 0 }} animate={{ width: `${zone.occupancyPercentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{ background: ZONE_COLORS[zone.category] }} />
                </div>
              </div>
            </div>

            {/* Structured Rows */}
            <div className="space-y-4">
              {rows.map((row, rIdx) => (
                <div key={row.name} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-1.5 border-b border-dashed border-[var(--border-soft)] last:border-b-0">
                  <span className="w-14 text-xs font-bold uppercase tracking-wider text-left shrink-0" style={{ color: 'var(--text-muted)' }}>
                    {row.name}
                  </span>
                  <div className="flex flex-wrap gap-x-2 gap-y-3">
                    {row.slots.map(slot => {
                      const carColor = CAR_COLORS[slot.id % CAR_COLORS.length];
                      return (
                        <motion.div key={slot.id}
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.2, y: -2, zIndex: 10 }}
                          transition={{ delay: rIdx * 0.015 + (slot.id % slotsPerRow) * 0.002, duration: 0.2 }}
                          className="w-9 h-12 flex flex-col items-center justify-between py-1 relative cursor-pointer group transition-all"
                          style={slot.status === 'available'
                            ? {
                                background: 'rgba(74,222,128,0.02)',
                                borderLeft: '2px solid rgba(74,222,128,0.25)',
                                borderRight: '2px solid rgba(74,222,128,0.25)',
                                borderTop: '1px dashed rgba(74,222,128,0.1)',
                                borderBottom: '1px dashed rgba(74,222,128,0.1)',
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
                              {/* Green Overhead Indicator Light */}
                              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]"
                                style={{ boxShadow: '0 0 5px #4ade80' }}
                              />
                              {/* Slot Number Label */}
                              <span className="text-[9px] font-mono opacity-40 select-none mt-auto" style={{ color: 'var(--text-secondary)' }}>
                                {String(slot.id + 1).padStart(2, '0')}
                              </span>
                            </>
                          ) : (
                            <>
                              {/* Miniature Car Top-down Silhouette */}
                              <svg className="w-6 h-10 mt-0.5 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Car Shadow */}
                                <rect x="3" y="5" width="18" height="31" rx="4" fill="#000" opacity="0.25" />
                                {/* Car Body */}
                                <rect x="4" y="4" width="16" height="31" rx="3.5" fill={carColor} />
                                {/* Cabin Roof */}
                                <rect x="5.5" y="10" width="13" height="15" rx="2" fill="#111827" opacity="0.85" />
                                {/* Windshield */}
                                <path d="M6.5 12L7.5 16H16.5L17.5 12H6.5Z" fill="#374151" />
                                {/* Rear window */}
                                <path d="M6.5 23L7.5 21H16.5L17.5 23H6.5Z" fill="#374151" />
                                {/* Side Mirrors */}
                                <rect x="2" y="12" width="2" height="3" rx="0.5" fill={carColor} />
                                <rect x="20" y="12" width="2" height="3" rx="0.5" fill={carColor} />
                                {/* Front Headlights */}
                                <circle cx="7" cy="5" r="1" fill="#fef08a" />
                                <circle cx="17" cy="5" r="1" fill="#fef08a" />
                                {/* Rear Taillights */}
                                <rect x="6" y="34.5" width="2.5" height="0.8" fill="#ef4444" />
                                <rect x="15.5" y="34.5" width="2.5" height="0.8" fill="#ef4444" />
                              </svg>
                            </>
                          )}

                          {/* Hover Tooltip */}
                          <div className="absolute bottom-full mb-2.5 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
                            <div className="bg-[var(--bg-elevated)] border border-[var(--border-soft)] text-[var(--text-primary)] text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap"
                              style={{ backdropFilter: 'blur(12px)' }}>
                              Slot {slot.num} · <span className={slot.status === 'available' ? 'text-green-400 font-extrabold' : 'text-red-400 font-extrabold'}>{slot.status}</span>
                            </div>
                            <div className="w-1.5 h-1.5 bg-[var(--bg-elevated)] border-r border-b border-[var(--border-soft)] rotate-45 -mt-1" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Interactive Legend */}
            <div className="flex items-center gap-4 mt-5 pt-4" style={{ borderTop: '1px solid var(--border-soft)' }}>
              <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                <span className="w-5 h-7 rounded-[3px] border-l-2 border-r-2 flex flex-col items-center justify-between py-0.5"
                  style={{ background: 'rgba(74,222,128,0.02)', borderColor: 'rgba(74,222,128,0.25)' }}>
                  <span className="w-1 h-1 rounded-full bg-[#4ade80]" style={{ boxShadow: '0 0 3px #4ade80' }} />
                  <span className="text-[7px] font-mono opacity-40 select-none">00</span>
                </span>
                Available Zone ({zone.availableSlots} open)
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                <span className="w-5 h-7 rounded-[3px] border-l-2 border-r-2 flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.01)', borderColor: 'var(--border-soft)' }}>
                  <svg className="w-4 h-6 opacity-85" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="4" width="16" height="31" rx="3.5" fill="#f87171" />
                    <rect x="5.5" y="10" width="13" height="15" rx="2" fill="#111827" opacity="0.85" />
                  </svg>
                </span>
                Occupied ({zone.occupiedSlots} parked)
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

  const stats = dashboardStats;
  const zones = parkingZones;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => { setLastUpdate(new Date()); setIsRefreshing(false); }, 800);
  };

  useEffect(() => {
    const id = setInterval(() => setLastUpdate(new Date()), 30000);
    return () => clearInterval(id);
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

  return (
    <div className="min-h-screen" style={{ paddingTop: 80 }}>
      {/* ── PAGE HEADER ── */}
      <div className="relative overflow-hidden" style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-soft)' }}>
        <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Layers size={16} style={{ color: 'var(--accent)' }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>Live Dashboard</span>
                <SimulatedBadge />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                AUST Parking Status
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Basement 1 & 2 · 220 slots · Updated {lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Tab switcher */}
              <div className="flex rounded-xl p-1" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)' }}>
                {(['slots', 'overview'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                    style={activeTab === tab
                      ? { background: 'var(--accent)', color: '#fff' }
                      : { color: 'var(--text-secondary)' }}>
                    {tab === 'slots' ? 'Slot Map' : 'Overview'}
                  </button>
                ))}
              </div>
              <button onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--border-soft)' }}>
                <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ── CAMPUS OVERVIEW ROW ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Activity size={18}/>, label: 'Occupancy Rate', val: `${stats.occupancyRate}%`, sub: 'of 220 slots', color: '#22d3ee' },
            { icon: <CheckCircle2 size={18}/>, label: 'Available Slots', val: stats.availableSlots, sub: 'Open now', color: '#4ade80' },
            { icon: <Car size={18}/>, label: 'Occupied Slots', val: stats.occupiedSlots, sub: 'Vehicles parked', color: '#f87171' },
            { icon: <TrendingUp size={18}/>, label: 'Peak Hour', val: stats.peakHour, sub: 'Sun–Thu forecast', color: '#fb923c' },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card p-5 relative overflow-hidden">
              <CardBgPattern label={s.label} color={s.color} />
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${s.color}15`, color: s.color }}>
                {s.icon}
              </div>
              <p className="text-2xl font-black" style={{ color: s.color, fontFamily: 'Outfit, sans-serif' }}>{s.val}</p>
              <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>{s.label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* ── CATEGORY CARDS WITH RING ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: `${color}15`, color }}>
                        {icons[cat]}
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>{cat} Parking</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{basements[cat]}</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <OccupancyRing pct={pct} color={color} size={72} />
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
                      <p className="text-lg font-black" style={{ color: m.color, fontFamily: 'Outfit, sans-serif' }}>{m.val}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{m.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── FLOOR SELECTOR ── */}
        <BasementFloorSelector selected={basement} onChange={setBasement} />

        {/* ── MAIN CONTENT AREA ── */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div key="overview"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {(basement === 'All' ? zones : zones.filter(z => z.basement === basement)).map((zone, i) => (
                <ZoneCard key={zone.id} zone={zone} delay={i * 0.05} />
              ))}
            </motion.div>
          ) : (
            <motion.div key="slots"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Legend */}
              <div className="flex items-center gap-6 mb-4 px-1">
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span className="w-5 h-3.5 rounded-sm inline-block" style={{ background: 'rgba(74,222,128,0.2)', border: '1px solid rgba(74,222,128,0.5)' }} />
                  Available
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span className="w-5 h-3.5 rounded-sm inline-block" style={{ background: 'rgba(248,113,113,0.2)', border: '1px solid rgba(248,113,113,0.4)' }} />
                  Occupied
                </div>
                <p className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>Each block = 1 parking slot</p>
              </div>
              <SlotGrid zones={zones} basement={basement} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
