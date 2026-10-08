import Link from 'next/link';
import type { Locale } from '@/lib/localization';
import { translations } from '@/lib/localization';
import Logo from '@/components/ui/Logo';
import type { SettingsData } from '@/lib/defaults';

interface FooterProps {
  locale: Locale;
  settings: SettingsData;
}

export default function Footer({ locale, settings }: FooterProps) {
  const tel = settings.phone.replace(/[^0-9+]/g, '');
  const t = translations[locale];

  const navLinks = [
    { href: `/${locale}`, label: t.nav.home },
    { href: `/${locale}/about`, label: t.nav.about },
    { href: `/${locale}/services`, label: t.nav.services },
    { href: `/${locale}/booking`, label: t.nav.booking },
    { href: `/${locale}/contact`, label: t.nav.contact },
  ];

  return (
    <footer style={{ backgroundColor: '#111820' }} className="text-gray-300">
      {/* Top rule */}
      <div className="h-px w-full" style={{ backgroundColor: 'rgba(21,151,229,0.3)' }} />

      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Logo locale={locale} size="footer" className="mb-5" />
            <p className="text-sm text-gray-400 mb-6 max-w-xs leading-relaxed">
              {locale === 'fr' ? settings.footerTextFr || t.footer.tagline : settings.footerTextEn || t.footer.tagline}
            </p>
            {/* Language switcher */}
            <div className="flex items-center gap-3 text-xs tracking-widest font-medium">
              <Link
                href={`/en`}
                className={`transition-colors ${locale === 'en' ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                EN
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                href={`/fr`}
                className={`transition-colors ${locale === 'fr' ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                FR
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white text-xs font-semibold tracking-widest uppercase mb-5">
              {locale === 'en' ? 'Navigation' : 'Navigation'}
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-xs font-semibold tracking-widest uppercase mb-5">
              {locale === 'en' ? 'Contact' : 'Contact'}
            </h3>
            <address className="not-italic space-y-2 text-sm text-gray-400">
              <p>{settings.address}</p>
              <p>{settings.city}, {settings.province} {settings.postalCode}</p>
              <p className="pt-1">
                <a href={`tel:${tel}`} className="hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors break-all" style={{ color: '#1597E5' }}>
                  {settings.email}
                </a>
              </p>
              <p className="pt-2 text-gray-500 text-xs">
                {locale === 'en' ? 'Serving Ontario & Quebec' : 'Au service de l\'Ontario et du Québec'}
              </p>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p>© {new Date().getFullYear()} {t.footer.copyright.replace('© ', '')}</p>
          <p>
            {locale === 'fr' ? settings.footerTextFr : settings.footerTextEn}
          </p>
        </div>
      </div>
    </footer>
  );
}
