import Link from 'next/link';
import type { Locale } from '@/lib/localization';
import { translations, pick, localePrefix } from '@/lib/localization';
import type { PageContentData, ServiceData } from '@/lib/defaults';
import { blockText } from '@/lib/pageBlocks';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import ServiceIcon, { ArrowRight } from '@/components/ui/ServiceIcon';

interface SolutionsSectionProps {
  locale: Locale;
  services: ServiceData[];
  content: PageContentData;
}

export default function SolutionsSection({ locale, services, content }: SolutionsSectionProps) {
  const t = translations[locale].solutions;
  const b = (key: string) => blockText(content, key, locale);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white" aria-labelledby="solutions-heading">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
        <header className="text-center max-w-3xl mx-auto mb-12 lg:mb-14">
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.35em] uppercase text-gray-700 mb-3">{b('solutionsEyebrow')}</p>
          <h2 id="solutions-heading" className="text-[1.7rem] sm:text-4xl font-bold uppercase text-[#111820] leading-tight">
            {b('solutionsHeading')}
          </h2>
          <span className="block mx-auto mt-4 mb-5 h-0.5 w-12" style={{ backgroundColor: '#1597E5' }} />
          <p className="text-gray-600 leading-relaxed">{b('solutionsText')}</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {services.map((svc) => {
            const title = pick(locale, svc.titleEn, svc.titleFr);
            const desc = pick(locale, svc.shortDescriptionEn, svc.shortDescriptionFr);
            const cta = pick(locale, svc.ctaEn, svc.ctaFr, t.exploreCta);
            return (
              <article
                key={svc.slug}
                className="group relative flex flex-col bg-white border border-gray-200 shadow-[0_2px_10px_rgba(17,24,32,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(17,24,32,0.12)]"
              >
                <div className="relative h-44 sm:h-40 overflow-hidden">
                  <ImageWithFallback
                    src={svc.image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  />
                </div>
                <span
                  className="absolute left-4 top-[8.4rem] sm:top-[7.9rem] w-12 h-12 rounded-full flex items-center justify-center text-white border-2 border-white shadow-md"
                  style={{ backgroundColor: '#111820' }}
                >
                  <ServiceIcon name={svc.icon} size={20} />
                </span>
                <div className="px-5 pt-9 pb-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-[#111820] mb-2 leading-snug">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5 flex-1">{desc}</p>
                  <Link
                    href={`${localePrefix(locale)}/services#${svc.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#1597E5] hover:text-[#0f7bc4]"
                    aria-label={`${cta}: ${title}`}
                  >
                    {cta}
                    <ArrowRight />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
