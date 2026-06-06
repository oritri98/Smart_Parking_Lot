import { Settings, Users, Camera, BarChart3, Bell, Database, Shield, Cpu, Lock } from 'lucide-react';
import { PageHeader, ComingSoonCard } from '../components/index';

const disabledWidgets = [
  { icon: <Users size={18} />, label: 'User & Vehicle Management', color: '#22d3ee' },
  { icon: <Shield size={18} />, label: 'Zone Management (B1/B2)', color: '#4ade80' },
  { icon: <Camera size={18} />, label: 'Camera Monitoring Controls', color: '#fb923c' },
  { icon: <Cpu size={18} />, label: 'ML Prediction Controls', color: '#c084fc' },
  { icon: <BarChart3 size={18} />, label: 'Analytics Management', color: '#60a5fa' },
  { icon: <Bell size={18} />, label: 'Notification Controls', color: '#f472b6' },
  { icon: <Database size={18} />, label: 'System Logs & Audit', color: '#fbbf24' },
  { icon: <Lock size={18} />, label: "Proctor's Office Panel", color: '#f87171' },
];

export default function AdminPanel() {
  return (
    <div className="min-h-screen">
      <PageHeader title="Administrative Control Center" subtitle="Centralized management interface for AUST-IPMS administrators and university governance." badge="Coming Soon" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <ComingSoonCard
          title="Admin Control Center — Coming Soon"
          description="The comprehensive administrative dashboard will provide full control over all AUST-IPMS modules, integrated with university governance systems."
          phase="Coming Soon"
          icon={<Settings size={36} />}
          features={[
            'User & Vehicle Management',
            'Parking Zone Management',
            'Driver Waiting Room Control',
            'University Transport Pool',
            'Camera Monitoring Controls',
            'ML Prediction Management',
            'Analytics & Reporting',
            'Security Office Dashboard',
            "Proctor's Office Integration",
            'System Logs & Audit Trail',
          ]}
        />

        {/* Disabled dashboard widgets */}
        <div className="mt-10">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-5">Administrative Dashboard Preview — All modules disabled</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {disabledWidgets.map((w, i) => (
              <div key={i} className="card p-5 opacity-40 cursor-not-allowed">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${w.color}12`, color: w.color }}>
                  {w.icon}
                </div>
                <p className="text-slate-300 text-xs font-medium leading-tight mb-2">{w.label}</p>
                <div className="skeleton h-2 rounded mb-1.5" />
                <div className="skeleton h-2 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>

        {/* Governance note */}
        <div className="mt-8 p-5 rounded-2xl"
          style={{ background: 'rgba(34,211,238,0.04)', border: '1px solid rgba(34,211,238,0.12)' }}>
          <p className="text-slate-400 text-sm text-center leading-relaxed">
            The Admin Panel will operate under authorization from the{' '}
            <strong className="text-slate-200">Office of the Proctor</strong>,{' '}
            <strong className="text-slate-200">Office of the University Engineer</strong>, and{' '}
            <strong className="text-slate-200">ICT Center — AUST</strong>.
            Role-based access control will ensure appropriate permissions for each administrative function.
          </p>
        </div>
      </div>
    </div>
  );
}
