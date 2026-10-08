import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSettings } from '@/lib/data';
import type { Locale } from '@/lib/localization';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  return {
    title: isFr
      ? 'MUNI-QUIP | Équipement Municipal, Pièces et Service en Ontario et Québec'
      : 'MUNI-QUIP | Municipal Equipment, Parts & Service in Ontario & Quebec',
    description: isFr
      ? "Équipements municipaux, recyclage d'asphalte, entretien des routes, entretien hivernal, technologie de flotte, pièces et service en Ontario et Québec."
      : 'Municipal equipment, asphalt recycling, road maintenance, winter maintenance, fleet technology, parts and service solutions across Ontario and Quebec.',
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', fr: '/fr' },
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (locale !== 'en' && locale !== 'fr') notFound();
  const safeLocale = locale as Locale;
  const settings = await getSettings();

  return (
    <div className="min-h-screen flex flex-col" lang={safeLocale}>
      <Header locale={safeLocale} />
      <main className="flex-1">{children}</main>
      <Footer locale={safeLocale} settings={settings} />
    </div>
  );
}
