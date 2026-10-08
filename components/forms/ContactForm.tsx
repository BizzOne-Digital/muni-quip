'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/localization';
import { translations } from '@/lib/localization';

export default function ContactForm({ locale }: { locale: Locale }) {
  const t = translations[locale].contact;
  const c = translations[locale].common;

  const [form, setForm] = useState({
    name: '', organization: '', email: '', phone: '', message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = c.required;
    if (!form.email.trim()) errs.email = c.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = c.invalidEmail;
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, language: locale }),
      });
      if (res.ok) { setStatus('success'); setForm({ name: '', organization: '', email: '', phone: '', message: '' }); }
      else setStatus('error');
    } catch { setStatus('error'); }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center text-center py-16">
        <div className="w-16 h-16 flex items-center justify-center mb-5" style={{ backgroundColor: '#1597E5' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{locale === 'en' ? 'Message Sent!' : 'Message envoyé!'}</h3>
        <p className="text-gray-500 text-sm max-w-sm">{t.successMessage}</p>
      </div>
    );
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 text-sm bg-white border text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${errors[field] ? 'border-red-400' : 'border-gray-200 focus:border-blue-400'}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <input type="text" placeholder={t.namePlaceholder} aria-label={t.namePlaceholder} value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required className={inputClass('name')} aria-required="true" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <input type="text" placeholder={t.orgPlaceholder} aria-label={t.orgPlaceholder} value={form.organization}
          onChange={(e) => setForm({ ...form, organization: e.target.value })}
          className={inputClass('organization')} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <input type="email" placeholder={t.emailPlaceholder} aria-label={t.emailPlaceholder} value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required className={inputClass('email')} aria-required="true" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <input type="tel" placeholder={t.phonePlaceholder} aria-label={t.phonePlaceholder} value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className={inputClass('phone')} />
      </div>
      <textarea placeholder={t.messagePlaceholder} aria-label={t.messagePlaceholder} value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        rows={5} className={`${inputClass('message')} resize-none`} />

      {status === 'error' && (
        <p className="text-red-600 text-sm">{c.error}</p>
      )}

      <button type="submit" disabled={status === 'loading'}
        className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-white tracking-wide transition-all duration-200 hover:brightness-110 disabled:opacity-60"
        style={{ backgroundColor: '#1597E5' }}>
        {status === 'loading' ? c.loading : `${t.sendButton} →`}
      </button>
    </form>
  );
}
