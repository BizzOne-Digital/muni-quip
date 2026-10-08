'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminImageField from '@/components/admin/AdminImageField';

interface GalleryItem {
  _id: string;
  url: string;
  captionEn: string;
  captionFr: string;
  sortOrder: number;
  published: boolean;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [captionEn, setCaptionEn] = useState('');
  const [captionFr, setCaptionFr] = useState('');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  const flash = (type: 'ok' | 'err', msg: string) => {
    setNotice({ type, msg });
    setTimeout(() => setNotice(null), 3500);
  };

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/gallery')
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => flash('err', 'Could not load gallery.'))
      .finally(() => setLoading(false));
  }, []);

   

  // eslint-disable-next-line react-hooks/set-state-in-effect -- loads admin data on mount
  useEffect(() => { load(); }, [load]);

  const addItem = async () => {
    if (!newUrl) return;
    setSaving(true);
    const res = await fetch('/api/admin/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: newUrl, captionEn, captionFr, sortOrder: items.length + 1 }),
    });
    setSaving(false);
    if (res.ok) {
      setNewUrl('');
      setCaptionEn('');
      setCaptionFr('');
      flash('ok', 'Image added to the gallery.');
      load();
    } else {
      flash('err', 'Could not save the image.');
    }
  };

  const update = async (item: GalleryItem, patch: Partial<GalleryItem>) => {
    setItems((list) => list.map((i) => (i._id === item._id ? { ...i, ...patch } : i)));
    await fetch(`/api/admin/gallery/${item._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
  };

  const remove = async (item: GalleryItem) => {
    if (!confirm('Delete this image from the gallery? The stored file is deleted too.')) return;
    const res = await fetch(`/api/admin/gallery/${item._id}`, { method: 'DELETE' });
    flash(res.ok ? 'ok' : 'err', res.ok ? 'Image deleted.' : 'Delete failed.');
    load();
  };

  const input = 'w-full px-3 py-2 text-sm border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-blue-400';
  const label = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
        <p className="text-sm text-gray-500 mt-1">Images shown in the &ldquo;In the Field&rdquo; gallery on the About page. Product galleries are managed on each product.</p>
      </div>

      {notice && (
        <div className={`mb-6 px-4 py-3 text-sm border ${notice.type === 'ok' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`} role="status">
          {notice.msg}
        </div>
      )}

      <div className="bg-white border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5 pb-3 border-b border-gray-100">Add Image</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminImageField label="Gallery Image" value={newUrl} onChange={setNewUrl} folder="gallery" />
          <div className="space-y-4">
            <div><label className={label}>Caption (EN)</label><input className={input} value={captionEn} onChange={(e) => setCaptionEn(e.target.value)} /></div>
            <div><label className={label}>Caption (FR)</label><input className={input} value={captionFr} onChange={(e) => setCaptionFr(e.target.value)} /></div>
            <button type="button" onClick={addItem} disabled={!newUrl || saving}
              className="px-6 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-40" style={{ backgroundColor: '#1597E5' }}>
              {saving ? 'Saving...' : 'Add to Gallery'}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500 text-sm">Loading...</div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-gray-100 shadow-sm p-12 text-center text-gray-500 text-sm">No gallery images yet. Upload one above.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white border border-gray-100 shadow-sm overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.captionEn || 'Gallery image'} className={`w-full h-40 object-cover ${item.published ? '' : 'opacity-40'}`} />
              <div className="p-3 space-y-2">
                <input className={input} placeholder="Caption (EN)" aria-label="Caption (EN)" defaultValue={item.captionEn}
                  onBlur={(e) => e.target.value !== item.captionEn && update(item, { captionEn: e.target.value })} />
                <input className={input} placeholder="Caption (FR)" aria-label="Caption (FR)" defaultValue={item.captionFr}
                  onBlur={(e) => e.target.value !== item.captionFr && update(item, { captionFr: e.target.value })} />
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={item.published} onChange={(e) => update(item, { published: e.target.checked })} />
                    Visible
                  </label>
                  <button onClick={() => remove(item)} className="text-xs font-semibold text-red-500 hover:text-red-700">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
