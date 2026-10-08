'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/localization';
import { translations } from '@/lib/localization';
import type { SettingsData } from '@/lib/defaults';

interface ContactCTAProps {
  locale: Locale;
  settings: SettingsData;
  eyebrow: string;
  heading: string;
  text: string;
}

export default function ContactCTA({ locale, settings, eyebrow, heading, text }: ContactCTAProps) {
  const tel = settings.phone.replace(/[^0-9+]/g, '');
  const t = translations[locale].contact;

  const [form, setForm] = useState({ name: '', organization: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, language: locale }),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', organization: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="py-0 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left: dark panel */}
        <div
          className="px-8 py-16 lg:px-14 lg:py-20 flex flex-col justify-center"
          style={{ backgroundColor: '#111820' }}
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8" style={{ backgroundColor: '#1597E5' }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#1597E5' }}>
              {eyebrow}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-5">
            {heading}
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-10">{text}</p>

          {/* Contact info */}
          <div className="space-y-4">
            {[
              { icon: <MapPinIcon />, content: `${settings.siteName}\n${settings.address}\n${settings.city}, ${settings.province}, ${settings.postalCode}` },
              { icon: <PhoneIcon />, content: settings.phone, href: `tel:${tel}` },
              { icon: <MailIcon />, content: settings.email, href: `mailto:${settings.email}` },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div
                  className="w-9 h-9 flex-shrink-0 flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: 'rgba(21,151,229,0.12)' }}
                >
                  {item.icon}
                </div>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors whitespace-pre-line"
                  >
                    {item.content}
                  </a>
                ) : (
                  <p className="text-sm text-gray-300 whitespace-pre-line">{item.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: form panel */}
        <div className="px-8 py-16 lg:px-14 lg:py-20" style={{ backgroundColor: '#F4F6F8' }}>
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div
                className="w-14 h-14 flex items-center justify-center mb-5"
                style={{ backgroundColor: '#1597E5' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {locale === 'en' ? 'Message Sent' : 'Message envoyé'}
              </h3>
              <p className="text-gray-500 text-sm">{t.successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                {locale === 'en' ? 'Send Us a Message' : 'Envoyez-nous un message'}
              </h3>

              <input
                type="text"
                placeholder={t.namePlaceholder} aria-label={t.namePlaceholder}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-4 py-3 text-sm bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none"
                style={{ borderColor: '#e2e8f0' }}
              />
              <input
                type="text"
                placeholder={t.orgPlaceholder} aria-label={t.orgPlaceholder}
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                className="w-full px-4 py-3 text-sm bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none"
              />
              <input
                type="email"
                placeholder={t.emailPlaceholder} aria-label={t.emailPlaceholder}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-3 text-sm bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none"
              />
              <input
                type="tel"
                placeholder={t.phonePlaceholder} aria-label={t.phonePlaceholder}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 text-sm bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none"
              />
              <textarea
                placeholder={t.messagePlaceholder} aria-label={t.messagePlaceholder}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 text-sm bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none resize-none"
              />

              {status === 'error' && (
                <p className="text-red-600 text-sm">
                  {translations[locale].common.error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3.5 text-sm font-semibold text-white tracking-wide transition-all duration-200 hover:brightness-110 disabled:opacity-60"
                style={{ backgroundColor: '#1597E5' }}
              >
                {status === 'loading'
                  ? translations[locale].common.loading
                  : `${t.sendButton} →`}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function MapPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1597E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1597E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.49a2 2 0 0 1 1.99-2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8 9.21a16 16 0 0 0 5.11 5.14l.95-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1597E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}
