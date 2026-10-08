'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminProductForm from '@/components/admin/AdminProductForm';

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (data: Record<string, unknown>) => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push('/admin/products');
      } else {
        const d = await res.json();
        setError(d.error ?? 'Failed to save product');
      }
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
      </div>
      {error && (
        <div className="mb-5 px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200">{error}</div>
      )}
      <AdminProductForm onSave={handleSave} saving={saving} />
    </div>
  );
}
