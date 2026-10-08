'use client';

import { useEffect, useState } from 'react';

interface Booking {
  _id: string;
  name: string;
  organization: string;
  email: string;
  phone: string;
  province: string;
  preferredDate: string;
  serviceType: string;
  equipment: string;
  message: string;
  language: string;
  status: 'new' | 'read' | 'contacted';
  createdAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Booking | null>(null);

  const fetch_ = () => {
    setLoading(true);
    fetch('/api/admin/bookings')
      .then((r) => r.json())
      .then((d) => setBookings(d.bookings ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

   

  // eslint-disable-next-line react-hooks/set-state-in-effect -- loads admin data on mount
  useEffect(() => { fetch_(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetch_();
    if (selected?._id === id) setSelected((s) => s ? { ...s, status: status as Booking['status'] } : null);
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('Delete this booking?')) return;
    await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
    setSelected(null);
    fetch_();
  };

  const statusColor = (s: string) =>
    s === 'new' ? 'bg-blue-50 text-blue-700' : s === 'contacted' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Booking Requests</h1>
        <p className="text-sm text-gray-500 mt-1">{bookings.length} total</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2 bg-white border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500 text-sm">Loading...</div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">No booking requests yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: '#F4F6F8' }}>
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Service</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((b) => (
                  <tr
                    key={b._id}
                    onClick={() => setSelected(b)}
                    className={`cursor-pointer hover:bg-gray-50 transition-colors ${selected?._id === b._id ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{b.name}</p>
                      <p className="text-xs text-gray-400">{b.organization || b.email}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-500 hidden sm:table-cell text-xs">{b.serviceType || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 ${statusColor(b.status)}`}>{b.status}</span>
                    </td>
                    <td className="px-5 py-4 text-right text-xs text-gray-400">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail panel */}
        <div className="bg-white border border-gray-100 shadow-sm p-6">
          {!selected ? (
            <p className="text-sm text-gray-400 text-center py-8">Select a booking to view details</p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-gray-900">{selected.name}</h3>
                <span className={`text-xs font-semibold px-2 py-0.5 ${statusColor(selected.status)}`}>{selected.status}</span>
              </div>

              {[
                ['Organization', selected.organization],
                ['Email', selected.email],
                ['Phone', selected.phone],
                ['Province', selected.province],
                ['Preferred Date', selected.preferredDate],
                ['Service Type', selected.serviceType],
                ['Equipment', selected.equipment],
                ['Language', selected.language?.toUpperCase()],
              ].map(([k, v]) => v ? (
                <div key={k}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{k}</p>
                  <p className="text-sm text-gray-700 mt-0.5">{v}</p>
                </div>
              ) : null)}

              {selected.message && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Message</p>
                  <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-line">{selected.message}</p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                {(['new', 'read', 'contacted'] as const).map((s) => (
                  <button key={s} onClick={() => updateStatus(selected._id, s)}
                    className={`px-3 py-1.5 text-xs font-semibold border transition-colors ${
                      selected.status === s
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-gray-200 text-gray-500 hover:border-gray-400'
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
                <button onClick={() => deleteBooking(selected._id)}
                  className="px-3 py-1.5 text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors ml-auto">
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
