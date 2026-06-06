import { motion } from 'framer-motion';
import { Bell, AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { PageHeader, ComingSoonCard } from '../components/index';
import { mockNotifications } from '../data/mockData';

const iconMap = {
  alert: <AlertTriangle size={16} className="text-red-400" />,
  warning: <AlertCircle size={16} className="text-orange-400" />,
  info: <Info size={16} className="text-blue-400" />,
  success: <CheckCircle size={16} className="text-green-400" />,
};

export default function Notifications() {
  return (
    <div className="min-h-screen">
      <PageHeader title="Notifications" subtitle="Real-time alerts, warnings, and campus parking announcements." badge="Coming Soon" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <ComingSoonCard
          title="Notifications Center — Coming Soon"
          description="The intelligent notification system will send real-time push alerts for parking events, security issues, and Proctor's Office announcements."
          phase="Coming Soon"
          icon={<Bell size={36} />}
          features={[
            'Parking Zone Full Alerts',
            'Basement Congestion Warnings',
            'Maintenance Notices',
            "Proctor's Office Announcements",
            'Security Alerts',
            'Campus Event Parking Notices',
            'Daily Summary Reports',
            'Push Notification Support',
          ]}
        />

        {/* Mock notifications */}
        <div className="mt-8">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-4">Sample Notifications Preview</p>
          <div className="space-y-3">
            {mockNotifications.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 0.7, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="card p-4 flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                  {iconMap[n.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                    {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{n.message}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    {n.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    {n.zone && ` · Zone ${n.zone}`}
                  </p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded flex-shrink-0"
                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border-soft)' }}>
                  {n.category}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
