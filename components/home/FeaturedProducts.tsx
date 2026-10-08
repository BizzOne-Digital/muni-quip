import Link from 'next/link';
import type { Locale } from '@/lib/localization';
import { translations, pick, localePrefix } from '@/lib/localization';
import type { PageContentData, ProductData } from '@/lib/defaults';
import { blockText } from '@/lib/pageBlocks';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { ArrowRight } from '@/components/ui/ServiceIcon';

interface FeaturedProductsProps {
  locale: Locale;
  products: ProductData[];
  content: PageContentData;
}

export default function FeaturedProducts({ locale, products, content }: FeaturedProductsProps) {
  const t = translations[locale].products;
  const b = (key: string) => blockText(content, key, locale);
  if (products.length === 0) return null;

  return (
    <section
      className="relative py-16 sm:py-20 lg:py-24 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #18232D 0%, #263540 100%)' }}
      aria-labelledby="featured-heading"
    >
      <div className="relative max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
        <header className="text-center mb-10 lg:mb-12">
          <div className="flex items-center justify-center gap-4 mb-3">
            <span className="h-px w-10 sm:w-16 bg-gray-400/60" />
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.35em] uppercase text-gray-300">{b('productsEyebrow')}</p>
            <span className="h-px w-10 sm:w-16 bg-gray-400/60" />
          </div>
          <h2 id="featured-heading" className="text-[1.6rem] sm:text-4xl font-bold uppercase text-white leading-tight">
            {b('productsHeading')}
          </h2>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product) => {
            const name = pick(locale, product.nameEn, product.nameFr);
            const subtitle = pick(locale, product.subtitleEn, product.subtitleFr);
            const desc = pick(locale, product.shortDescriptionEn, product.shortDescriptionFr);

            return (
              <article
                key={product.slug}
                className="group flex flex-col bg-white shadow-[0_6px_24px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:-translate-y-1"
              >
                <Link href={`${localePrefix(locale)}/products/${product.slug}`} className="relative block h-48 overflow-hidden bg-gray-100" tabIndex={-1} aria-hidden="true">
                  <ImageWithFallback
                    src={product.heroImage}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </Link>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-[#111820] leading-tight">{name}</h3>
                  {subtitle && <p className="text-sm font-semibold text-[#263540] mt-0.5">{subtitle}</p>}
                  <p className="text-sm text-gray-600 leading-relaxed mt-2 mb-5 flex-1">{desc}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <Link
                      href={`${localePrefix(locale)}/products/${product.slug}`}
                      className="group/btn inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white hover:brightness-110"
                      style={{ backgroundColor: '#1597E5' }}
                      aria-label={`${t.learnMore}: ${name}`}
                    >
                      {t.learnMore}
                      <ArrowRight size={12} />
                    </Link>
                    <Link
                      href={`${localePrefix(locale)}/booking?product=${encodeURIComponent(name)}`}
                      className="text-xs font-semibold text-[#1597E5] hover:text-[#0f7bc4]"
                    >
                      {t.requestQuote}
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
