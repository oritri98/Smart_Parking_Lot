import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, LineChart, Line
} from 'recharts';
import {
  Car, TrendingUp, Clock, Activity, Brain, Layers,
  BookOpen
} from 'lucide-react';
import { PageHeader, StatCard, ChartCard, SimulatedBadge } from '../components/index';
import { analyticsService } from '../services/analyticsService';
import type { DashboardStats, HourlyData, DailyData, WeeklyComparison } from '../types';

const chartTooltipStyle = {
  contentStyle: {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-soft)',
    borderRadius: 10,
    color: 'var(--text-primary)',
    fontSize: 12,
  },
  itemStyle: { color: 'var(--text-secondary)' },
};

export default function Analytics() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyComparison[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [s, h, d, w] = await Promise.all([
        analyticsService.getDashboardStats(),
        analyticsService.getHourlyData(),
        analyticsService.getDailyData(),
        analyticsService.getWeeklyComparison(),
      ]);
      setStats(s);
      setHourlyData(h);
      setDailyData(d);
      setWeeklyData(w);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: 'var(--border-soft)', borderTopColor: 'var(--accent)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Analytics Dashboard"
        subtitle="Parking insights, occupancy trends, and AI-powered demand predictions for AUST campus."
        badge="Data Intelligence"
      />

      {/* Simulated data notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: 'rgba(192,132,252,0.06)', border: '1px solid rgba(192,132,252,0.2)' }}>
          <Brain size={16} className="text-purple-400 flex-shrink-0" />
          <p className="text-sm text-slate-300">
            <span className="text-purple-400 font-semibold">Predicted data is clearly marked with a </span>
            <SimulatedBadge className="mx-1" />
            <span className="text-purple-400 font-semibold"> badge. ML models are not yet deployed. All AI predictions are simulated.</span>
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Total Vehicles Today" value={stats!.totalVehiclesToday} icon={<Car size={18} />} color="#22d3ee" delay={0} />
          <StatCard label="Current Occupancy" value={`${stats!.occupancyRate}%`} icon={<Activity size={18} />} color="#fb923c" delay={0.05} />
          <StatCard label="Peak Hour Today" value="9:30 AM" icon={<Clock size={18} />} color="#60a5fa" delay={0.1} />
          <StatCard label="Avg. Utilization" value={`${stats!.averageUtilization}%`} icon={<TrendingUp size={18} />} color="#4ade80" delay={0.15} />
          <StatCard label="Predicted Demand" value={`${stats!.predictedDemand}%`} icon={<Brain size={18} />} color="#c084fc" isSimulated delay={0.2} />
          <StatCard label="Active Zones" value={stats!.activeZones} icon={<Layers size={18} />} color="#f472b6" delay={0.25} />
        </div>
      </div>

      {/* Charts grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 mb-12">

        {/* Hourly Occupancy Trends */}
        <ChartCard
          title="Hourly Occupancy Trends"
          subtitle="Vehicle occupancy by zone — Sunday–Thursday, 7:30 AM to 9:00 PM"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={hourlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="studentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="facultyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="guestGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...chartTooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
              <Area type="monotone" dataKey="student" name="Student (B1)" stroke="#22d3ee" strokeWidth={2} fill="url(#studentGrad)" />
              <Area type="monotone" dataKey="faculty" name="Faculty (B2)" stroke="#4ade80" strokeWidth={2} fill="url(#facultyGrad)" />
              <Area type="monotone" dataKey="guest" name="Guest & Visitor (B2)" stroke="#a78bfa" strokeWidth={2} fill="url(#guestGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Daily Usage + Zone Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Daily Usage Trends"
            subtitle="Occupancy percentage per zone — Sunday to Thursday"
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dailyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip {...chartTooltipStyle} formatter={(v: any) => [`${v}%`]} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
                <Bar dataKey="student" name="Student" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                <Bar dataKey="faculty" name="Faculty" fill="#4ade80" radius={[4, 4, 0, 0]} />
                <Bar dataKey="guest" name="Guest" fill="#a78bfa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Weekly Comparison"
            subtitle="This week vs. last week vs. AI prediction"
            isSimulated
          >
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={weeklyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip {...chartTooltipStyle} formatter={(v: any) => [`${v}%`]} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
                <Line type="monotone" dataKey="thisWeek" name="This Week" stroke="#22d3ee" strokeWidth={2} dot={{ fill: '#22d3ee', r: 4 }} />
                <Line type="monotone" dataKey="lastWeek" name="Last Week" stroke="#4ade80" strokeWidth={2} dot={{ fill: '#4ade80', r: 4 }} />
                <Line type="monotone" dataKey="predicted" name="Predicted (Simulated)" stroke="#c084fc" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#c084fc', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Zone Utilization bars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Student Parking (B1)', pct: 84, color: '#22d3ee', slots: '118 / 140', desc: 'Basement 1 — Primary student zone' },
            { label: 'Faculty Parking (B2)', pct: 66, color: '#4ade80', slots: '33 / 50', desc: 'Basement 2 — Faculty designated zone' },
            { label: 'Guest & Visitor (B2)', pct: 70, color: '#a78bfa', slots: '21 / 30', desc: 'Basement 2 — Guest & visitor zone' },
          ].map((z, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card p-6"
            >
              <h3 className="font-bold text-sm mb-1" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>{z.label}</h3>
              <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>{z.desc}</p>
              <div className="flex items-end gap-3 mb-3">
                <span className="text-3xl font-bold" style={{ color: z.color, fontFamily: 'Outfit, sans-serif' }}>{z.pct}%</span>
                <span className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{z.slots} occupied</span>
              </div>
              <div className="h-3 rounded-full" style={{ background: 'var(--bg-elevated)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${z.pct}%` }}
                  transition={{ duration: 1.2, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${z.color}60, ${z.color})` }}
                />
              </div>
            </motion.div>
          ))}
        </div>


        {/* Operating Schedule info */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen size={20} className="text-cyan-400" />
            <h3 className="font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>AUST Operating Schedule</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'].map((day) => (
              <div key={day} className="text-center p-3 rounded-xl"
                style={{ background: 'var(--accent-soft)', border: '1px solid var(--border-soft)' }}>
                <p style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.875rem', fontFamily: 'Outfit, sans-serif' }}>{day.slice(0, 3)}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  {day === 'Thursday' ? 'Short day' : 'Full day'}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3 text-center">Peak hours: 9:30–11:00 AM and 1:00–2:30 PM · Low activity: Before 8:00 AM and after 7:00 PM</p>
        </div>
      </div>
    </div>
  );
}
