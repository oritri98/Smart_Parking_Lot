import { motion } from 'framer-motion';
import {
  MapPin, ExternalLink, BookOpen, Building2, Globe, Phone,
  Mail, Target, Lightbulb, CheckCircle2, GraduationCap, Cpu, Code2
} from 'lucide-react';
import { PageHeader } from '../components/index';

const faculties = [
  {
    name: 'Faculty of Engineering',
    color: '#22d3ee',
    programs: ['B.Sc. in Civil Engineering', 'M.Sc. in Civil Engineering', 'B.Sc. in Computer Science & Engineering', 'B.Sc. in Electrical & Electronic Engineering', 'M.Sc. in EEE', 'B.Sc. in Textile Engineering', 'B.Sc. in Industrial & Production Engineering', 'B.Sc. in Mechanical Engineering', 'M.Sc. in Mathematics'],
  },
  {
    name: 'Faculty of Architecture & Planning',
    color: '#4ade80',
    programs: ['Bachelor of Architecture', 'Master of Architecture'],
  },
  {
    name: 'Faculty of Business & Social Sciences',
    color: '#fb923c',
    programs: ['Bachelor of Business Administration (BBA)', 'Master of Business Administration (MBA)'],
  },
  {
    name: 'Faculty of Education',
    color: '#a78bfa',
    programs: ['Master of Education (M.Ed.)'],
  },
];

const keyOffices = [
  { name: 'Office of the Vice-Chancellor', url: 'https://www.aust.edu/administration/offices/office_of_the_vice_chancellor' },
  { name: 'Office of the Proctor', url: 'https://www.aust.edu/administration/offices/office_of_the_proctor' },
  { name: 'Office of the University Engineer', url: 'https://www.aust.edu/administration/offices/office_of_the_university_engineer' },
  { name: 'ICT Center', url: 'http://ictcenter.aust.edu/' },
  { name: 'Office of the Registrar', url: 'https://www.aust.edu/administration/offices/office_of_the_registrar' },
  { name: 'Kazi Fazlur Rahman Library', url: 'https://www.aust.edu/administration/offices/kazi_fazlur_rahman_library' },
  { name: 'IQAC', url: 'https://www.aust.edu/administration/offices/institutional_quality_assurance_cell_(iqac)' },
  { name: 'Research & Publication Office', url: 'https://www.aust.edu/rpo' },
];

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

