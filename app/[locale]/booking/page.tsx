import type { Metadata } from 'next';
import type { Locale } from '@/lib/localization';
import { pick } from '@/lib/localization';
import { getPageContent, getProducts, getSettings } from '@/lib/data';
import { IMAGES } from '@/lib/defaults';
import { buildMetadata } from '@/lib/seo';
import BookingForm from '@/components/forms/BookingForm';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

interface BookingPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string; service?: string; type?: string }>;
}

export async function generateMetadata({ params }: BookingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const page = await getPageContent('booking');
  return buildMetadata({
    locale,
    path: '/booking',
    title: pick(locale, page.seoTitleEn, page.seoTitleFr, locale === 'fr' ? 'Réserver un service ou une consultation | MUNI-QUIP' : 'Book Service or Request a Consultation | MUNI-QUIP'),
    description: pick(
      locale,
      page.seoDescriptionEn,
      page.seoDescriptionFr,
      locale === 'fr'
        ? 'Demandez une consultation, une soumission, du soutien pour les pièces, une calibration ou du service technique auprès de MUNI-QUIP.'
        : 'Request an equipment consultation, product quote, parts support, calibration or technical service from MUNI-QUIP.'
    ),
  });
}

export default async function BookingPage({ params, searchParams }: BookingPageProps) {
  const { locale } = await params;
  const query = await searchParams;
  const lang: Locale = locale === 'fr' ? 'fr' : 'en';
  const isFr = lang === 'fr';

  const [page, products, settings] = await Promise.all([getPageContent('booking'), getProducts(), getSettings()]);
  const equipmentOptions = products.map((p) => pick(lang, p.nameEn, p.nameFr));
  const initialEquipment = (query.product ?? query.service ?? '').slice(0, 120);

  const heading = pick(lang, page.heroHeadingEn, page.heroHeadingFr, isFr ? 'Réserver un service / Demander une consultation' : 'Book Service / Request a Consultation');
  const description = pick(
    lang,
    page.heroDescriptionEn,
    page.heroDescriptionFr,
    isFr
      ? "Dites-nous ce dont vous avez besoin et notre équipe vous répondra dans un délai d'un jour ouvrable."
      : 'Tell us what you need and our team will respond within one business day.'
  );

  const steps = isFr
    ? [['Envoyez votre demande', 'Indiquez le service, l’équipement et la date souhaitée.'], ['Nous vous contactons', 'Un membre de l’équipe confirme les détails avec vous.'], ['Nous livrons', 'Consultation, soumission ou intervention planifiée.']]
    : [['Send your request', 'Tell us the service, equipment and preferred date.'], ['We follow up', 'Our team confirms the details with you directly.'], ['We deliver', 'Consultation, quote or scheduled service visit.']];

  return (
    <>
      <section className="relative pt-16 lg:pt-[72px] overflow-hidden" style={{ backgroundColor: '#111820' }}>
        <div className="absolute inset-0">
          <ImageWithFallback src={page.heroImage || IMAGES.parts} alt="" fill priority className="object-cover opacity-25" sizes="100vw" />
        </div>
        <div className="relative max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16 py-14 sm:py-20">
          <p className="text-xs font-semibold tracking-[0.35em] uppercase text-gray-300 mb-4">{isFr ? 'Réservation' : 'Booking'}</p>
          <h1 className="text-3xl sm:text-5xl font-bold text-white uppercase leading-tight max-w-4xl">{heading}</h1>
          <span className="block h-0.5 w-12 my-6" style={{ backgroundColor: '#1597E5' }} />
          <p className="text-gray-300 text-lg max-w-2xl">{description}</p>
        </div>
      </section>

      <section className="py-14 lg:py-20" style={{ backgroundColor: '#F4F6F8' }}>
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white border border-gray-200 p-5 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#111820] uppercase mb-6">{isFr ? 'Détails de la demande' : 'Request Details'}</h2>
            <BookingForm
              locale={lang}
              initialEquipment={initialEquipment}
              initialType={query.type ?? ''}
              equipmentOptions={equipmentOptions}
            />
          </div>

          <aside className="space-y-6">
            <div className="bg-[#18232D] text-white p-6 sm:p-8">
              <h2 className="text-lg font-bold uppercase mb-6">{isFr ? 'Comment ça fonctionne' : 'How It Works'}</h2>
              <ol className="space-y-5">
                {steps.map(([title, text], i) => (
                  <li key={title} className="flex gap-4">
                    <span className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#1597E5' }}>{i + 1}</span>
                    <span>
                      <span className="block font-semibold">{title}</span>
                      <span className="block text-sm text-gray-400">{text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-white border border-gray-200 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-[#111820] uppercase mb-3">{isFr ? 'Besoin urgent?' : 'Need It Sooner?'}</h2>
              <p className="text-sm text-gray-600 mb-4">{isFr ? 'Appelez ou écrivez directement à notre équipe.' : 'Call or email our team directly.'}</p>
              <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="block text-lg font-bold text-[#111820] hover:text-[#1597E5]">{settings.phone}</a>
              <a href={`mailto:${settings.email}`} className="block text-sm font-semibold text-[#1597E5] mt-1 break-all">{settings.email}</a>
              <p className="text-xs text-gray-500 mt-4">
                {isFr ? `Zone de service : ${settings.serviceAreaFr}` : `Service area: ${settings.serviceAreaEn}`}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
