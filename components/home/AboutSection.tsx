import Link from 'next/link';
import type { PageContentData } from '@/lib/defaults';
import { blockImage, blockText } from '@/lib/pageBlocks';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import type { Locale } from '@/lib/localization';

export default function AboutSection({ locale, content }: { locale: Locale; content: PageContentData }) {
  const b = (key: string) => blockText(content, key, locale);

  const benefits = [
    { title: b('benefit1Title'), text: b('benefit1Text'), icon: <ProductivityIcon /> },
    { title: b('benefit2Title'), text: b('benefit2Text'), icon: <CostIcon /> },
    { title: b('benefit3Title'), text: b('benefit3Text'), icon: <LifeIcon /> },
  ];

  return (
    <section className="py-0 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">
        {/* Left: dark content panel */}
        <div
          className="flex flex-col justify-center px-8 py-16 lg:px-16 lg:py-20"
          style={{ backgroundColor: '#111820' }}
        >
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8" style={{ backgroundColor: '#1597E5' }} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#1597E5' }}>
                {b('aboutEyebrow')}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-6">
              {b('aboutHeading')}
            </h2>
            <p className="text-gray-400 text-base leading-relaxed mb-8">
              {b('aboutText')}
            </p>

            {/* Benefits */}
            <div className="space-y-5 mb-10">
              {benefits.map((b) => (
                <div key={b.title} className="flex items-start gap-4">
                  <div
                    className="w-9 h-9 flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(21,151,229,0.12)' }}
                  >
                    {b.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-widest text-white uppercase mb-0.5">
                      {b.title}
                    </p>
                    <p className="text-xs text-gray-400">{b.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white border border-gray-600 hover:border-gray-400 hover:bg-white/5 transition-all duration-200"
            >
              {b('aboutCta')}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right: image panel */}
        <div className="relative min-h-[400px] lg:min-h-0">
          <ImageWithFallback
            src={blockImage(content, 'aboutImage')}
            alt="Winter municipal equipment — snowplow in operation"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(17,24,32,0.3) 0%, transparent 60%)',
            }}
          />
        </div>
      </div>
    </section>
  );
}

function ProductivityIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1597E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
function CostIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1597E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
function LifeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1597E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}
