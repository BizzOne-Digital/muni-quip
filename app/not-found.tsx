import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#111820' }}>
      <div className="text-center max-w-lg">
        <p className="text-xs font-semibold tracking-[0.35em] uppercase text-gray-400 mb-4">404</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white uppercase mb-4">Page Not Found / Page introuvable</h1>
        <span className="block mx-auto h-0.5 w-12 mb-6" style={{ backgroundColor: '#1597E5' }} />
        <p className="text-gray-400 mb-8">The page you are looking for does not exist or has moved.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/en" className="px-6 py-3 text-sm font-semibold text-white hover:brightness-110" style={{ backgroundColor: '#1597E5' }}>
            Back to Home
          </Link>
          <Link href="/fr" className="px-6 py-3 text-sm font-semibold text-white border border-white/40 hover:bg-white hover:text-[#111820]">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
