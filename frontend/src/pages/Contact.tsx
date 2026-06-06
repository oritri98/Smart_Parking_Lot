import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Clock, Send, CheckCircle, ExternalLink } from 'lucide-react';
import { PageHeader } from '../components/index';
import type { ContactForm } from '../types';

const inputStyle = {
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-soft)',
  color: 'var(--text-primary)',
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '0.75rem',
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'border-color 0.2s',
} as React.CSSProperties;

export default function Contact() {
  const [form, setForm] = useState<ContactForm>({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Contact & Support"
        subtitle="Get in touch with the AUST-IPMS administration or reach the university directly."
        badge="Contact Us"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card p-8">
            <h2 className="font-bold text-xl mb-6" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
              Send a Message
            </h2>

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(74,222,128,0.12)' }}>
                  <CheckCircle size={32} className="text-green-400" />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                  Message Sent!
                </h3>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Thank you for your message. The AUST-IPMS team will review it and respond shortly.
                </p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="btn-secondary text-sm">
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--text-secondary)' }} htmlFor="contact-name">Full Name</label>
                    <input id="contact-name" type="text" required placeholder="Your full name"
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--text-secondary)' }} htmlFor="contact-email">Email Address</label>
                    <input id="contact-email" type="email" required placeholder="your@email.com"
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--text-secondary)' }} htmlFor="contact-subject">Subject</label>
                  <input id="contact-subject" type="text" required placeholder="What is your inquiry about?"
                    value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                    style={inputStyle} />
                </div>
                <div>
                  <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--text-secondary)' }} htmlFor="contact-message">Message</label>
                  <textarea id="contact-message" required rows={5}
                    placeholder="Describe your question or feedback in detail..."
                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{ ...inputStyle, resize: 'none' }} />
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Note: This contact form is for general inquiries about the AUST Parking Management System.
                </p>
                <button id="contact-submit-btn" type="submit" disabled={loading} className="btn-primary w-full justify-center">
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                  ) : (
                    <><Send size={16} /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">

            {/* System info */}
            <div className="card p-6">
              <h3 className="font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                System Information
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'System', value: 'AUST Intelligent Parking Management System' },
                  { label: 'University', value: 'Ahsanullah University of Science and Technology' },
                  { label: 'Location', value: 'Tejgaon Industrial Area, Dhaka-1208' },
                  { label: 'Version', value: 'v1.0.0' },
                ].map(item => (
                  <div key={item.label} className="flex gap-3 text-sm">
                    <span className="w-24 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{item.label}:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="card p-6">
              <h3 className="font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                University Contact
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <MapPin size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>141 & 142, Love Road, Tejgaon Industrial Area</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Dhaka-1208, Bangladesh</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>(8802) 8870422 — Ext. 107, 114</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Fax: (8802) 8870418</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Sunday – Thursday, 7:30 AM – 9:00 PM</p>
                </div>
                <div className="flex gap-3">
                  <Mail size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>info@aust.edu</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>regr@aust.edu</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <ExternalLink size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                  <a href="https://www.aust.edu" target="_blank" rel="noopener noreferrer"
                    className="text-sm transition-colors" style={{ color: 'var(--accent)' }}>
                    www.aust.edu
                  </a>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="card overflow-hidden">
              <div className="p-4" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                <h3 className="font-bold text-sm" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                  📍 AUST Campus — Tejgaon Industrial Area, Dhaka
                </h3>
              </div>
              <div style={{ height: 220 }}>
                <iframe
                  title="AUST Campus Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.0!2d90.40687!3d23.76362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7a072dbc08d%3A0x23edb09ef4d42bbe!2sAhsanullah%20University%20of%20Science%20%26%20Technology!5e0!3m2!1sen!2sbd!4v1717500000000!5m2!1sen!2sbd"
                  width="100%" height="220"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
