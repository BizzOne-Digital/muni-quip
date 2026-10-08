'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashStats {
  totalProducts: number;
  totalServices: number;
  totalBookings: number;
  newBookings: number;
  totalMessages: number;
  newMessages: number;
}

interface RecentBooking {
  _id: string;
  name: string;
  organization: string;
  serviceType: string;
  status: string;
  createdAt: string;
}

interface RecentMessage {
  _id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');
  const [reload, setReload] = useState(0);

  const importDefaults = async () => {
    setSeeding(true);
    setSeedMsg('');
    const res = await fetch('/api/admin/seed', { method: 'POST' });
    const d = await res.json().catch(() => ({}));
    setSeeding(false);
    setSeedMsg(res.ok ? `Imported ${d.services} services and ${d.products} products. Existing records were not changed.` : d.error ?? 'Import failed.');
    if (res.ok) setReload((n) => n + 1);
  };

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats);
        setRecentBookings(data.recentBookings ?? []);
        setRecentMessages(data.recentMessages ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [reload]);

  const statCards = stats
    ? [
        { label: 'Total Products', value: stats.totalProducts, href: '/admin/products', color: '#1597E5' },
        { label: 'Total Services', value: stats.totalServices, href: '/admin/services', color: '#10b981' },
        { label: 'Contact Messages', value: stats.totalMessages, badge: stats.newMessages, href: '/admin/messages', color: '#f59e0b' },
        { label: 'Booking Requests', value: stats.totalBookings, badge: stats.newBookings, href: '/admin/bookings', color: '#8b5cf6' },
      ]
    : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back to MUNI-QUIP Admin</p>
      </div>

      {stats && (stats.totalProducts === 0 || stats.totalServices === 0) && (
        <div className="mb-8 bg-white border border-blue-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">Load the default MUNI-QUIP content</p>
            <p className="text-xs text-gray-500 mt-1">
              The website is showing built-in default services and products. Import them into the database so you can edit, reorder and add images.
            </p>
          </div>
          <button onClick={importDefaults} disabled={seeding}
            className="px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60 whitespace-nowrap" style={{ backgroundColor: '#1597E5' }}>
            {seeding ? 'Importing...' : 'Import default content'}
          </button>
        </div>
      )}
      {seedMsg && <p className="mb-6 text-sm text-gray-700 bg-white border border-gray-200 px-4 py-3" role="status">{seedMsg}</p>}

      {loading ? (
        <div className="flex items-center gap-3 text-gray-500 text-sm">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {statCards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 block"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{card.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  </div>
                  {card.badge !== undefined && card.badge > 0 && (
                    <span
                      className="text-xs font-bold text-white px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: card.color }}
                    >
                      {card.badge} new
                    </span>
                  )}
                </div>
                <div className="mt-4 h-1" style={{ backgroundColor: card.color, opacity: 0.3 }} />
              </Link>
            ))}
          </div>

          {/* Recent activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent bookings */}
            <div className="bg-white shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Recent Bookings</h2>
                <Link href="/admin/bookings" className="text-xs text-blue-500 hover:text-blue-700">View all</Link>
              </div>
              {recentBookings.length === 0 ? (
                <p className="text-sm text-gray-400 py-4">No bookings yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentBookings.map((b) => (
                    <div key={b._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{b.name}</p>
                        <p className="text-xs text-gray-400">{b.organization || b.serviceType}</p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 ${b.status === 'new' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}
                      >
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent messages */}
            <div className="bg-white shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Recent Messages</h2>
                <Link href="/admin/messages" className="text-xs text-blue-500 hover:text-blue-700">View all</Link>
              </div>
              {recentMessages.length === 0 ? (
                <p className="text-sm text-gray-400 py-4">No messages yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentMessages.map((m) => (
                    <div key={m._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{m.name}</p>
                        <p className="text-xs text-gray-400">{m.email}</p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 ${m.status === 'new' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}
                      >
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
