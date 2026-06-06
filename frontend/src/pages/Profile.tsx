import { User } from 'lucide-react';
import { PageHeader, ComingSoonCard } from '../components/index';

export default function Profile() {
  return (
    <div className="min-h-screen">
      <PageHeader title="User Profile" subtitle="Manage your vehicle registrations, parking history, and preferences." badge="Coming Soon" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <ComingSoonCard
          title="User Profile Module — Coming Soon"
          description="The profile module will allow registered users to manage their vehicles, view parking history, and set notification preferences."
          phase="Coming Soon"
          icon={<User size={36} />}
          features={[
            'Personal Information',
            'Vehicle Registration',
            'Parking History & Logs',
            'Saved Vehicles',
            'Notification Preferences',
            'Zone Access History',
            'Payment Records (Future)',
            'Profile Picture Upload',
          ]}
        />

        {/* Mock vehicle card */}
        <div className="card p-6 mt-8 opacity-60">
          <p className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Sample Registered Vehicle Preview</p>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="font-bold text-lg" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                DHAKA METRO GA-11-1234
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Tejgaon Area Series</p>
            </div>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold border"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)', borderColor: 'var(--border-soft)' }}>
                Student Vehicle
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold border status-available">
                Registered
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 text-sm" style={{ borderTop: '1px solid var(--border-soft)' }}>
            <div><p className="text-xs" style={{ color: 'var(--text-muted)' }}>Zone</p><p style={{ color: 'var(--text-secondary)' }}>B1 — Student</p></div>
            <div><p className="text-xs" style={{ color: 'var(--text-muted)' }}>Category</p><p style={{ color: 'var(--text-secondary)' }}>Student</p></div>
            <div><p className="text-xs" style={{ color: 'var(--text-muted)' }}>Status</p><p style={{ color: '#16a34a', fontWeight: 600 }}>Active</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
