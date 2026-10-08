'use client';

import { useEffect, useState } from 'react';

interface Settings {
  siteName: string;
  taglineEn: string;
  taglineFr: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  serviceAreaEn: string;
  serviceAreaFr: string;
  footerTextEn: string;
  footerTextFr: string;
  socialFacebook: string;
  socialLinkedin: string;
  socialTwitter: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Partial<Settings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => setSettings(d.settings ?? {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    setSaving(false);
  };

  const set = (field: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setSettings((s) => ({ ...s, [field]: e.target.value }));

  const input = 'w-full px-3 py-2.5 text-sm border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-400';
  const label = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';


  if (loading) return <div className="p-8 text-gray-500 text-sm">Loading settings...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        {saved && (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 border border-green-200">
            Settings saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Section title="General">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div><label className={label}>Site Name</label>
              <input className={input} value={settings.siteName ?? ''} onChange={set('siteName')} /></div>
            <div><label className={label}>Tagline (EN)</label>
              <input className={input} value={settings.taglineEn ?? ''} onChange={set('taglineEn')} /></div>
            <div><label className={label}>Tagline (FR)</label>
              <input className={input} value={settings.taglineFr ?? ''} onChange={set('taglineFr')} /></div>
          </div>
        </Section>

        <Section title="Contact Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div><label className={label}>Phone</label>
              <input className={input} value={settings.phone ?? ''} onChange={set('phone')} /></div>
            <div><label className={label}>Email</label>
              <input type="email" className={input} value={settings.email ?? ''} onChange={set('email')} /></div>
            <div><label className={label}>Address</label>
              <input className={input} value={settings.address ?? ''} onChange={set('address')} /></div>
            <div><label className={label}>City</label>
              <input className={input} value={settings.city ?? ''} onChange={set('city')} /></div>
            <div><label className={label}>Province</label>
              <input className={input} value={settings.province ?? ''} onChange={set('province')} /></div>
            <div><label className={label}>Postal Code</label>
              <input className={input} value={settings.postalCode ?? ''} onChange={set('postalCode')} /></div>
            <div><label className={label}>Service Area (EN)</label>
              <input className={input} value={settings.serviceAreaEn ?? ''} onChange={set('serviceAreaEn')} /></div>
            <div><label className={label}>Service Area (FR)</label>
              <input className={input} value={settings.serviceAreaFr ?? ''} onChange={set('serviceAreaFr')} /></div>
          </div>
        </Section>

        <Section title="Footer">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div><label className={label}>Footer Text (EN)</label>
              <input className={input} value={settings.footerTextEn ?? ''} onChange={set('footerTextEn')} /></div>
            <div><label className={label}>Footer Text (FR)</label>
              <input className={input} value={settings.footerTextFr ?? ''} onChange={set('footerTextFr')} /></div>
          </div>
        </Section>

        <Section title="Social Media">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div><label className={label}>Facebook URL</label>
              <input className={input} value={settings.socialFacebook ?? ''} onChange={set('socialFacebook')} placeholder="https://facebook.com/..." /></div>
            <div><label className={label}>LinkedIn URL</label>
              <input className={input} value={settings.socialLinkedin ?? ''} onChange={set('socialLinkedin')} placeholder="https://linkedin.com/..." /></div>
            <div><label className={label}>Twitter / X URL</label>
              <input className={input} value={settings.socialTwitter ?? ''} onChange={set('socialTwitter')} placeholder="https://x.com/..." /></div>
          </div>
        </Section>

        <div>
          <button type="submit" disabled={saving}
            className="px-8 py-3 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60 transition-all"
            style={{ backgroundColor: '#1597E5' }}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
  <div className="bg-white border border-gray-100 shadow-sm p-6 space-y-5">
    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-3 border-b border-gray-100">{title}</h2>
    {children}
  </div>
  );
}
