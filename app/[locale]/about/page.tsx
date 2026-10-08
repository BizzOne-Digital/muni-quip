import Link from 'next/link';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/localization';
import { pick, localePrefix } from '@/lib/localization';
import { getGallery, getPageContent, getSettings } from '@/lib/data';
import { IMAGES } from '@/lib/defaults';
import { buildMetadata } from '@/lib/seo';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import CredibilityStrip from '@/components/home/CredibilityStrip';
import { ArrowRight } from '@/components/ui/ServiceIcon';

export const revalidate = 60;

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const page = await getPageContent('about');
  return buildMetadata({
    locale,
    path: '/about',
    title: pick(locale, page.seoTitleEn, page.seoTitleFr, locale === 'fr' ? 'À propos de MUNI-QUIP | Solutions municipales pratiques' : 'About MUNI-QUIP | Practical Municipal Solutions'),
    description: pick(
      locale,
      page.seoDescriptionEn,
      page.seoDescriptionFr,
      locale === 'fr'
        ? "MUNI-QUIP fournit équipements spécialisés, technologies, pièces et service aux municipalités et services des travaux publics de l'Ontario et du Québec."
        : 'MUNI-QUIP provides specialized equipment, technology, parts and service to municipalities and public works departments across Ontario and Quebec.'
    ),
    image: page.heroImage || IMAGES.road,
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const lang: Locale = locale === 'fr' ? 'fr' : 'en';
  const isFr = lang === 'fr';

  const [page, settings, gallery, home] = await Promise.all([getPageContent('about'), getSettings(), getGallery(), getPageContent('home')]);

  const heading = pick(lang, page.heroHeadingEn, page.heroHeadingFr, isFr ? 'Des solutions pratiques pour les opérations municipales' : 'Practical Solutions for Municipal Operations');
  const heroText = pick(
    lang,
    page.heroDescriptionEn,
    page.heroDescriptionFr,
    isFr ? 'MUNI-QUIP — Équipement municipal. Solutions pratiques.' : 'MUNI-QUIP — Municipal Equipment. Practical Solutions.'
  );
  const introTitle = pick(lang, page.section1HeadingEn, page.section1HeadingFr, isFr ? 'Qui nous sommes' : 'Who We Are');
  const introText = pick(
    lang,
    page.section1TextEn,
    page.section1TextFr,
    isFr
      ? "MUNI-QUIP fournit des équipements spécialisés, des technologies, des pièces et des solutions de service aux municipalités et aux services des travaux publics partout au Canada.\n\nNous travaillons avec les professionnels municipaux pour trouver des solutions pratiques qui améliorent la productivité, réduisent les coûts d'exploitation, prolongent la vie des équipements et rendent l'entretien routier plus efficace.\n\nDu recyclage d'asphalte et de l'équipement d'entretien routier aux systèmes d'épandage, à la calibration, aux pièces, à la technologie et à l'équipement usagé spécialisé, MUNI-QUIP réunit des produits éprouvés et une expertise de l'industrie pour aider les municipalités à tirer le meilleur de leurs équipements et de leurs budgets."
      : 'MUNI-QUIP provides specialized equipment, technology, parts, and service solutions to municipalities and public works departments across Canada.\n\nWe work with municipal professionals to identify practical solutions that improve productivity, reduce operating costs, extend equipment life, and make road maintenance operations more efficient.\n\nFrom asphalt recycling and road maintenance equipment to spreading systems, calibration, parts, technology, and specialized used equipment, MUNI-QUIP brings together proven products and industry expertise to help municipalities get more from their equipment and their budgets.'
  );

  const mission = isFr
    ? [
        "Notre mission est d'aider les municipalités à travailler plus intelligemment en fournissant des solutions d'équipement et de service pratiques et rentables qui améliorent l'efficacité, réduisent les coûts d'exploitation et prolongent la vie de leurs infrastructures et de leurs équipements.",
        'Nous nous engageons à comprendre les défis des professionnels des travaux publics et à les mettre en relation avec des produits, des technologies et une expertise éprouvés qui donnent des résultats concrets.',
      ]
    : [
        'Our mission is to help municipalities work smarter by providing practical, cost-effective equipment and service solutions that improve efficiency, reduce operating costs, and extend the life of their infrastructure and equipment.',
        'We are committed to understanding the challenges faced by public works professionals and connecting them with proven products, technology, and expertise that deliver real-world results.',
      ];

  const whatWeDo = isFr
    ? [
        ["Recyclage d'asphalte", "Produire de l'enrobé chaud à partir d'asphalte récupéré, quand et où vous en avez besoin."],
        ['Entretien routier', 'Équipements pour garder les chaussées sécuritaires et en bon état toute l’année.'],
        ['Épandage et calibration', "Contrôles d'épandeurs, calibration et soutien pour les flottes d'hiver."],
        ['Technologie de flotte', 'Caméras, capteurs et systèmes de visibilité pour des opérations plus sûres.'],
        ['Pièces et service', "Pièces d'origine et soutien technique pour limiter les temps d'arrêt."],
        ['Équipement usagé spécialisé', 'Options éprouvées pour les budgets municipaux serrés.'],
      ]
    : [
        ['Asphalt Recycling', 'Produce hot mix from reclaimed asphalt, when and where you need it.'],
        ['Road Maintenance', 'Equipment to keep pavement safe and in good condition year-round.'],
        ['Spreading & Calibration', 'Spreader controls, calibration and support for winter fleets.'],
        ['Fleet Technology', 'Cameras, sensors and visibility systems for safer operations.'],
        ['Parts & Service', 'Genuine parts and technical support to keep downtime low.'],
        ['Specialized Used Equipment', 'Proven options for tight municipal budgets.'],
      ];

  const approach = isFr
    ? [
        ['Écouter', 'Nous commençons par comprendre votre opération, votre flotte et vos contraintes budgétaires.'],
        ['Recommander', 'Nous proposons des solutions éprouvées, adaptées à vos besoins réels, sans surenchère.'],
        ['Mettre en place', 'Livraison, mise en service, calibration et formation de vos équipes.'],
        ['Soutenir', 'Pièces, service et conseils techniques pendant toute la vie de l’équipement.'],
      ]
    : [
        ['Listen', 'We start by understanding your operation, your fleet and your budget constraints.'],
        ['Recommend', 'We propose proven solutions that fit your real needs, without overselling.'],
        ['Implement', 'Delivery, commissioning, calibration and training for your crews.'],
        ['Support', 'Parts, service and technical guidance for the life of the equipment.'],
      ];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-16 lg:pt-[72px] overflow-hidden" style={{ backgroundColor: '#111820' }}>
        <div className="absolute inset-0">
          <ImageWithFallback src={page.heroImage || IMAGES.road} alt="" fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(17,24,32,0.96) 0%, rgba(17,24,32,0.8) 50%, rgba(17,24,32,0.35) 100%)' }} />
        </div>
        <div className="relative max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16 py-16 sm:py-24 lg:py-28">
          <p className="text-xs font-semibold tracking-[0.35em] uppercase text-gray-300 mb-4">{isFr ? 'À propos de MUNI-QUIP' : 'About MUNI-QUIP'}</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white uppercase leading-tight max-w-3xl">{heading}</h1>
          <span className="block h-0.5 w-12 my-6" style={{ backgroundColor: '#1597E5' }} />
          <p className="text-lg text-gray-300 max-w-xl">{heroText}</p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <SectionTitle eyebrow={isFr ? 'Notre entreprise' : 'Our Company'} title={introTitle} />
            <div className="space-y-4 text-gray-600 leading-relaxed">
              {introText.split(/\n{2,}/).map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
            </div>
          </div>
          <div className="relative aspect-[4/3] shadow-xl">
            <ImageWithFallback src={IMAGES.asphalt} alt={isFr ? 'Équipe de travaux publics en réfection de chaussée' : 'Public works crew repairing pavement'} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            <div className="absolute -bottom-6 -left-2 sm:-left-6 bg-[#111820] text-white px-6 py-5 max-w-[16rem]">
              <p className="text-3xl font-bold" style={{ color: '#1597E5' }}>ON · QC</p>
              <p className="text-xs uppercase tracking-widest text-gray-300 mt-1">{isFr ? 'Service bilingue' : 'Bilingual service'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: '#18232D' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.35em] uppercase text-gray-400 mb-3">{isFr ? 'Notre mission' : 'Our Mission'}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white uppercase mb-6">{isFr ? 'Aider les municipalités à travailler plus intelligemment' : 'Helping Municipalities Work Smarter'}</h2>
          <span className="block mx-auto h-0.5 w-12 mb-8" style={{ backgroundColor: '#1597E5' }} />
          {mission.map((p) => (
            <p key={p.slice(0, 30)} className="text-gray-300 text-lg leading-relaxed mb-4">{p}</p>
          ))}
        </div>
      </section>

      {/* What we do */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
          <SectionTitle eyebrow={isFr ? 'Notre expertise' : 'Our Expertise'} title={isFr ? 'Ce que nous faisons' : 'What We Do'} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whatWeDo.map(([title, text]) => (
              <div key={title} className="border border-gray-200 p-6 border-t-2 hover:shadow-md transition-shadow" style={{ borderTopColor: '#1597E5' }}>
                <h3 className="font-bold text-[#111820] mb-2 uppercase">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-6">
            {isFr
              ? 'Distributeur de marques éprouvées, dont BAGELA, NOVILCO et DICKEY-john.'
              : 'Distributor of proven brands including BAGELA, NOVILCO and DICKEY-john.'}
          </p>
        </div>
      </section>

      {/* Why choose */}
      <section className="py-4" style={{ backgroundColor: '#F4F6F8' }}>
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16 pt-12">
          <SectionTitle eyebrow={isFr ? 'Pourquoi nous' : 'Why Us'} title={isFr ? 'Pourquoi les municipalités choisissent MUNI-QUIP' : 'Why Municipalities Choose MUNI-QUIP'} />
        </div>
        <CredibilityStrip locale={lang} content={home} />
      </section>

      {/* Approach */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
          <SectionTitle eyebrow={isFr ? 'Notre philosophie' : 'Our Philosophy'} title={isFr ? 'Notre approche' : 'Our Approach'} />
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {approach.map(([title, text], i) => (
              <li key={title} className="relative bg-[#F4F6F8] p-6">
                <span className="text-4xl font-bold text-gray-300">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-bold text-[#111820] uppercase mt-2 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Gallery (admin-managed) */}
      {gallery.length > 0 && (
        <section className="py-16 lg:py-20" style={{ backgroundColor: '#F4F6F8' }}>
          <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
            <SectionTitle eyebrow={isFr ? 'Galerie' : 'Gallery'} title={isFr ? 'Sur le terrain' : 'In the Field'} />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {gallery.map((item, i) => {
                const caption = pick(lang, item.captionEn, item.captionFr);
                return (
                  <figure key={item._id} className="relative aspect-[4/3] overflow-hidden bg-gray-200 group">
                    <ImageWithFallback src={item.url} alt={caption || `MUNI-QUIP ${i + 1}`} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" sizes="(max-width: 1024px) 50vw, 25vw" />
                    {caption && (
                      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent text-white text-xs p-3">{caption}</figcaption>
                    )}
                  </figure>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Service area + CTA */}
      <section className="overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative min-h-[300px]">
            <ImageWithFallback src={IMAGES.winter} alt={isFr ? 'Déneigement municipal' : 'Municipal snow clearing'} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
          <div className="flex flex-col justify-center px-4 sm:px-10 py-14 lg:px-16" style={{ backgroundColor: '#111820' }}>
            <p className="text-xs font-semibold tracking-[0.35em] uppercase text-gray-400 mb-3">{isFr ? 'Zone de service' : 'Service Area'}</p>
            <h2 className="text-3xl font-bold text-white uppercase mb-4">{isFr ? settings.serviceAreaFr : settings.serviceAreaEn}</h2>
            <p className="text-gray-300 leading-relaxed mb-8">
              {isFr
                ? "Depuis Cornwall, en Ontario, MUNI-QUIP sert les villes, les municipalités et les services des travaux publics de l'Ontario et du Québec."
                : 'From our base in Cornwall, Ontario, MUNI-QUIP serves cities, towns, municipalities and public works departments across Ontario and Quebec.'}
            </p>
            <Link href={`${localePrefix(lang)}/contact`} className="group inline-flex items-center justify-center gap-2 w-full sm:w-fit px-7 py-3.5 text-sm font-semibold text-white hover:brightness-110" style={{ backgroundColor: '#1597E5' }}>
              {isFr ? 'Parlez à MUNI-QUIP' : 'Talk to MUNI-QUIP'}
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-gray-500 mb-2">{eyebrow}</p>
      <h2 className="text-2xl sm:text-3xl font-bold text-[#111820] uppercase">{title}</h2>
      <span className="block h-0.5 w-10 mt-3" style={{ backgroundColor: '#1597E5' }} />
    </div>
  );
}
