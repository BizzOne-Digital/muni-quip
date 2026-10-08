'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminImageField from './AdminImageField';

interface AdminProductFormProps {
  initialData?: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
  saving: boolean;
}

// Category = the service the product belongs to (drives "Related Products" on the Services page).
const CATEGORIES = [
  { value: 'asphalt-repair', label: 'Asphalt Repair' },
  { value: 'road-maintenance', label: 'Road Maintenance' },
  { value: 'winter-maintenance', label: 'Winter Maintenance' },
  { value: 'fleet-safety', label: 'Fleet Safety & Technology' },
  { value: 'parts-service', label: 'Parts & Service' },
];

export default function AdminProductForm({ initialData, onSave, saving }: AdminProductFormProps) {
  const d = initialData ?? {};

  const [form, setForm] = useState({
    nameEn: (d.nameEn as string) ?? '',
    nameFr: (d.nameFr as string) ?? '',
    slug: (d.slug as string) ?? '',
    category: (d.category as string) || 'asphalt-repair',
    subtitleEn: (d.subtitleEn as string) ?? '',
    subtitleFr: (d.subtitleFr as string) ?? '',
    price: (d.price as string) ?? '',
    shortDescriptionEn: (d.shortDescriptionEn as string) ?? '',
    shortDescriptionFr: (d.shortDescriptionFr as string) ?? '',
    fullDescriptionEn: (d.fullDescriptionEn as string) ?? '',
    fullDescriptionFr: (d.fullDescriptionFr as string) ?? '',
    benefitsEn: ((d.benefitsEn as string[]) ?? []).join('\n'),
    benefitsFr: ((d.benefitsFr as string[]) ?? []).join('\n'),
    applicationsEn: ((d.applicationsEn as string[]) ?? []).join('\n'),
    applicationsFr: ((d.applicationsFr as string[]) ?? []).join('\n'),
    brand: (d.brand as string) ?? '',
    sortOrder: String(d.sortOrder ?? '0'),
    featured: Boolean(d.featured),
    published: d.published !== false,
    heroImage: (d.heroImage as string) ?? '',
    galleryImages: ((d.galleryImages as string[]) ?? []).filter(Boolean),
    specifications: ((d.specifications as { key: string; value: string }[]) ?? []).map((s) => ({ key: s.key, value: s.value })),
    seoTitleEn: (d.seoTitleEn as string) ?? '',
    seoTitleFr: (d.seoTitleFr as string) ?? '',
    seoDescriptionEn: (d.seoDescriptionEn as string) ?? '',
    seoDescriptionFr: (d.seoDescriptionFr as string) ?? '',
  });

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleNameChange = (val: string) => {
    setForm((f) => ({ ...f, nameEn: val, slug: f.slug || autoSlug(val) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      sortOrder: Number(form.sortOrder),
      benefitsEn: form.benefitsEn.split('\n').map((s) => s.trim()).filter(Boolean),
      benefitsFr: form.benefitsFr.split('\n').map((s) => s.trim()).filter(Boolean),
      applicationsEn: form.applicationsEn.split('\n').map((s) => s.trim()).filter(Boolean),
      applicationsFr: form.applicationsFr.split('\n').map((s) => s.trim()).filter(Boolean),
      specifications: form.specifications.filter((s) => s.key.trim() && s.value.trim()),
      galleryImages: form.galleryImages.filter(Boolean),
    });
  };

  const input = 'w-full px-3 py-2.5 text-sm border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-400 transition-colors';
  const textarea = `${input} resize-none`;
  const label = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <Section title="Basic Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={label}>Product Name (EN) *</label>
            <input className={input} value={form.nameEn} onChange={(e) => handleNameChange(e.target.value)} required />
          </div>
          <div>
            <label className={label}>Product Name (FR)</label>
            <input className={input} value={form.nameFr} onChange={(e) => setForm({ ...form, nameFr: e.target.value })} />
          </div>
          <div>
            <label className={label}>Slug *</label>
            <input className={input} value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })} required
              placeholder="e.g. bagela-ba-10000" />
            <p className="text-xs text-gray-400 mt-1">URL: /products/{form.slug || '...'}</p>
          </div>
          <div>
            <label className={label}>Category</label>
            <select className={input} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Subtitle (EN)</label>
            <input className={input} value={form.subtitleEn} onChange={(e) => setForm({ ...form, subtitleEn: e.target.value })} placeholder="e.g. Mobile Asphalt Recycling" />
          </div>
          <div>
            <label className={label}>Subtitle (FR)</label>
            <input className={input} value={form.subtitleFr} onChange={(e) => setForm({ ...form, subtitleFr: e.target.value })} />
          </div>
          <div>
            <label className={label}>Price (optional)</label>
            <input className={input} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Leave empty to show Request a Quote only" />
          </div>
          <div>
            <label className={label}>Brand</label>
            <input className={input} value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="e.g. BAGELA" />
          </div>
          <div>
            <label className={label}>Sort Order</label>
            <input type="number" className={input} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
          </div>
        </div>
        <div className="flex items-center gap-6 mt-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4" />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4" />
            Featured on Homepage
          </label>
        </div>
      </Section>

      {/* Hero Image */}
      <Section title="Hero Image">
        <AdminImageField
          label="Product Hero Image"
          value={form.heroImage}
          onChange={(url) => setForm({ ...form, heroImage: url })}
          folder="products"
        />
      </Section>

      {/* Descriptions */}
      <Section title="Short Description">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={label}>Short Description (EN)</label>
            <textarea className={textarea} rows={3} value={form.shortDescriptionEn}
              onChange={(e) => setForm({ ...form, shortDescriptionEn: e.target.value })} />
          </div>
          <div>
            <label className={label}>Short Description (FR)</label>
            <textarea className={textarea} rows={3} value={form.shortDescriptionFr}
              onChange={(e) => setForm({ ...form, shortDescriptionFr: e.target.value })} />
          </div>
        </div>
      </Section>

      <Section title="Full Description">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={label}>Full Description (EN)</label>
            <textarea className={textarea} rows={6} value={form.fullDescriptionEn}
              onChange={(e) => setForm({ ...form, fullDescriptionEn: e.target.value })} />
          </div>
          <div>
            <label className={label}>Full Description (FR)</label>
            <textarea className={textarea} rows={6} value={form.fullDescriptionFr}
              onChange={(e) => setForm({ ...form, fullDescriptionFr: e.target.value })} />
          </div>
        </div>
      </Section>

      {/* Benefits */}
      <Section title="Key Benefits (one per line)">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={label}>Benefits (EN)</label>
            <textarea className={textarea} rows={5} value={form.benefitsEn}
              onChange={(e) => setForm({ ...form, benefitsEn: e.target.value })}
              placeholder="Each benefit on a new line" />
          </div>
          <div>
            <label className={label}>Benefits (FR)</label>
            <textarea className={textarea} rows={5} value={form.benefitsFr}
              onChange={(e) => setForm({ ...form, benefitsFr: e.target.value })}
              placeholder="Un avantage par ligne" />
          </div>
        </div>
      </Section>

      {/* Applications */}
      <Section title="Applications (one per line)">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={label}>Applications (EN)</label>
            <textarea className={textarea} rows={4} value={form.applicationsEn}
              onChange={(e) => setForm({ ...form, applicationsEn: e.target.value })} />
          </div>
          <div>
            <label className={label}>Applications (FR)</label>
            <textarea className={textarea} rows={4} value={form.applicationsFr}
              onChange={(e) => setForm({ ...form, applicationsFr: e.target.value })} />
          </div>
        </div>
      </Section>

      {/* Specifications */}
      <Section title="Specifications">
        <div className="space-y-3">
          {form.specifications.map((spec, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-2">
              <input className={input} placeholder="Label (e.g. Capacity)" aria-label={`Specification ${i + 1} label`} value={spec.key}
                onChange={(e) => setForm({ ...form, specifications: form.specifications.map((s, j) => (j === i ? { ...s, key: e.target.value } : s)) })} />
              <input className={input} placeholder="Value" aria-label={`Specification ${i + 1} value`} value={spec.value}
                onChange={(e) => setForm({ ...form, specifications: form.specifications.map((s, j) => (j === i ? { ...s, value: e.target.value } : s)) })} />
              <button type="button" onClick={() => setForm({ ...form, specifications: form.specifications.filter((_, j) => j !== i) })}
                className="px-3 py-2 text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => setForm({ ...form, specifications: [...form.specifications, { key: '', value: '' }] })}
            className="px-4 py-2 text-xs font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50">+ Add Specification</button>
        </div>
      </Section>

      {/* Gallery */}
      <Section title="Product Gallery">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {form.galleryImages.map((url, i) => (
            <AdminImageField key={url} label={`Gallery Image ${i + 1}`} value={url} folder="products"
              onChange={(next) => setForm((f) => ({
                ...f,
                galleryImages: next ? f.galleryImages.map((u, j) => (j === i ? next : u)) : f.galleryImages.filter((_, j) => j !== i),
              }))} />
          ))}
          <AdminImageField key={`new-${form.galleryImages.length}`} label="Add Gallery Image" value="" folder="products"
            onChange={(url) => url && setForm((f) => ({ ...f, galleryImages: [...f.galleryImages, url] }))} />
        </div>
      </Section>

      {/* SEO */}
      <Section title="SEO">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={label}>SEO Title (EN)</label>
            <input className={input} value={form.seoTitleEn} onChange={(e) => setForm({ ...form, seoTitleEn: e.target.value })} />
          </div>
          <div>
            <label className={label}>SEO Title (FR)</label>
            <input className={input} value={form.seoTitleFr} onChange={(e) => setForm({ ...form, seoTitleFr: e.target.value })} />
          </div>
          <div>
            <label className={label}>SEO Description (EN)</label>
            <textarea className={textarea} rows={2} value={form.seoDescriptionEn} onChange={(e) => setForm({ ...form, seoDescriptionEn: e.target.value })} />
          </div>
          <div>
            <label className={label}>SEO Description (FR)</label>
            <textarea className={textarea} rows={2} value={form.seoDescriptionFr} onChange={(e) => setForm({ ...form, seoDescriptionFr: e.target.value })} />
          </div>
        </div>
      </Section>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-2">
        <button type="submit" disabled={saving}
          className="px-8 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60"
          style={{ backgroundColor: '#1597E5' }}>
          {saving ? 'Saving...' : 'Save Product'}
        </button>
        <Link href="/admin/products" className="text-sm text-gray-500 hover:text-gray-700">Cancel</Link>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 shadow-sm p-6">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5 pb-3 border-b border-gray-100">
        {title}
      </h2>
      {children}
    </div>
  );
}
