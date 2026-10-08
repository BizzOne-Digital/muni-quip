import type { Metadata } from 'next';
import Link from 'next/link';
import type { Locale } from '@/lib/localization';
import { pick } from '@/lib/localization';
import { getPageContent, getSettings } from '@/lib/data';
import { IMAGES } from '@/lib/defaults';
import { buildMetadata } from '@/lib/seo';
import ContactForm from '@/components/forms/ContactForm';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

export const revalidate = 60;

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const page = await getPageContent('contact');
  return buildMetadata({
    locale,
    path: '/contact',
    title: pick(locale, page.seoTitleEn, page.seoTitleFr, locale === 'fr' ? 'Contactez MUNI-QUIP | Cornwall, Ontario' : 'Contact MUNI-QUIP | Cornwall, Ontario'),
    description: pick(
      locale,
      page.seoDescriptionEn,
      page.seoDescriptionFr,
      locale === 'fr'
        ? "Contactez MUNI-QUIP pour l'équipement municipal, les pièces et le service en Ontario et au Québec."
        : 'Contact MUNI-QUIP for municipal equipment, parts and service across Ontario and Quebec.'
    ),
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const lang: Locale = locale === 'fr' ? 'fr' : 'en';
  const isFr = lang === 'fr';

  const [page, settings] = await Promise.all([getPageContent('contact'), getSettings()]);
  const fullAddress = `${settings.address}, ${settings.city}, ${settings.province} ${settings.postalCode}`;
  const tel = settings.phone.replace(/[^0-9+]/g, '');

  const heading = pick(lang, page.heroHeadingEn, page.heroHeadingFr, isFr ? 'Trouvons la bonne solution pour votre municipalité' : "Let's Find the Right Solution for Your Municipality");
  const subtext = pick(
    lang,
    page.heroDescriptionEn,
    page.heroDescriptionFr,
    isFr
      ? 'Demandez une soumission, réservez un service ou parlez à notre équipe. Nous sommes là pour vous aider.'
      : "Request a quote, book a service or speak with our team. We're here to help."
  );

  const info = [
    { label: isFr ? 'Adresse' : 'Address', value: `${settings.siteName}\n${settings.address}\n${settings.city}, ${settings.province}, ${settings.postalCode}`, icon: <MapPinIcon /> },
    { label: isFr ? 'Téléphone' : 'Phone', value: settings.phone, href: `tel:${tel}`, icon: <PhoneIcon /> },
    { label: isFr ? 'Courriel' : 'Email', value: settings.email, href: `mailto:${settings.email}`, icon: <MailIcon /> },
  ];

  return (
    <>
      <section className="relative pt-16 lg:pt-[72px] overflow-hidden" style={{ backgroundColor: '#111820' }}>
        <div className="absolute inset-0">
          <ImageWithFallback src={page.heroImage || IMAGES.city} alt="" fill priority className="object-cover opacity-25" sizes="100vw" />
        </div>
        <div className="relative max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16 py-14 sm:py-20">
          <p className="text-xs font-semibold tracking-[0.35em] uppercase text-gray-300 mb-4">{isFr ? 'Contactez-nous' : 'Get in Touch'}</p>
          <h1 className="text-3xl sm:text-5xl font-bold text-white uppercase leading-tight max-w-4xl">{heading}</h1>
          <span className="block h-0.5 w-12 my-6" style={{ backgroundColor: '#1597E5' }} />
          <p className="text-gray-300 text-lg max-w-2xl">{subtext}</p>
        </div>
      </section>

      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
          <div>
            <h2 className="text-lg font-bold text-[#111820] mb-6 uppercase">{isFr ? 'Informations de contact' : 'Contact Information'}</h2>
            <ul className="space-y-6">
              {info.map((item) => (
                <li key={item.label} className="flex items-start gap-4">
                  <span className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-[#F4F6F8]">{item.icon}</span>
                  <div>
                    <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-1">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-base font-semibold text-[#111820] hover:text-[#1597E5] break-all">{item.value}</a>
                    ) : (
                      <p className="text-sm text-gray-800 whitespace-pre-line">{item.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 border border-gray-200 overflow-hidden">
              <iframe
                title={isFr ? 'Carte : bureau MUNI-QUIP à Cornwall' : 'Map: MUNI-QUIP office in Cornwall'}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&z=14&output=embed`}
                className="w-full h-56 border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-[#F4F6F8] border border-gray-200 p-5 sm:p-8">
              <h2 className="text-lg font-bold text-[#111820] mb-6 uppercase">{isFr ? 'Envoyez-nous un message' : 'Send Us a Message'}</h2>
              <ContactForm locale={lang} />
            </div>
          </div>
        </div>
      </section>

      {/* Service area */}
      <section className="py-14 lg:py-20" style={{ backgroundColor: '#18232D' }}>
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.35em] uppercase text-gray-400 mb-3">{isFr ? 'Zone de service' : 'Service Area'}</p>
            <h2 className="text-3xl font-bold text-white uppercase mb-4">{isFr ? settings.serviceAreaFr : settings.serviceAreaEn}</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              {isFr
                ? "Établis à Cornwall, en Ontario, nous servons les villes, les municipalités et les services des travaux publics de l'Ontario et du Québec, en français et en anglais."
                : 'Based in Cornwall, Ontario, we serve cities, towns, municipalities and public works departments across Ontario and Quebec, in English and French.'}
            </p>
            <Link href={`/${lang}/booking`} className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 text-sm font-semibold text-white hover:brightness-110" style={{ backgroundColor: '#1597E5' }}>
              {isFr ? 'Réserver un service' : 'Book a Service'} →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['Ontario', isFr ? 'Villes, cantons et comtés' : 'Cities, townships and counties'],
              [isFr ? 'Québec' : 'Quebec', isFr ? 'Municipalités et MRC' : 'Municipalities and RCMs'],
            ].map(([title, text]) => (
              <div key={title} className="border border-white/15 p-6">
                <MapPinIcon />
                <p className="text-white font-bold text-xl mt-3">{title}</p>
                <p className="text-sm text-gray-400 mt-1">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1597E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1597E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.49a2 2 0 0 1 1.99-2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8 9.21a16 16 0 0 0 5.11 5.14l.95-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1597E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}
