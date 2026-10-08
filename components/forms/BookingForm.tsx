'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/localization';

const SERVICE_TYPES_EN = [
  'Equipment Consultation',
  'Product Quote',
  'Parts Support',
  'Calibration',
  'Technical Support',
  'Service',
  'General Inquiry',
];
const SERVICE_TYPES_FR = [
  'Consultation d\'équipement',
  'Soumission de produit',
  'Support pièces',
  'Calibration d\'épandeur',
  'Support technique',
  'Service',
  'Demande générale',
];

const PROVINCES_EN = ['Ontario', 'Quebec', 'Other'];
const PROVINCES_FR = ['Ontario', 'Québec', 'Autre'];

interface BookingFormProps {
  locale: Locale;
  initialEquipment?: string;
  initialType?: string;
  equipmentOptions?: string[];
}

// Maps ?type= query values to the matching service type option.
const TYPE_INDEX: Record<string, number> = { consultation: 0, quote: 1, parts: 2, calibration: 3, support: 4, service: 5 };

export default function BookingForm({ locale, initialEquipment = '', initialType = '', equipmentOptions = [] }: BookingFormProps) {
  const isFr = locale === 'fr';
  const typeList = isFr ? SERVICE_TYPES_FR : SERVICE_TYPES_EN;
  const initialServiceType = initialType in TYPE_INDEX ? typeList[TYPE_INDEX[initialType]] : '';

  const [form, setForm] = useState({
    name: '', organization: '', email: '', phone: '',
    province: '', preferredDate: '', serviceType: initialServiceType, equipment: initialEquipment, message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = isFr ? 'Ce champ est obligatoire.' : 'This field is required.';
    if (!form.email.trim()) errs.email = isFr ? 'Ce champ est obligatoire.' : 'This field is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = isFr ? 'Courriel invalide.' : 'Invalid email.';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus('loading');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, language: locale }),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', organization: '', email: '', phone: '', province: '', preferredDate: '', serviceType: '', equipment: '', message: '' });
      } else setStatus('error');
    } catch { setStatus('error'); }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center text-center py-20">
        <div className="w-16 h-16 flex items-center justify-center mb-5" style={{ backgroundColor: '#1597E5' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{isFr ? 'Demande envoyée!' : 'Request Submitted!'}</h3>
        <p className="text-gray-500 max-w-sm">
          {isFr
            ? "Merci! Nous vous contacterons dans un délai d'un jour ouvrable."
            : "Thank you! We'll be in touch within one business day."}
        </p>
      </div>
    );
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 text-sm bg-white border text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${errors[field] ? 'border-red-400' : 'border-gray-200'}`;

  const serviceTypes = isFr ? SERVICE_TYPES_FR : SERVICE_TYPES_EN;
  const provinces = isFr ? PROVINCES_FR : PROVINCES_EN;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <input type="text" placeholder={isFr ? 'Nom *' : 'Name *'} aria-label={isFr ? 'Nom *' : 'Name *'} value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required
            className={inputClass('name')} aria-required="true" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <input type="text" placeholder={isFr ? 'Municipalité / Organisation' : 'Municipality / Organization'} aria-label={isFr ? 'Municipalité / Organisation' : 'Municipality / Organization'}
          value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })}
          className={inputClass('organization')} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <input type="email" placeholder={isFr ? 'Courriel *' : 'Email *'} aria-label={isFr ? 'Courriel *' : 'Email *'} value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required
            className={inputClass('email')} aria-required="true" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <input type="tel" placeholder={isFr ? 'Téléphone' : 'Phone'} aria-label={isFr ? 'Téléphone' : 'Phone'}
          value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className={inputClass('phone')} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <select value={form.province} aria-label={isFr ? 'Province' : 'Province'} onChange={(e) => setForm({ ...form, province: e.target.value })}
          className={`${inputClass('province')} cursor-pointer`}>
          <option value="">{isFr ? 'Province' : 'Province'}</option>
          {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <input type="date" min={new Date().toISOString().slice(0, 10)} placeholder={isFr ? 'Date préférée' : 'Preferred Date'} aria-label={isFr ? 'Date préférée' : 'Preferred Date'}
          value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
          className={inputClass('preferredDate')} />
      </div>

      <select value={form.serviceType} aria-label={isFr ? 'Type de service' : 'Service type'} onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
        className={`${inputClass('serviceType')} cursor-pointer`}>
        <option value="">{isFr ? 'Type de service' : 'Service Type'}</option>
        {serviceTypes.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <input type="text" placeholder={isFr ? 'Équipement / Produit' : 'Equipment / Product'} aria-label={isFr ? 'Équipement / Produit' : 'Equipment / Product'}
        value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })} list="booking-equipment"
        className={inputClass('equipment')} />

      <datalist id="booking-equipment">{equipmentOptions.map((o) => <option key={o} value={o} />)}</datalist>

      <textarea placeholder={isFr ? 'Message' : 'Message'} aria-label={isFr ? 'Message' : 'Message'} value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        rows={5} className={`${inputClass('message')} resize-none`} />

      {status === 'error' && (
        <p className="text-red-600 text-sm">{isFr ? 'Une erreur est survenue. Veuillez réessayer.' : 'An error occurred. Please try again.'}</p>
      )}

      <button type="submit" disabled={status === 'loading'}
        className="w-full py-4 text-sm font-semibold text-white tracking-wide transition-all duration-200 hover:brightness-110 disabled:opacity-60"
        style={{ backgroundColor: '#1597E5' }}>
        {status === 'loading'
          ? (isFr ? 'Envoi en cours...' : 'Submitting...')
          : (isFr ? 'Soumettre la demande →' : 'Submit Request →')}
      </button>
    </form>
  );
}
