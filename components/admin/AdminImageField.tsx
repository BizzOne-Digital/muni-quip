'use client';

import { useRef, useState } from 'react';

interface AdminImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: 'products' | 'gallery' | 'pages' | 'misc';
  disabled?: boolean;
}

async function deleteUpload(url: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/upload?url=${encodeURIComponent(url)}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}

export default function AdminImageField({ label, value, onChange, folder, disabled }: AdminImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFile = async (file: File) => {
    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!ALLOWED.includes(file.type)) {
      showToast('error', 'Invalid file type. Use JPEG, PNG, WebP or GIF.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast('error', 'File too large (max 8MB).');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const d = await res.json();
        showToast('error', d.error ?? 'Upload failed');
        return;
      }
      const data = await res.json();
      // The previous stored image is removed server-side once the record is saved
      // with the new URL, so an unsaved replace never leaves a broken reference.
      onChange(data.url);
      showToast('success', value ? 'Image replaced. Save to apply.' : 'Image uploaded successfully.');
    } catch {
      showToast('error', 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!value) return;
    if (value.startsWith('/api/uploads/')) {
      const ok = await deleteUpload(value);
      if (!ok) {
        showToast('error', 'Could not delete the stored image.');
        return;
      }
    }
    onChange('');
    showToast('success', 'Image removed.');
  };


  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>

      {/* Preview */}
      {value ? (
        <div className="relative w-full max-w-sm">
          <div className="relative h-40 border border-gray-200 overflow-hidden bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt={`${label} preview`} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.opacity = '0.2'; }} />
          </div>
          {uploading && <p className="text-xs text-gray-500 mt-2 flex items-center gap-2"><span className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />Uploading...</p>}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled || uploading}
              className="px-3 py-1.5 text-xs font-semibold border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled || uploading}
              className="px-3 py-1.5 text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !uploading && !disabled && inputRef.current?.click()}
          className={`flex flex-col items-center justify-center w-full max-w-sm h-36 border-2 border-dashed border-gray-200 cursor-pointer hover:border-blue-400 transition-colors ${
            uploading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
          style={{ backgroundColor: '#FAFBFC' }}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-gray-500">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p className="text-xs text-gray-500">Click to upload image</p>
              <p className="text-xs text-gray-400">JPEG, PNG, WebP, GIF — max 8MB</p>
            </div>
          )}
        </div>
      )}

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
        disabled={disabled || uploading}
        aria-label={`Upload ${label}`}
      />

      {/* Toast */}
      {toast && (
        <div
          className={`flex items-center gap-2 px-3 py-2 text-xs font-medium ${
            toast.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {toast.type === 'success' ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          )}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
