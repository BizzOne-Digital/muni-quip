import Link from 'next/link';
import type { Locale } from '@/lib/localization';
import { translations, pick, localePrefix } from '@/lib/localization';
import type { PageContentData } from '@/lib/defaults';
import { IMAGES } from '@/lib/defaults';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { ArrowRight } from '@/components/ui/ServiceIcon';

interface HeroSectionProps {
  locale: Locale;
  content: PageContentData;
}

export default function HeroSection({ locale, content }: HeroSectionProps) {
  const t = translations[locale].hero;

  // Admin heading: one line per row, the last row is accented in blue.
  const adminHeading = pick(locale, content.heroHeadingEn, content.heroHeadingFr);
  const lines = adminHeading
    ? adminHeading.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    : [t.headline1, t.headline2, t.headline3, t.headline4];
  const accent = lines.length > 1 ? lines.pop() : undefined;

  const description = pick(locale, content.heroDescriptionEn, content.heroDescriptionFr, t.description);
  const cta1 = pick(locale, content.heroCta1En, content.heroCta1Fr, t.cta1);
  const cta2 = pick(locale, content.heroCta2En, content.heroCta2Fr, t.cta2);
  const image = content.heroImage || IMAGES.hero;

  const trust = [
    { icon: <CanadaIcon />, top: t.trust1a, bottom: t.trust1b },
    { icon: <ShieldIcon />, top: t.trust2, bottom: t.trust3 },
    { icon: <PeopleIcon />, top: t.trust4a, bottom: t.trust4b },
  ];

  return (
    <section className="relative w-full overflow-hidden pt-16 lg:pt-[72px]" style={{ backgroundColor: '#111820' }}>
      <div className="absolute inset-0">
        <ImageWithFallback
          src={image}
          alt={locale === 'fr' ? 'Équipe municipale en réfection de chaussée' : 'Municipal crew repairing asphalt pavement'}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_center] md:object-[82%_center]"
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{ background: 'linear-gradient(90deg, rgba(17,24,32,0.96) 0%, rgba(17,24,32,0.88) 32%, rgba(17,24,32,0.45) 58%, rgba(17,24,32,0.05) 100%)' }}
        />
        <div
          className="absolute inset-0 md:hidden"
          style={{ background: 'linear-gradient(180deg, rgba(17,24,32,0.75) 0%, rgba(17,24,32,0.92) 55%, rgba(17,24,32,0.98) 100%)' }}
        />
      </div>

      <div className="relative z-10 max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16 py-16 sm:py-20 lg:py-28">
        <div className="max-w-xl lg:max-w-2xl 2xl:max-w-3xl animate-fade-up">
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.35em] uppercase text-gray-300 mb-5">{t.eyebrow}</p>

          <h1 className="font-bold uppercase text-white leading-[0.98] mb-6 text-[2.6rem] sm:text-6xl lg:text-[4.6rem] 2xl:text-[5.4rem]">
            {lines.map((line) => (
              <span key={line} className="block">{line}</span>
            ))}
            {accent && <span className="block" style={{ color: '#1597E5' }}>{accent}</span>}
          </h1>

          <p className="text-base sm:text-lg text-gray-200/90 mb-9 max-w-lg leading-relaxed">{description}</p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12">
            <Link
              href={`${localePrefix(locale)}/services`}
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5"
              style={{ backgroundColor: '#1597E5' }}
            >
              {cta1}
              <ArrowRight size={16} />
            </Link>
            <Link
              href={`${localePrefix(locale)}/contact`}
              className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold text-white border border-white/50 transition-all duration-200 hover:bg-white hover:text-[#111820]"
            >
              {cta2}
            </Link>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {trust.map((item) => (
              <li key={item.top} className="flex items-center gap-3">
                <span className="text-gray-200 flex-shrink-0">{item.icon}</span>
                <span className="text-[11px] leading-tight tracking-wide uppercase">
                  <span className="block text-gray-400">{item.top}</span>
                  <span className="block font-semibold text-white">{item.bottom}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CanadaIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l3-1 2 2 2-4 2 3 3-2 1 3 3 1 2 2-2 2 1 3-4 1-1 2-3-1-3 1-2-2-3 1-1-3-2-1 1-3z" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function PeopleIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="7" r="3" />
      <path d="M3 21v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2" />
      <circle cx="17" cy="8" r="2.5" />
      <path d="M17 14a4 4 0 0 1 4 4v3" />
    </svg>
  );
}
