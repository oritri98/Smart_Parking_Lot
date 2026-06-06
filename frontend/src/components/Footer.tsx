import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-soft)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(145deg, #0c1e3a, #0d3554)',
                  border: '1.5px solid rgba(34,211,238,0.4)',
                  boxShadow: '0 0 18px rgba(34,211,238,0.15)',
                }}>
                <Logo size="24" />
              </div>
              <div>
                <p className="font-bold text-sm" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>AUST-IPMS</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              Intelligent Parking Management System for Ahsanullah University of Science and Technology.
              Smarter Campus Mobility.
            </p>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg inline-flex"
              style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-medium">System Operational</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', path: '/' },
                { label: 'Parking Status', path: '/parking-status' },
                { label: 'Analytics Dashboard', path: '/analytics' },
                { label: 'Camera Monitoring', path: '/camera' },
                { label: 'Rules & Guidelines', path: '/rules' },
                { label: 'About', path: '/about' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path}
                    className="text-sm transition-colors flex items-center gap-1"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
                    <span className="w-1 h-1 rounded-full" style={{ background: 'var(--accent)', opacity: 0.5 }} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Parking Zones */}
          <div>
            <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Parking Zones</h3>
            <ul className="space-y-3">
              <li>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: '#22d3ee' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Basement 1 (B1)</span>
                </div>
                <p className="text-xs ml-4" style={{ color: 'var(--text-muted)' }}>Student Parking Zone — 140 slots</p>
              </li>
              <li>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: '#4ade80' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Basement 2 (B2)</span>
                </div>
                <p className="text-xs ml-4" style={{ color: 'var(--text-muted)' }}>Faculty Zone — 50 slots</p>
                <p className="text-xs ml-4" style={{ color: 'var(--text-muted)' }}>Guest & Visitor Zone — 30 slots</p>
              </li>
            </ul>
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-soft)' }}>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <Clock size={13} />
                <span>Sun – Thu · 7:30 AM – 9:00 PM</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Contact</h3>
            <ul className="space-y-3">
              <li className="flex gap-2.5">
                <MapPin size={15} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                <span className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  141 & 142, Love Road, Tejgaon Industrial Area, Dhaka-1208, Bangladesh
                </span>
              </li>
              <li className="flex gap-2.5">
                <Phone size={15} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>(8802) 8870422 — Ext. 107, 114</span>
              </li>
              <li className="flex gap-2.5">
                <Mail size={15} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>info@aust.edu</span>
              </li>
              <li>
                <a href="https://www.aust.edu" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm transition-colors"
                  style={{ color: 'var(--accent)' }}>
                  <ExternalLink size={13} />
                  www.aust.edu
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border-soft)' }}>
          <div className="flex flex-col sm:flex-row items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>© {currentYear} Ahsanullah University of Science and Technology.</span>
            <span className="hidden sm:block">·</span>
            <span>AUST Intelligent Parking Management System.</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2 py-1 rounded-full"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--border-soft)' }}>
              v1.0.0
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: '#2e7d32' }} title="AUST Green" />
              <span className="w-2 h-2 rounded-full" style={{ background: '#f57c00' }} title="AUST Orange" />
              <span className="w-2 h-2 rounded-full" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.2)' }} title="AUST Black" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
