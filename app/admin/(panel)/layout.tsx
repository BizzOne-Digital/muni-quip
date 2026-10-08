import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { getAdminSession } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Admin | MUNI-QUIP',
  robots: { index: false, follow: false },
};

// Server-side guard in addition to proxy.ts, so the panel never renders without a valid session.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await getAdminSession())) redirect('/admin/login');

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: '#F4F6F8' }}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
