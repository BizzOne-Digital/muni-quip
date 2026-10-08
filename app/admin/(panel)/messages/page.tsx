'use client';

import { useEffect, useState } from 'react';

interface Message {
  _id: string;
  name: string;
  organization: string;
  email: string;
  phone: string;
  message: string;
  language: string;
  status: 'new' | 'read' | 'contacted';
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  const fetch_ = () => {
    setLoading(true);
    fetch('/api/admin/messages')
      .then((r) => r.json())
      .then((d) => setMessages(d.messages ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

   

  // eslint-disable-next-line react-hooks/set-state-in-effect -- loads admin data on mount
  useEffect(() => { fetch_(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/messages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetch_();
    if (selected?._id === id) setSelected((s) => s ? { ...s, status: status as Message['status'] } : null);
  };

  const deleteMsg = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
    setSelected(null);
    fetch_();
  };

  const statusColor = (s: string) =>
    s === 'new' ? 'bg-blue-50 text-blue-700' : s === 'contacted' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
        <p className="text-sm text-gray-500 mt-1">{messages.length} total</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500 text-sm">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">No messages yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: '#F4F6F8' }}>
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">From</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {messages.map((m) => (
                  <tr key={m._id} onClick={() => setSelected(m)}
                    className={`cursor-pointer hover:bg-gray-50 transition-colors ${selected?._id === m._id ? 'bg-blue-50' : ''}`}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{m.name}</p>
                      <p className="text-xs text-gray-400">{m.organization || '—'}</p>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500 hidden sm:table-cell">{m.email}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 ${statusColor(m.status)}`}>{m.status}</span>
                    </td>
                    <td className="px-5 py-4 text-right text-xs text-gray-400">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white border border-gray-100 shadow-sm p-6">
          {!selected ? (
            <p className="text-sm text-gray-400 text-center py-8">Select a message to view</p>
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
                ['Language', selected.language?.toUpperCase()],
              ].map(([k, v]) => v ? (
                <div key={k}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{k}</p>
                  <p className="text-sm text-gray-700 mt-0.5">{k === 'Email' ? (
                    <a href={`mailto:${v}`} className="text-blue-600 hover:underline">{v}</a>
                  ) : v}</p>
                </div>
              ) : null)}

              {selected.message && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Message</p>
                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-line leading-relaxed">{selected.message}</p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                {(['new', 'read', 'contacted'] as const).map((s) => (
                  <button key={s} onClick={() => updateStatus(selected._id, s)}
                    className={`px-3 py-1.5 text-xs font-semibold border transition-colors ${
                      selected.status === s ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-500 hover:border-gray-400'
                    }`}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
                <a href={`mailto:${selected.email}`}
                  className="px-3 py-1.5 text-xs font-semibold border border-gray-200 text-gray-600 hover:border-gray-400 transition-colors">
                  Reply
                </a>
                <button onClick={() => deleteMsg(selected._id)}
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