export default function About() {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Ahsanullah University of Science & Technology"
        subtitle="Transforming the society through innovation, creation, and leadership — since 1995."
        badge="About AUST"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 pb-16">

        {/* ── UNIVERSITY AT A GLANCE ─── */}
        <motion.div {...fadeUp} className="card overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid var(--border-soft)', background: 'var(--bg-elevated)' }}>
            <div className="flex items-center gap-3">
              <Building2 size={18} style={{ color: 'var(--accent)' }} />
              <h2 className="font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                Ahsanullah University of Science & Technology (AUST)
              </h2>
            </div>
            <a href="https://www.aust.edu" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs transition-colors"
              style={{ color: 'var(--accent)' }}>
              <ExternalLink size={12} /> www.aust.edu
            </a>
          </div>
          <div className="p-6">
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
              The <strong style={{ color: 'var(--text-primary)' }}>Ahsanullah University of Science and Technology (AUST)</strong> was
              founded by the <strong style={{ color: 'var(--text-primary)' }}>Dhaka Ahsania Mission</strong> in{' '}
              <strong style={{ color: 'var(--text-primary)' }}>1995</strong>, named after Khan Bahadur Ahsanullah (1873–1965) —
              an outstanding educationist and social reformer. AUST is a private science and technology university offering
              undergraduate and postgraduate programs across Engineering, Architecture, Business, and Education, serving
              thousands of students and producing graduates ready for national and global impact.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Founded', value: '1995', color: '#22d3ee' },
                { label: 'Campus Area', value: '1.5 Acres', color: '#4ade80' },
                { label: 'Location', value: 'Dhaka', color: '#fb923c' },
                { label: 'Type', value: 'Private', color: '#a78bfa' },
              ].map(s => (
                <div key={s.label} className="text-center p-4 rounded-xl"
                  style={{ background: `${s.color}08`, border: `1px solid ${s.color}18` }}>
                  <p className="text-xl font-bold mb-1" style={{ color: s.color, fontFamily: 'Outfit, sans-serif' }}>{s.value}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-start gap-2">
                <MapPin size={15} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                <span style={{ color: 'var(--text-secondary)' }}>141 & 142, Love Road, Tejgaon Industrial Area, Dhaka-1208, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span style={{ color: 'var(--text-secondary)' }}>(8802) 8870422 — Ext. 107, 114 &nbsp;|&nbsp; Fax: (8802) 8870418</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span style={{ color: 'var(--text-secondary)' }}>info@aust.edu &nbsp;|&nbsp; regr@aust.edu</span>
              </div>
            </div>
          </div>
        </motion.div>


        {/* ── VISION / MISSION ─── */}
        <motion.div {...fadeUp} transition={{ delay: 0.08 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                <Globe size={18} />
              </div>
              <h3 className="font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>Vision</h3>
            </div>
            <p className="text-sm leading-relaxed italic" style={{ color: 'var(--text-secondary)' }}>
              "Transforming the society through innovation, creation, and leadership."
            </p>
            <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>— Official AUST Vision Statement</p>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>
                <Target size={18} />
              </div>
              <h3 className="font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>Mission</h3>
            </div>
            <ul className="space-y-2">
              {[
                'Develop human capital to meet the ever-changing needs of society in Bangladesh and beyond.',
                'Produce competent graduates imbued with ethical values, knowledge and skills.',
                'Create entrepreneurs and leaders who can promote a sustainable future.',
              ].map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={13} className="mt-0.5 flex-shrink-0" style={{ color: '#4ade80' }} />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* ── FACULTIES ─── */}
        <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa' }}>
              <GraduationCap size={18} />
            </div>
            <h2 className="font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>Faculties & Academic Programs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {faculties.map((f) => (
              <div key={f.name} className="p-4 rounded-xl"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: f.color }} />
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{f.name}</p>
                </div>
                <ul className="space-y-1.5">
                  {f.programs.map((p, i) => (
                    <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                      <span className="mt-1 w-1 h-1 rounded-full flex-shrink-0" style={{ background: f.color }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── KEY OFFICES ─── */}
        <motion.div {...fadeUp} transition={{ delay: 0.12 }} className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(251,146,60,0.1)', color: '#fb923c' }}>
              <BookOpen size={18} />
            </div>
            <h2 className="font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>Key Administrative Offices</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {keyOffices.map((o) => (
              <a key={o.name} href={o.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 p-2.5 rounded-lg text-xs transition-colors"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', color: 'var(--text-secondary)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                <ExternalLink size={10} className="flex-shrink-0" />
                {o.name}
              </a>
            ))}
          </div>
        </motion.div>

        {/* ── ABOUT THE SYSTEM ─── */}
        <motion.div {...fadeUp} transition={{ delay: 0.14 }} className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
              <Cpu size={18} />
            </div>
            <h2 className="font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>Intelligent Parking Management System</h2>
          </div>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
            The <strong style={{ color: 'var(--text-primary)' }}>AUST Intelligent Parking Management System (AUST-IPMS)</strong> is
            a campus-wide digital infrastructure platform designed to modernize and streamline parking operations across AUST's
            two-basement parking facility. The system provides real-time occupancy visibility, analytics, and smart monitoring
            capabilities — aligned with the university's operating schedule of{' '}
            <strong style={{ color: 'var(--text-primary)' }}>Sunday through Thursday, 7:30 AM – 9:00 PM</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'B1 — Student Parking', slots: '140 Slots', color: '#22d3ee', desc: 'Registered AUST students only' },
              { label: 'B2 — Faculty Parking', slots: '50 Slots', color: '#4ade80', desc: 'Faculty & academic staff' },
              { label: 'B2 — Guest & Visitor', slots: '30 Slots', color: '#a78bfa', desc: 'Visitors & unregistered vehicles' },
            ].map(z => (
              <div key={z.label} className="p-4 rounded-xl"
                style={{ background: `${z.color}06`, border: `1px solid ${z.color}18` }}>
                <p className="text-sm font-bold mb-1" style={{ color: z.color }}>{z.label}</p>
                <p className="text-lg font-black" style={{ color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>{z.slots}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{z.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── TECHNOLOGY ─── */}
        <motion.div {...fadeUp} transition={{ delay: 0.16 }} className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa' }}>
              <Code2 size={18} />
            </div>
            <h2 className="font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>Technology Infrastructure</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {[
              ['React 18 + TypeScript', 'Frontend'],
              ['Vite Build Tool', 'Frontend'],
              ['Tailwind CSS v4', 'Frontend'],
              ['Framer Motion', 'Frontend'],
              ['Recharts', 'Data Visualization'],
              ['FastAPI (Python)', 'Backend'],
              ['PostgreSQL', 'Database'],
              ['OpenCV + YOLO', 'Computer Vision'],
              ['ANPR Engine', 'Vehicle Recognition'],
              ['WebSocket', 'Real-time Layer'],
            ].map(([name, cat]) => (
              <div key={name} className="p-2.5 rounded-lg"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)' }}>
                <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{cat}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── GOVERNANCE ─── */}
        <motion.div {...fadeUp} transition={{ delay: 0.18 }} className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>
              <CheckCircle2 size={18} />
            </div>
            <h2 className="font-bold" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>Governance & Oversight</h2>
          </div>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
            AUST-IPMS operates in full coordination with the following AUST administrative bodies to ensure compliance, security, and operational effectiveness:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              'Office of the Proctor',
              'Office of the University Engineer',
              'ICT Center, AUST',
              'Campus Safety Division',
            ].map(o => (
              <div key={o} className="p-3 rounded-xl text-center"
                style={{ background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.1)' }}>
                <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{o}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── IMPACT METRICS ─── */}
        <motion.div {...fadeUp} transition={{ delay: 0.20 }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: '220', label: 'Slots Monitored', sub: 'Basement 1 & 2', color: '#22d3ee' },
              { value: '40%', label: 'Less Search Time', sub: 'Target improvement', color: '#4ade80' },
              { value: '85%+', label: 'Accuracy Target', sub: 'Monitoring precision', color: '#a78bfa' },
              { value: '5 Days', label: 'Weekly Coverage', sub: 'Sunday – Thursday', color: '#fb923c' },
            ].map(s => (
              <div key={s.label} className="card p-5 text-center">
                <p className="text-2xl font-black mb-0.5" style={{ color: s.color, fontFamily: 'Outfit, sans-serif' }}>{s.value}</p>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{s.label}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── USEFUL LINKS ─── */}
        <motion.div {...fadeUp} transition={{ delay: 0.22 }} className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={16} className="text-yellow-400" />
            <h3 className="font-bold text-sm" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>Official AUST Resources</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ['AUST Website', 'https://www.aust.edu'],
              ['Academic Calendar', 'https://www.aust.edu/academics/academic_calendar'],
              ['Student Corner', 'https://www.aust.edu/students_corner'],
              ['ICT Center', 'http://ictcenter.aust.edu/'],
              ['Research & Publications', 'https://www.aust.edu/research_and_publications'],
              ['Library', 'https://www.aust.edu/library'],
              ['Campus Safety', 'https://www.aust.edu/campus/safety'],
              ['Notices', 'https://www.aust.edu/notice'],
            ].map(([label, url]) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--border-soft)' }}>
                <ExternalLink size={10} /> {label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
