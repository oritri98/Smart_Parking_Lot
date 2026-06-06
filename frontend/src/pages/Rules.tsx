import { motion } from 'framer-motion';
import {
  GraduationCap, Users, UserCheck, Car, Shield, AlertTriangle,
  Clock, BookOpen, Info, Truck
} from 'lucide-react';
import { PageHeader } from '../components/index';

interface RuleSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  badge?: string;
  rules: string[];
}

const ruleSections: RuleSection[] = [
  {
    id: 'student',
    title: 'Student Parking Rules',
    icon: <GraduationCap size={22} />,
    color: '#22d3ee',
    badge: 'Basement 1 (B1)',
    rules: [
      'Only registered AUST student vehicles with valid parking stickers are permitted in B1 Student Parking Zone.',
      'Motorcycles and bicycles must be parked in designated areas only. Four-wheelers require prior registration.',
      'No vehicle may occupy more than one parking slot at any time.',
      'Students must display their AUST student ID-linked parking permit visibly on the dashboard.',
      'Vehicles must not be left overnight without prior approval from the Proctor\'s Office.',
      'Parking in faculty or guest zones is strictly prohibited and subject to disciplinary action.',
      'Vehicles found blocking access lanes or emergency exits will be towed at the owner\'s expense.',
      'Speed limit inside the basement is 10 km/h. Reckless driving will lead to parking privileges being revoked.',
      'Students are responsible for the security of their own vehicles. AUST is not liable for theft or damage.',
    ],
  },
  {
    id: 'faculty',
    title: 'Faculty Parking Rules',
    icon: <Users size={22} />,
    color: '#4ade80',
    badge: 'Basement 2 (B2)',
    rules: [
      'Faculty and academic staff with valid AUST-issued parking permits may park in the B2 Faculty Zone.',
      'Faculty parking permits are non-transferable and must be renewed each semester.',
      'Faculty members must report lost or stolen parking permits to the ICT Center immediately.',
      'Parking privileges may be suspended for repeated violations or misuse of permit.',
      'Faculty vehicles must not encroach on Guest & Visitor spaces in B2.',
      'Administrative and support staff are allocated dedicated spaces within the Faculty Zone.',
      'Faculty members working late (after 7:00 PM) must inform Campus Security to ensure gate access.',
      'Reserved spots near the B2 elevator are designated for senior faculty and faculty with mobility needs.',
    ],
  },
  {
    id: 'guest',
    title: 'Guest & Visitor Parking Rules',
    icon: <UserCheck size={22} />,
    color: '#a78bfa',
    badge: 'Basement 2 (B2)',
    rules: [
      'Guest and visitor parking is available in the designated Guest Zone in Basement 2 (B2).',
      'Visitors must register at the main gate and obtain a temporary visitor parking pass.',
      'Guest parking is limited to a maximum of 4 hours unless a special extension is granted by the Proctor\'s Office.',
      'Commercial vehicles, delivery vans, and large trucks must use the university\'s designated delivery area — not B2 Guest Zone.',
      'Visitors accompanying official university delegations will be allocated reserved visitor slots.',
      'Unregistered vehicles detected by the system will be automatically classified as Guest & Visitor vehicles.',
      'Visitor parking is only available during campus operating hours: Sunday–Thursday, 7:30 AM – 9:00 PM.',
    ],
  },
  {
    id: 'waiting-room',
    title: 'Driver Waiting Room Guidelines',
    icon: <Car size={22} />,
    color: '#fb923c',
    badge: 'Both Floors',
    rules: [
      'Driver waiting rooms are located in the basement area of both B1 and B2.',
      'Waiting rooms are exclusively for vehicle drivers while the vehicle owner is on campus.',
      'Drivers may not remain in vehicles parked in active parking zones. Use of designated waiting rooms is mandatory.',
      'Mobile devices may be used in waiting rooms. Noise levels must be kept low.',
      'Drivers must not leave the waiting room area without notifying the vehicle owner.',
      'Access to the main campus building from waiting rooms is not permitted without security authorization.',
    ],
  },
  {
    id: 'transport',
    title: 'University Transport Pool Guidelines',
    icon: <Truck size={22} />,
    color: '#60a5fa',
    badge: 'Separate Designated Area',
    rules: [
      'University transport pool vehicles (buses, minivans) park in the designated University Transport Pool area — separate from B1/B2.',
      'Transport pool drivers are under direct supervision of the Office of the University Engineer.',
      'All university transport vehicles must display official AUST fleet registration plates.',
      'Scheduling and dispatch of transport pool vehicles is managed by the university administration.',
      'Private vehicles must not use the transport pool area under any circumstances.',
    ],
  },
  {
    id: 'safety',
    title: 'Safety Instructions',
    icon: <Shield size={22} />,
    color: '#f472b6',
    rules: [
      'Always wear a seatbelt when driving inside the basement structure.',
      'Headlights must be on at all times when driving in the basement.',
      'Do not use mobile phones while driving inside the basement.',
      'Keep children and pedestrians away from moving vehicles.',
      'In case of fire, immediately evacuate via marked fire exits. Do not use elevators.',
      'Hazardous materials must never be stored or left inside the basement parking area.',
      'Report any structural damage, oil spills, or suspicious items to Campus Security immediately.',
      'Smoking is strictly prohibited in all basement areas.',
    ],
  },
  {
    id: 'emergency',
    title: 'Emergency Information',
    icon: <AlertTriangle size={22} />,
    color: '#f87171',
    rules: [
      'Emergency exit routes are clearly marked with fluorescent signage in both basements.',
      'Fire extinguishers are positioned at regular intervals throughout B1 and B2.',
      'In case of medical emergency, contact Campus Security immediately: call security post.',
      'Emergency assembly point is located at the main courtyard in front of the AUST main building.',
      'CCTV cameras will monitor all emergency exits. Tampering with safety equipment is a criminal offense.',
      'Emergency power backup (UPS) ensures lighting and signage remain operational during power cuts.',
    ],
  },
  {
    id: 'etiquette',
    title: 'Parking Etiquette',
    icon: <BookOpen size={22} />,
    color: '#fbbf24',
    rules: [
      'Always park within designated slot boundaries. Misparked vehicles will be ticketed.',
      'Be courteous to other drivers. Do not block traffic lanes while waiting for a slot.',
      'Turn off your engine promptly upon parking. Do not idle in the basement.',
      'Report vacant but reserved spots to the AUST-IPMS system to help maintain accurate availability data.',
      'Respect zones — student, faculty, and guest areas are strictly segregated.',
      'Keep the basement clean. Do not litter or leave waste in or around your vehicle.',
      'In peak hours (9:30–11:00 AM, 1:00–2:30 PM), follow queuing discipline at the entry gate.',
    ],
  },
];

