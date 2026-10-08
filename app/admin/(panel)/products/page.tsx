'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  _id: string;
  nameEn: string;
  slug: string;
  category: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    fetch('/api/admin/products')
      .then((r) => r.json())
      .then((d) => setProducts(d.products ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

   

  // eslint-disable-next-line react-hooks/set-state-in-effect -- loads admin data on mount
  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    fetchProducts();
    setDeleting(null);
  };

  const togglePublish = async (id: string, current: boolean) => {
    await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !current }),
    });
    fetchProducts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} products total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
          style={{ backgroundColor: '#1597E5' }}
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 text-sm">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 mb-4">No products yet.</p>
            <Link href="/admin/products/new" className="text-sm font-semibold" style={{ color: '#1597E5' }}>
              Add your first product →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: '#F4F6F8' }}>
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Featured</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{p.nameEn}</p>
                      <p className="text-xs text-gray-400 mt-0.5">/{p.slug}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 hidden sm:table-cell">{p.category}</td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    {p.featured ? (
                      <span className="text-xs font-semibold px-2 py-0.5" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>Featured</span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => togglePublish(p._id, p.published)}
                      className={`text-xs font-semibold px-2 py-0.5 transition-colors ${
                        p.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {p.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/products/${p._id}/edit`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id, p.nameEn)}
                        disabled={deleting === p._id}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 disabled:opacity-50"
                      >
                        {deleting === p._id ? '...' : 'Delete'}
                      </button>
                    </div>
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
