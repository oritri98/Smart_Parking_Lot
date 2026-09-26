import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, AlertCircle, Trash2, Eye } from 'lucide-react';
import { PageHeader } from '../components/index';
import { useAuth } from '../context/AuthContext';
import { mockNotifications } from '../data/mockData';
import type { Notification } from '../types';

const iconMap = {
  alert: <AlertTriangle size={16} style={{ color: '#f87171' }} />,
  warning: <AlertCircle size={16} style={{ color: '#fb923c' }} />,
  info: <Info size={16} style={{ color: '#60a5fa' }} />,
  success: <CheckCircle size={16} style={{ color: '#4ade80' }} />,
};

const colorMap = {
  alert: { bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)', color: '#f87171' },
  warning: { bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.3)', color: '#fb923c' },
  info: { bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.3)', color: '#60a5fa' },
  success: { bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.3)', color: '#4ade80' },
};

type FilterType = 'all' | 'unread' | 'parking' | 'security' | 'maintenance' | 'proctor' | 'announcement';

export default function Notifications() {
  const { isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.isRead;
    return n.category === filter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const dismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const FILTER_TABS: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: `Unread (${unreadCount})` },
    { id: 'parking', label: 'Parking' },
    { id: 'security', label: 'Security' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'proctor', label: "Proctor's Office" },
    { id: 'announcement', label: 'Announcements' },
  ];

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Notifications & Alerts"
        subtitle="Real-time campus parking alerts, security notices, and Proctor's Office announcements."
        badge={unreadCount > 0 ? `${unreadCount} Unread` : 'All Clear'}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {FILTER_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0"
                style={filter === tab.id
                  ? { background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--border-hover)' }
                  : { color: 'var(--text-muted)', border: '1px solid transparent' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className="text-xs px-3 py-1.5 rounded-lg font-semibold flex-shrink-0 ml-2"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
              Mark all read
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((n, i) => {
              const c = colorMap[n.type];
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15, height: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`card p-4 flex items-start gap-3 transition-all ${!n.isRead ? 'border-l-2' : ''}`}
                  style={!n.isRead ? { borderLeftColor: 'var(--accent)' } : {}}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                    {iconMap[n.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                      {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />}
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{n.message}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {(n.timestamp instanceof Date ? n.timestamp : new Date(n.timestamp)).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {n.zone && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>Zone {n.zone}</span>}
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: c.bg, color: c.color }}>{n.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!n.isRead && (
                      <button onClick={() => markRead(n.id)} title="Mark as read"
                        className="p-1.5 rounded-lg transition-all" style={{ color: 'var(--accent)', background: 'var(--accent-soft)' }}>
                        <Eye size={13} />
                      </button>
                    )}
                    <button onClick={() => dismiss(n.id)} title="Dismiss"
                      className="p-1.5 rounded-lg transition-all" style={{ color: '#f87171', background: 'rgba(248,113,113,0.1)' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-16 card">
              <CheckCircle size={36} className="mx-auto mb-3" style={{ color: '#4ade80' }} />
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>All clear!</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>No notifications in this category.</p>
            </motion.div>
          )}
        </div>

        {!isLoggedIn && (
          <div className="mt-6 p-4 rounded-xl text-center" style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.15)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Login as admin to manage, send, and configure notifications for the entire campus.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
