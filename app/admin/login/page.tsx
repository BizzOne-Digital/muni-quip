'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? 'Invalid credentials');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#111820' }}>
      <div className="w-full max-w-sm px-4">
        {/* Logo */}
        <div className="text-center mb-10">
          <Image src="/logo.png" alt="MUNI-QUIP — Reliable Municipal Solutions" width={800} height={501} className="h-24 w-auto mx-auto mb-4" priority />
          <p className="text-xs text-gray-500 tracking-widest uppercase">Admin Panel</p>
        </div>

        <div className="bg-white p-8 shadow-xl">
          <h1 className="text-lg font-bold text-gray-900 mb-6 text-center">Sign In</h1>

          {error && (
            <div className="mb-5 px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 text-sm border border-gray-200 text-gray-900 focus:outline-none focus:border-blue-500"
                placeholder="admin@muni-quip.ca"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 text-sm border border-gray-200 text-gray-900 focus:outline-none focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-sm font-semibold text-white tracking-wide transition-all hover:brightness-110 disabled:opacity-60 mt-2"
              style={{ backgroundColor: '#1597E5' }}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs text-gray-600">
          © MUNI-QUIP. All rights reserved.
        </p>
      </div>
    </div>
  );
}
