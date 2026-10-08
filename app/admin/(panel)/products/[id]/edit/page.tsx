'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminProductForm from '@/components/admin/AdminProductForm';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/admin/products/${id}`)
      .then((r) => r.json())
      .then((d) => setProduct(d.product))
      .catch(() => setError('Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (data: Record<string, unknown>) => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push('/admin/products');
      } else {
        const d = await res.json();
        setError(d.error ?? 'Failed to update product');
      }
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500 text-sm">Loading...</div>;
  if (!product) return <div className="p-8 text-red-500 text-sm">Product not found.</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
      </div>
      {error && (
        <div className="mb-5 px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200">{error}</div>
      )}
      <AdminProductForm initialData={product} onSave={handleSave} saving={saving} />
    </div>
  );
}
