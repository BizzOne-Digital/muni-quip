import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/localization';
import { pick, pickList, homePath, localePrefix } from '@/lib/localization';
import { getProductBySlug, getProducts, getServices } from '@/lib/data';
import { DEFAULT_PRODUCTS } from '@/lib/defaults';
import { buildMetadata } from '@/lib/seo';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { ArrowRight } from '@/components/ui/ServiceIcon';

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return ['en', 'fr'].flatMap((locale) => DEFAULT_PRODUCTS.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found | MUNI-QUIP', robots: { index: false } };

  const name = pick(locale, product.nameEn, product.nameFr);
  return buildMetadata({
    locale,
    path: `/products/${slug}`,
    title: pick(locale, product.seoTitleEn, product.seoTitleFr, `${name} | MUNI-QUIP`),
    description: pick(
      locale,
      product.seoDescriptionEn,
      product.seoDescriptionFr,
      pick(locale, product.shortDescriptionEn, product.shortDescriptionFr)
    ).slice(0, 160),
    image: product.heroImage,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const lang: Locale = locale === 'fr' ? 'fr' : 'en';
  const isFr = lang === 'fr';

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [services, sameCategory] = await Promise.all([getServices(), getProducts({ category: product.category })]);
  const service = services.find((s) => s.slug === product.category);
  const categoryLabel = service ? pick(lang, service.titleEn, service.titleFr) : product.category;

  let related = sameCategory.filter((p) => p.slug !== product.slug);
  if (related.length < 3) {
    const others = (await getProducts()).filter((p) => p.slug !== product.slug && !related.some((r) => r.slug === p.slug));
    related = [...related, ...others].slice(0, 3);
  }

  const name = pick(lang, product.nameEn, product.nameFr);
  const subtitle = pick(lang, product.subtitleEn, product.subtitleFr);
  const intro = pick(lang, product.shortDescriptionEn, product.shortDescriptionFr);
  const overview = pick(lang, product.fullDescriptionEn, product.fullDescriptionFr, intro);
  const benefits = pickList(lang, product.benefitsEn, product.benefitsFr);
  const applications = pickList(lang, product.applicationsEn, product.applicationsFr);
  const specs = (product.specifications ?? []).filter((s) => s.key && s.value);
  const gallery = (product.galleryImages ?? []).filter(Boolean);
  const quoteHref = `${localePrefix(lang)}/booking?type=quote&product=${encodeURIComponent(name)}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: intro,
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    category: categoryLabel,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="pt-16 lg:pt-[72px]" style={{ backgroundColor: '#111820' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="order-2 lg:order-1 flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-12 lg:py-20">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                <li><Link href={homePath(lang)} className="hover:text-white">{isFr ? 'Accueil' : 'Home'}</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href={`${localePrefix(lang)}/services${service ? `#${service.slug}` : ''}`} className="hover:text-white">{categoryLabel}</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-gray-200" aria-current="page">{name}</li>
              </ol>
            </nav>

            <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-3" style={{ color: '#1597E5' }}>{categoryLabel}</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white uppercase leading-tight">{name}</h1>
            {subtitle && <p className="text-lg text-gray-300 mt-2">{subtitle}</p>}
            <span className="block h-0.5 w-12 my-6" style={{ backgroundColor: '#1597E5' }} />
            <p className="text-gray-300 leading-relaxed max-w-xl mb-8">{intro}</p>
            {product.price && (
              <p className="text-white text-lg font-semibold mb-6">{product.price}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={quoteHref}
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white uppercase tracking-wide hover:brightness-110"
                style={{ backgroundColor: '#1597E5' }}
              >
                {isFr ? 'Demander une soumission' : 'Request a Quote'}
                <ArrowRight />
              </Link>
              <Link
                href={`${localePrefix(lang)}/booking?type=consultation&product=${encodeURIComponent(name)}`}
                className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold text-white uppercase tracking-wide border border-white/40 hover:bg-white hover:text-[#111820] transition-colors"
              >
                {isFr ? 'Réserver une consultation' : 'Book a Consultation'}
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2 relative min-h-[280px] sm:min-h-[380px] lg:min-h-[560px] bg-[#18232D]">
            <ImageWithFallback src={product.heroImage} alt={name} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow={isFr ? 'Aperçu' : 'Overview'} title={name} />
          <p className="text-gray-600 leading-relaxed text-base sm:text-lg whitespace-pre-line">{overview}</p>
        </div>
      </section>

      {/* Benefits + Applications */}
      {(benefits.length > 0 || applications.length > 0) && (
        <section className="py-16 lg:py-20" style={{ backgroundColor: '#F4F6F8' }}>
          <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {benefits.length > 0 && (
              <div className="bg-white border border-gray-200 p-6 sm:p-8">
                <SectionTitle eyebrow={isFr ? 'Avantages' : 'Benefits'} title={isFr ? 'Avantages clés' : 'Key Benefits'} />
                <ul className="space-y-3">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-gray-700">
                      <svg className="mt-1 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1597E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {applications.length > 0 && (
              <div className="bg-white border border-gray-200 p-6 sm:p-8">
                <SectionTitle eyebrow={isFr ? 'Utilisations' : 'Use cases'} title={isFr ? 'Applications' : 'Applications'} />
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {applications.map((a) => (
                    <li key={a} className="flex items-center gap-3 text-gray-700 border-l-2 pl-3" style={{ borderColor: '#1597E5' }}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Specifications */}
      {specs.length > 0 && (
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle eyebrow={isFr ? 'Données techniques' : 'Technical data'} title={isFr ? 'Spécifications' : 'Specifications'} />
            <dl className="border border-gray-200 divide-y divide-gray-200">
              {specs.map((spec) => (
                <div key={spec.key} className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 px-5 py-4 odd:bg-gray-50">
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{spec.key}</dt>
                  <dd className="sm:col-span-2 text-sm text-gray-900">{spec.value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-xs text-gray-500 mt-3">
              {isFr ? 'Spécifications sujettes à changement. Contactez-nous pour la configuration exacte.' : 'Specifications subject to change. Contact us for exact configuration.'}
            </p>
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="py-16 lg:py-20" style={{ backgroundColor: '#F4F6F8' }}>
          <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
            <SectionTitle eyebrow={isFr ? 'Galerie' : 'Gallery'} title={isFr ? 'En action' : 'In the Field'} />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {gallery.map((src, i) => (
                <div key={src} className="relative aspect-[4/3] overflow-hidden bg-gray-200 group">
                  <ImageWithFallback src={src} alt={`${name} ${i + 1}`} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" sizes="(max-width: 1024px) 50vw, 25vw" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Support */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
          <SectionTitle eyebrow={isFr ? 'Soutien' : 'Support'} title={isFr ? 'Service et soutien MUNI-QUIP' : 'MUNI-QUIP Service & Support'} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(isFr
              ? [
                  ['Consultation', 'Nous évaluons vos besoins et recommandons la bonne configuration.'],
                  ['Mise en service et formation', 'Installation, calibration et formation de vos opérateurs.'],
                  ['Pièces et service', "Pièces d'origine et soutien technique pour réduire les temps d'arrêt."],
                ]
              : [
                  ['Consultation', 'We review your operation and recommend the right configuration.'],
                  ['Setup & Training', 'Installation, calibration and operator training for your crew.'],
                  ['Parts & Service', 'Genuine parts and technical support to keep downtime low.'],
                ]
            ).map(([title, text]) => (
              <div key={title} className="border border-gray-200 p-6 border-t-2" style={{ borderTopColor: '#1597E5' }}>
                <h3 className="font-bold text-[#111820] mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-16 lg:py-20" style={{ backgroundColor: '#18232D' }}>
          <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-gray-400 mb-2">{isFr ? 'Équipement connexe' : 'Related Equipment'}</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase mb-8">{isFr ? 'Vous pourriez aussi considérer' : 'You May Also Consider'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((p) => {
                const rName = pick(lang, p.nameEn, p.nameFr);
                return (
                  <Link key={p.slug} href={`${localePrefix(lang)}/products/${p.slug}`} className="group block bg-white">
                    <div className="relative h-44 overflow-hidden">
                      <ImageWithFallback src={p.heroImage} alt={rName} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" sizes="(max-width: 640px) 100vw, 33vw" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-[#111820]">{rName}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{pick(lang, p.shortDescriptionEn, p.shortDescriptionFr)}</p>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold mt-3 text-[#1597E5]">
                        {isFr ? 'En savoir plus' : 'Learn More'} <ArrowRight />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Quote CTA */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#111820] uppercase mb-4">{isFr ? 'Intéressé par cet équipement?' : 'Interested in This Equipment?'}</h2>
          <p className="text-gray-600 mb-8">
            {isFr
              ? 'Parlez à MUNI-QUIP pour une soumission, une démonstration ou des conseils sur la bonne solution pour votre municipalité.'
              : 'Talk to MUNI-QUIP for a quote, a demonstration or advice on the right solution for your municipality.'}
          </p>
          <Link
            href={quoteHref}
            className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 text-sm font-semibold text-white uppercase tracking-wide hover:brightness-110"
            style={{ backgroundColor: '#1597E5' }}
          >
            {isFr ? 'Demander une soumission' : 'Request a Quote'}
            <ArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-gray-500 mb-2">{eyebrow}</p>
      <h2 className="text-2xl sm:text-3xl font-bold text-[#111820] uppercase">{title}</h2>
      <span className="block h-0.5 w-10 mt-3" style={{ backgroundColor: '#1597E5' }} />
    </div>
  );
}
