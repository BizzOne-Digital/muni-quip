'use client';

import { useEffect, useState } from 'react';
import AdminImageField from '@/components/admin/AdminImageField';
import { PAGE_BLOCKS } from '@/lib/pageBlocks';

const PAGE_KEYS = ['home', 'about', 'services', 'contact', 'booking'] as const;
type PageKey = (typeof PAGE_KEYS)[number];

interface PageContent {
  pageKey: string;
  heroHeadingEn: string; heroHeadingFr: string;
  heroDescriptionEn: string; heroDescriptionFr: string;
  heroCta1En: string; heroCta1Fr: string;
  heroCta2En: string; heroCta2Fr: string;
  heroImage: string;
  section1HeadingEn: string; section1HeadingFr: string;
  section1TextEn: string; section1TextFr: string;
  seoTitleEn: string; seoTitleFr: string;
  seoDescriptionEn: string; seoDescriptionFr: string;
  blocks: Record<string, string>;
}

const HINTS: Record<PageKey, string> = {
  home: 'Hero heading: one line per row, the last row shows in blue. Every homepage section heading and text is editable below.',
  about: 'Section 1 is the "Who We Are" introduction. Separate paragraphs with a blank line.',
  services: 'Hero heading and description at the top of the Services page.',
  contact: 'Hero heading and description at the top of the Contact page.',
  booking: 'Hero heading and description at the top of the Booking page.',
};

// Fields each page actually uses on the public site.
const USES: Record<PageKey, { ctas: boolean; section1: boolean }> = {
  home: { ctas: true, section1: false },
  about: { ctas: false, section1: true },
  services: { ctas: false, section1: false },
  contact: { ctas: false, section1: false },
  booking: { ctas: false, section1: false },
};

export default function AdminPagesPage() {
  const [activeKey, setActiveKey] = useState<PageKey>('home');
  const [data, setData] = useState<Partial<PageContent>>({ pageKey: 'home' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

   

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loads admin data on mount
    setLoading(true);
    fetch(`/api/admin/pages?key=${activeKey}`)
      .then((r) => (r.ok ? r.json() : { page: null }))
      .then((d) => { if (!cancelled) setData(d.page ?? { pageKey: activeKey }); })
      .catch(() => { if (!cancelled) setData({ pageKey: activeKey }); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [activeKey]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/admin/pages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, pageKey: activeKey }),
    });
    setSaving(false);
    setNotice(res.ok ? { type: 'ok', msg: 'Saved. The live page updates within a minute.' } : { type: 'err', msg: 'Save failed.' });
    setTimeout(() => setNotice(null), 3500);
  };

  const set = (field: keyof PageContent) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData((d) => ({ ...d, [field]: e.target.value }));

  const input = 'w-full px-3 py-2.5 text-sm border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-400';
  const lbl = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';
  const uses = USES[activeKey];
  const blockDefs = PAGE_BLOCKS[activeKey] ?? [];
  const blockGroups = [...new Set(blockDefs.map((b) => b.group))];
  const blocks = data.blocks ?? {};
  const setBlock = (key: string, value: string) => setData((d) => ({ ...d, blocks: { ...(d.blocks ?? {}), [key]: value } }));

  const pair = (title: string, en: keyof PageContent, fr: keyof PageContent, rows = 0) => (
    <>
      {[en, fr].map((field, i) => (
        <div key={field}>
          <label className={lbl}>{title} ({i === 0 ? 'EN' : 'FR'})</label>
          {rows ? (
            <textarea className={`${input} resize-y`} rows={rows} value={(data[field] as string) ?? ''} onChange={set(field)} />
          ) : (
            <input className={input} value={(data[field] as string) ?? ''} onChange={set(field)} />
          )}
        </div>
      ))}
    </>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Page Content</h1>
        <p className="text-sm text-gray-500 mt-1">Leave a field empty to keep the default website text.</p>
      </div>

      <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto" role="tablist">
        {PAGE_KEYS.map((k) => (
          <button key={k} role="tab" aria-selected={activeKey === k} onClick={() => setActiveKey(k)}
            className={`px-5 py-2.5 text-sm font-semibold capitalize whitespace-nowrap border-b-2 ${activeKey === k ? 'text-blue-600 border-[#1597E5]' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>
            {k}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 bg-white border border-gray-100 px-4 py-3 mb-6">{HINTS[activeKey]}</p>

      {notice && (
        <div className={`mb-6 px-4 py-3 text-sm border ${notice.type === 'ok' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`} role="status">
          {notice.msg}
        </div>
      )}

      {loading ? <div className="py-8 text-gray-500 text-sm">Loading...</div> : (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-3 border-b border-gray-100">Hero Section</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {pair('Hero Heading', 'heroHeadingEn', 'heroHeadingFr', activeKey === 'home' ? 4 : 2)}
              {pair('Hero Description', 'heroDescriptionEn', 'heroDescriptionFr', 3)}
              {uses.ctas && pair('Primary Button Label', 'heroCta1En', 'heroCta1Fr')}
              {uses.ctas && pair('Secondary Button Label', 'heroCta2En', 'heroCta2Fr')}
            </div>
            <AdminImageField label="Hero Image" value={data.heroImage ?? ''} folder="pages" onChange={(url) => setData((d) => ({ ...d, heroImage: url }))} />
          </div>

          {uses.section1 && (
            <div className="bg-white border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-3 border-b border-gray-100">Introduction Section</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {pair('Heading', 'section1HeadingEn', 'section1HeadingFr')}
                {pair('Text', 'section1TextEn', 'section1TextFr', 8)}
              </div>
            </div>
          )}

          {blockGroups.map((group) => (
            <div key={group} className="bg-white border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-3 border-b border-gray-100">{group}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {blockDefs.filter((b) => b.group === group).map((b) =>
                  b.type === 'image' ? (
                    <div key={b.key} className="sm:col-span-2">
                      <AdminImageField label={b.label} value={blocks[b.key] ?? ''} folder="pages" onChange={(url) => setBlock(b.key, url)} />
                    </div>
                  ) : (
                    (['En', 'Fr'] as const).map((lng) => {
                      const k = `${b.key}${lng}`;
                      const placeholder = (lng === 'En' ? b.en : b.fr) ?? '';
                      return (
                        <div key={k}>
                          <label className={lbl} htmlFor={k}>{b.label} ({lng.toUpperCase()})</label>
                          {b.type === 'textarea' ? (
                            <textarea id={k} className={`${input} resize-y`} rows={3} placeholder={placeholder} value={blocks[k] ?? ''} onChange={(e) => setBlock(k, e.target.value)} />
                          ) : (
                            <input id={k} className={input} placeholder={placeholder} value={blocks[k] ?? ''} onChange={(e) => setBlock(k, e.target.value)} />
                          )}
                        </div>
                      );
                    })
                  )
                )}
              </div>
            </div>
          ))}

          <div className="bg-white border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-3 border-b border-gray-100">SEO</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {pair('Meta Title', 'seoTitleEn', 'seoTitleFr')}
              {pair('Meta Description', 'seoDescriptionEn', 'seoDescriptionFr', 2)}
            </div>
          </div>

          <button type="submit" disabled={saving} className="px-8 py-3 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60" style={{ backgroundColor: '#1597E5' }}>
            {saving ? 'Saving...' : 'Save Page Content'}
          </button>
        </form>
      )}
    </div>
  );
}
