import Link from 'next/link';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/localization';
import { pick } from '@/lib/localization';
import { getPageContent, getProducts, getServices } from '@/lib/data';
import { IMAGES } from '@/lib/defaults';
import { buildMetadata } from '@/lib/seo';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import ServiceIcon, { ArrowRight } from '@/components/ui/ServiceIcon';

export const revalidate = 60;

interface ServicesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ServicesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const page = await getPageContent('services');
  return buildMetadata({
    locale,
    path: '/services',
    title: pick(locale, page.seoTitleEn, page.seoTitleFr, locale === 'fr' ? 'Services et solutions municipales | MUNI-QUIP' : 'Municipal Services & Solutions | MUNI-QUIP'),
    description: pick(
      locale,
      page.seoDescriptionEn,
      page.seoDescriptionFr,
      locale === 'fr'
        ? "Réparation d'asphalte, entretien routier et hivernal, sécurité de flotte, pièces et service pour les municipalités de l'Ontario et du Québec."
        : 'Asphalt repair, road and winter maintenance, fleet safety, parts and service for municipalities across Ontario and Quebec.'
    ),
    image: page.heroImage || IMAGES.works,
  });
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  const lang: Locale = locale === 'fr' ? 'fr' : 'en';
  const isFr = lang === 'fr';

  const [page, services, products] = await Promise.all([getPageContent('services'), getServices(), getProducts()]);

  const heading = pick(lang, page.heroHeadingEn, page.heroHeadingFr, isFr ? 'Services et solutions' : 'Services & Solutions');
  const description = pick(
    lang,
    page.heroDescriptionEn,
    page.heroDescriptionFr,
    isFr
      ? "Équipements, technologies, pièces et service pour les opérations municipales de l'Ontario et du Québec."
      : 'Equipment, technology, parts and service for municipal operations across Ontario and Quebec.'
  );

  return (
    <>
      {/* Hero */}
      <section className="relative pt-16 lg:pt-[72px] overflow-hidden" style={{ backgroundColor: '#111820' }}>
        <div className="absolute inset-0">
          <ImageWithFallback src={page.heroImage || IMAGES.works} alt="" fill priority className="object-cover opacity-30" sizes="100vw" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(17,24,32,0.95) 0%, rgba(17,24,32,0.7) 60%, rgba(17,24,32,0.4) 100%)' }} />
        </div>
        <div className="relative max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16 py-16 sm:py-24">
          <p className="text-xs font-semibold tracking-[0.35em] uppercase text-gray-300 mb-4">{isFr ? 'Nos solutions' : 'Our Solutions'}</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white uppercase leading-tight max-w-3xl">{heading}</h1>
          <span className="block h-0.5 w-12 my-6" style={{ backgroundColor: '#1597E5' }} />
          <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">{description}</p>

          {/* Jump links */}
          <nav aria-label={isFr ? 'Solutions' : 'Solutions'} className="mt-10 flex flex-wrap gap-2">
            {services.map((s) => (
              <a key={s.slug} href={`#${s.slug}`} className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-200 border border-white/20 hover:border-[#1597E5] hover:text-white transition-colors">
                <ServiceIcon name={s.icon} size={14} />
                {pick(lang, s.titleEn, s.titleFr)}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {services.map((svc, idx) => {
        const title = pick(lang, svc.titleEn, svc.titleFr);
        const headline = pick(lang, svc.headlineEn, svc.headlineFr, pick(lang, svc.shortDescriptionEn, svc.shortDescriptionFr));
        const body = pick(lang, svc.fullContentEn, svc.fullContentFr, pick(lang, svc.shortDescriptionEn, svc.shortDescriptionFr));
        const related = products.filter((p) => p.category === svc.slug);
        const reverse = idx % 2 === 1;

        return (
          <section key={svc.slug} id={svc.slug} className={`scroll-mt-20 ${reverse ? 'bg-[#F4F6F8]' : 'bg-white'}`} aria-labelledby={`${svc.slug}-title`}>
            <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16 py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
              <div className={`relative aspect-[4/3] overflow-hidden shadow-lg ${reverse ? 'lg:order-2' : ''}`}>
                <ImageWithFallback src={svc.image} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                <span className="absolute left-5 bottom-5 w-12 h-12 rounded-full flex items-center justify-center text-white border-2 border-white" style={{ backgroundColor: '#111820' }}>
                  <ServiceIcon name={svc.icon} />
                </span>
              </div>

              <div className={reverse ? 'lg:order-1' : ''}>
                <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-3" style={{ color: '#1597E5' }}>
                  {String(idx + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
                </p>
                <h2 id={`${svc.slug}-title`} className="text-3xl sm:text-4xl font-bold text-[#111820] uppercase leading-tight">{title}</h2>
                <span className="block h-0.5 w-10 my-5" style={{ backgroundColor: '#1597E5' }} />
                <p className="text-lg font-semibold text-[#263540] mb-4 leading-snug">{headline}</p>
                <p className="text-gray-600 leading-relaxed mb-7 whitespace-pre-line">{body}</p>

                {related.length > 0 && (
                  <div className="mb-8">
                    <p className="text-xs font-bold tracking-widest text-[#111820] uppercase mb-3">{isFr ? 'Produits associés' : 'Related Products'}</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {related.map((p) => {
                        const pName = pick(lang, p.nameEn, p.nameFr);
                        return (
                          <li key={p.slug}>
                            <Link href={`/${lang}/products/${p.slug}`} className="group flex items-center gap-3 bg-white border border-gray-200 p-2 pr-3 hover:border-[#1597E5] transition-colors">
                              <span className="relative w-14 h-14 flex-shrink-0 overflow-hidden bg-gray-100">
                                <ImageWithFallback src={p.heroImage} alt="" fill className="object-cover" sizes="56px" />
                              </span>
                              <span className="text-sm font-semibold text-[#111820] leading-tight flex-1">{pName}</span>
                              <span className="text-[#1597E5]"><ArrowRight /></span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/${lang}/booking?service=${encodeURIComponent(title)}`}
                    className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white hover:brightness-110"
                    style={{ backgroundColor: '#1597E5' }}
                  >
                    {isFr ? 'Demander une soumission' : 'Request a Quote'}
                    <ArrowRight />
                  </Link>
                  <Link href={`/${lang}/contact`} className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-[#111820] border border-gray-300 hover:border-[#111820] transition-colors">
                    {isFr ? 'Parler à un expert' : 'Talk to an Expert'}
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <section className="py-16 lg:py-20" style={{ backgroundColor: '#111820' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white uppercase mb-4">{isFr ? 'Parlons de votre opération' : "Let's Talk About Your Operation"}</h2>
          <p className="text-gray-400 mb-8">
            {isFr
              ? 'Dites-nous ce que vous cherchez à améliorer. Nous vous aiderons à trouver la solution pratique.'
              : "Tell us what you're trying to improve. We'll help you find the practical solution."}
          </p>
          <Link href={`/${lang}/booking`} className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 text-sm font-semibold text-white hover:brightness-110" style={{ backgroundColor: '#1597E5' }}>
            {isFr ? 'Réserver une consultation' : 'Book a Consultation'}
            <ArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}
