'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import type { Locale } from '@/lib/localization';
import { translations } from '@/lib/localization';
import Logo from '@/components/ui/Logo';

interface HeaderProps {
  locale: Locale;
}

export default function Header({ locale }: HeaderProps) {
  const t = translations[locale].nav;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const otherLocale = locale === 'en' ? 'fr' : 'en';
  const switchPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  const navLinks = [
    { href: `/${locale}`, label: t.home },
    { href: `/${locale}/about`, label: t.about },
    { href: `/${locale}/services`, label: t.services },
    { href: `/${locale}/booking`, label: t.booking },
    { href: `/${locale}/contact`, label: t.contact },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg' : ''
      }`}
      style={{ backgroundColor: '#111820', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Logo locale={locale} />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-200 group ${
                  isActive(link.href)
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
                {/* Active underline */}
                <span
                  className={`absolute bottom-0 left-4 right-4 h-0.5 transition-all duration-200 ${
                    isActive(link.href) ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                  }`}
                  style={{ backgroundColor: '#1597E5' }}
                />
              </Link>
            ))}
          </nav>

          {/* Right side: Language + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language switcher */}
            <Link
              href={switchPath}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors tracking-widest"
              aria-label={`Switch to ${otherLocale === 'fr' ? 'French' : 'English'}`}
            >
              <span style={{ color: locale === 'en' ? '#1597E5' : '#9ca3af' }}>EN</span>
              <span className="mx-1 text-gray-500">|</span>
              <span style={{ color: locale === 'fr' ? '#1597E5' : '#9ca3af' }}>FR</span>
            </Link>

            {/* CTA Button */}
            <Link
              href={`/${locale}/contact`}
              className="px-5 py-2 text-sm font-semibold tracking-wider text-white transition-all duration-200 hover:brightness-110 active:scale-95"
              style={{ backgroundColor: '#1597E5' }}
            >
              {t.requestQuote} →
            </Link>
          </div>

          {/* Mobile: Language + Hamburger */}
          <div className="lg:hidden flex items-center gap-3">
            <Link
              href={switchPath}
              className="text-xs font-medium tracking-widest"
            >
              <span style={{ color: locale === 'en' ? '#1597E5' : '#9ca3af' }}>EN</span>
              <span className="mx-1 text-gray-500">|</span>
              <span style={{ color: locale === 'fr' ? '#1597E5' : '#9ca3af' }}>FR</span>
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-gray-300 hover:text-white transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t"
          style={{ backgroundColor: '#18232D', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center px-3 py-3 text-sm font-medium tracking-wide rounded transition-colors ${
                  isActive(link.href)
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive(link.href) && (
                  <span className="w-1 h-4 mr-3 rounded-full" style={{ backgroundColor: '#1597E5' }} />
                )}
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <Link
                href={`/${locale}/contact`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full py-3 text-sm font-semibold tracking-wider text-white"
                style={{ backgroundColor: '#1597E5' }}
              >
                {t.requestQuote} →
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
