import { LogIn, Shield, GraduationCap, Users, Settings } from 'lucide-react';
import { PageHeader, ComingSoonCard } from '../components/index';

export default function Login() {
  return (
    <div className="min-h-screen">
      <PageHeader title="Authentication" subtitle="Secure login portal for all AUST-IPMS users." badge="Coming Soon" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <ComingSoonCard
          title="Authentication Module — Coming Soon"
          description="The secure login system for AUST-IPMS is planned for future deployment. It will support multiple user roles with role-based access control aligned with AUST governance."
          phase="Coming Soon"
          icon={<LogIn size={36} />}
          features={[
            'Student Login (Student ID)',
            'Faculty Login (Employee ID)',
            'Security Personnel Login',
            'Administrator Login',
            "Proctor's Office Access",
            'Two-Factor Authentication',
            'Session Management',
            'Password Recovery',
          ]}
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {[
            { icon: <GraduationCap size={20} />, label: 'Student', color: '#22d3ee' },
            { icon: <Users size={20} />, label: 'Faculty', color: '#4ade80' },
            { icon: <Shield size={20} />, label: 'Security', color: '#fb923c' },
            { icon: <Settings size={20} />, label: 'Admin', color: '#c084fc' },
          ].map(r => (
            <div key={r.label} className="card p-4 text-center opacity-50">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{ background: `${r.color}12`, color: r.color }}>
                {r.icon}
              </div>
              <p className="text-sm text-slate-400">{r.label}</p>
              <p className="text-xs text-slate-600 mt-1">Disabled</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