export default function Rules() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Rules & Guidelines"
        subtitle="Official parking regulations for AUST's two-basement campus parking facility."
        badge="Campus Parking Policy"
      />

      {/* Official notice */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl"
          style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}>
          <div className="flex items-start gap-3">
            <Info size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Official Notice:</strong> Parking regulations at AUST are enforced in coordination with the{' '}
              <strong className="text-red-300">Office of the Proctor</strong> and the{' '}
              <strong className="text-red-300">Campus Safety Division</strong>.
              Violations are subject to disciplinary action under university policies, including but not limited to
              suspension of parking privileges, formal warnings, and referral to the Disciplinary Committee.
            </p>
          </div>
        </motion.div>

        {/* Operating hours */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 p-4 rounded-2xl flex items-center gap-3"
          style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.15)' }}>
          <Clock size={16} className="text-cyan-400 flex-shrink-0" />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Operating Hours:</span>{' '}
            Sunday – Thursday, 7:30 AM – 9:00 PM. The parking facility is closed on Friday and Saturday.
          </p>
        </motion.div>
      </div>

      {/* Rules sections */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="space-y-6">
          {ruleSections.map((section, i) => (
            <motion.div
              key={section.id}
              id={`rules-${section.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card overflow-hidden"
            >
              {/* Section header */}
              <div className="px-6 py-4 flex items-center justify-between"
                style={{ borderBottom: `1px solid ${section.color}18`, background: `${section.color}06` }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${section.color}15`, color: section.color }}>
                    {section.icon}
                  </div>
                  <h2 className="font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>{section.title}</h2>
                </div>
                {section.badge && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{ background: `${section.color}12`, color: section.color, border: `1px solid ${section.color}30` }}>
                    {section.badge}
                  </span>
                )}
              </div>

              {/* Rules list */}
              <div className="px-6 py-5">
                <ol className="space-y-3">
                  {section.rules.map((rule, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}>
                      <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                        style={{ background: `${section.color}15`, color: section.color }}>
                        {j + 1}
                      </span>
                      {rule}
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 p-5 rounded-2xl text-center"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            These guidelines are issued in coordination with the{' '}
            <span style={{ color: 'var(--text-secondary)' }}>Office of the Proctor</span>,{' '}
            <span style={{ color: 'var(--text-secondary)' }}>Office of the University Engineer</span>, and{' '}
            <span style={{ color: 'var(--text-secondary)' }}>Campus Safety Division</span> of{' '}
            Ahsanullah University of Science and Technology.
            Rules are subject to revision in alignment with university policy updates.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
