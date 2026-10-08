import type { Metadata } from 'next';
import type { Locale } from '@/lib/localization';
import { pick } from '@/lib/localization';
import { getPageContent, getProducts, getServices, getSettings } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';
import { IMAGES } from '@/lib/defaults';
import HeroSection from '@/components/home/HeroSection';
import SolutionsSection from '@/components/home/SolutionsSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import AboutSection from '@/components/home/AboutSection';
import CredibilityStrip from '@/components/home/CredibilityStrip';
import ContactCTA from '@/components/home/ContactCTA';
import { blockText } from '@/lib/pageBlocks';

export const revalidate = 60;

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const page = await getPageContent('home');
  return buildMetadata({
    locale,
    path: '',
    title: pick(
      locale,
      page.seoTitleEn,
      page.seoTitleFr,
      locale === 'fr'
        ? 'MUNI-QUIP | Équipement municipal, pièces et service en Ontario et au Québec'
        : 'MUNI-QUIP | Municipal Equipment, Parts & Service in Ontario & Quebec'
    ),
    description: pick(
      locale,
      page.seoDescriptionEn,
      page.seoDescriptionFr,
      locale === 'fr'
        ? "Équipement municipal, recyclage d'asphalte, entretien routier et hivernal, technologie de flotte, pièces et service en Ontario et au Québec."
        : 'Municipal equipment, asphalt recycling, road maintenance, winter maintenance, fleet technology, parts and service solutions across Ontario and Quebec.'
    ),
    image: page.heroImage || IMAGES.hero,
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const lang: Locale = locale === 'fr' ? 'fr' : 'en';

  const [content, services, products, settings] = await Promise.all([
    getPageContent('home'),
    getServices(),
    getProducts({ featured: true }),
    getSettings(),
  ]);

  return (
    <>
      <HeroSection locale={lang} content={content} />
      <SolutionsSection locale={lang} services={services} content={content} />
      <FeaturedProducts locale={lang} products={products.slice(0, 4)} content={content} />
      <AboutSection locale={lang} content={content} />
      <CredibilityStrip locale={lang} content={content} />
      <ContactCTA
        locale={lang}
        settings={settings}
        eyebrow={blockText(content, 'contactEyebrow', lang)}
        heading={blockText(content, 'contactHeading', lang)}
        text={blockText(content, 'contactText', lang)}
      />
    </>
  );
}
