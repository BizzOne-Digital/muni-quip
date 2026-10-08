'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminImageField from '@/components/admin/AdminImageField';
import ServiceIcon, { SERVICE_ICON_KEYS } from '@/components/ui/ServiceIcon';

interface Service {
  _id: string;
  titleEn: string;
  titleFr: string;
  slug: string;
  headlineEn: string;
  headlineFr: string;
  shortDescriptionEn: string;
  shortDescriptionFr: string;
  fullContentEn: string;
  fullContentFr: string;
  image: string;
  icon: string;
  ctaEn: string;
  ctaFr: string;
  sortOrder: number;
  published: boolean;
}

type FormState = Omit<Service, '_id' | 'sortOrder'> & { sortOrder: string };

const EMPTY: FormState = {
  titleEn: '', titleFr: '', slug: '', headlineEn: '', headlineFr: '',
  shortDescriptionEn: '', shortDescriptionFr: '', fullContentEn: '', fullContentFr: '',
  image: '', icon: 'gear', ctaEn: 'Explore Solutions', ctaFr: 'Explorer les solutions',
  sortOrder: '0', published: true,
};

const slugify = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/services')
      .then((r) => r.json())
      .then((d) => setServices(d.services ?? []))
      .catch(() => setNotice({ type: 'err', msg: 'Could not load services.' }))
      .finally(() => setLoading(false));
  }, []);

   

  // eslint-disable-next-line react-hooks/set-state-in-effect -- loads admin data on mount
  useEffect(() => { load(); }, [load]);

  const flash = (type: 'ok' | 'err', msg: string) => {
    setNotice({ type, msg });
    setTimeout(() => setNotice(null), 3500);
  };

  const startEdit = (s?: Service) => {
    if (s) {
      const { _id, sortOrder, ...rest } = s;
      setForm({ ...EMPTY, ...rest, sortOrder: String(sortOrder ?? 0) });
      setEditingId(_id);
    } else {
      setForm({ ...EMPTY, sortOrder: String(services.length + 1) });
      setEditingId('new');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const isNew = editingId === 'new';
    const res = await fetch(isNew ? '/api/admin/services' : `/api/admin/services/${editingId}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, sortOrder: Number(form.sortOrder) || 0 }),
    });
    setSaving(false);
    if (res.ok) {
      setEditingId(null);
      flash('ok', isNew ? 'Service created.' : 'Service updated.');
      load();
    } else {
      const d = await res.json().catch(() => ({}));
      flash('err', d.error ?? 'Save failed.');
    }
  };

  const togglePublish = async (s: Service) => {
    await fetch(`/api/admin/services/${s._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !s.published }),
    });
    load();
  };

  const remove = async (s: Service) => {
    if (!confirm(`Delete "${s.titleEn}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/services/${s._id}`, { method: 'DELETE' });
    flash(res.ok ? 'ok' : 'err', res.ok ? 'Service deleted.' : 'Delete failed.');
    load();
  };

  const input = 'w-full px-3 py-2.5 text-sm border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-400';
  const label = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';
  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-sm text-gray-500 mt-1">Solution cards on the homepage and sections on the Services page.</p>
        </div>
        {editingId === null && (
          <button onClick={() => startEdit()} className="px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110" style={{ backgroundColor: '#1597E5' }}>
            + Add Service
          </button>
        )}
      </div>

      {notice && (
        <div className={`mb-6 px-4 py-3 text-sm border ${notice.type === 'ok' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`} role="status">
          {notice.msg}
        </div>
      )}

      {editingId !== null && (
        <form onSubmit={handleSave} className="bg-white border border-gray-100 shadow-sm p-6 mb-8 space-y-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-3 border-b border-gray-100">
            {editingId === 'new' ? 'New Service' : `Edit: ${form.titleEn}`}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div><label className={label}>Title (EN) *</label>
              <input className={input} value={form.titleEn} required
                onChange={(e) => setForm((f) => ({ ...f, titleEn: e.target.value, slug: editingId === 'new' && !f.slug ? slugify(e.target.value) : f.slug }))} /></div>
            <div><label className={label}>Title (FR)</label><input className={input} value={form.titleFr} onChange={set('titleFr')} /></div>
            <div><label className={label}>Slug *</label>
              <input className={input} value={form.slug} required pattern="[a-z0-9-]+" onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))} />
              <p className="text-xs text-gray-400 mt-1">Products use this slug as their category. Anchor: /services#{form.slug || '...'}</p>
            </div>
            <div><label className={label}>Sort Order</label><input type="number" className={input} value={form.sortOrder} onChange={set('sortOrder')} /></div>
            <div><label className={label}>Headline (EN)</label><input className={input} value={form.headlineEn} onChange={set('headlineEn')} /></div>
            <div><label className={label}>Headline (FR)</label><input className={input} value={form.headlineFr} onChange={set('headlineFr')} /></div>
            <div><label className={label}>Short Description (EN)</label><textarea className={`${input} resize-none`} rows={3} value={form.shortDescriptionEn} onChange={set('shortDescriptionEn')} /></div>
            <div><label className={label}>Short Description (FR)</label><textarea className={`${input} resize-none`} rows={3} value={form.shortDescriptionFr} onChange={set('shortDescriptionFr')} /></div>
            <div><label className={label}>Full Content (EN)</label><textarea className={`${input} resize-y`} rows={6} value={form.fullContentEn} onChange={set('fullContentEn')} /></div>
            <div><label className={label}>Full Content (FR)</label><textarea className={`${input} resize-y`} rows={6} value={form.fullContentFr} onChange={set('fullContentFr')} /></div>
            <div><label className={label}>CTA Label (EN)</label><input className={input} value={form.ctaEn} onChange={set('ctaEn')} /></div>
            <div><label className={label}>CTA Label (FR)</label><input className={input} value={form.ctaFr} onChange={set('ctaFr')} /></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminImageField label="Service Image" value={form.image} folder="pages" onChange={(url) => setForm((f) => ({ ...f, image: url }))} />
            <fieldset>
              <legend className={label}>Icon</legend>
              <div className="flex flex-wrap gap-2">
                {SERVICE_ICON_KEYS.map((k) => (
                  <label key={k} className={`flex items-center gap-2 px-3 py-2 border cursor-pointer text-xs font-semibold capitalize ${form.icon === k ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'}`}>
                    <input type="radio" name="icon" value={k} checked={form.icon === k} onChange={set('icon')} className="sr-only" />
                    <ServiceIcon name={k} size={16} />
                    {k}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} className="w-4 h-4" />
            Published
          </label>

          <div className="flex items-center gap-4">
            <button type="submit" disabled={saving} className="px-6 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60" style={{ backgroundColor: '#1597E5' }}>
              {saving ? 'Saving...' : 'Save Service'}
            </button>
            <button type="button" onClick={() => setEditingId(null)} className="text-sm text-gray-500 hover:text-gray-800">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white border border-gray-100 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500 text-sm">Loading...</div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            No services in the database yet. The website is showing the default services.
            <br />Use <strong>Import default content</strong> on the Dashboard to load them for editing.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: '#F4F6F8' }}>
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Slug</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {services.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {s.image ? <img src={s.image} alt="" className="w-12 h-9 object-cover bg-gray-100" /> : <span className="w-12 h-9 bg-gray-100" />}
                      <div>
                        <p className="font-medium text-gray-900">{s.titleEn}</p>
                        <p className="text-xs text-gray-400">{s.titleFr || 'No French title'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-400 hidden md:table-cell">{s.slug}</td>
                  <td className="px-5 py-4 text-gray-600">{s.sortOrder}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => togglePublish(s)} className={`text-xs font-semibold px-2 py-0.5 ${s.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {s.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <button onClick={() => startEdit(s)} className="text-xs font-semibold text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                    <button onClick={() => remove(s)} className="text-xs font-semibold text-red-500 hover:text-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
