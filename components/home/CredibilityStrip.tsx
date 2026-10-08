import type { Locale } from '@/lib/localization';
import type { PageContentData } from '@/lib/defaults';
import { blockText } from '@/lib/pageBlocks';

export default function CredibilityStrip({ locale, content }: { locale: Locale; content: PageContentData }) {
  const b = (key: string) => blockText(content, key, locale);

  const items = [
    { title: b('strip1Title'), text: b('strip1Text'), icon: <WrenchIcon /> },
    { title: b('strip2Title'), text: b('strip2Text'), icon: <StarIcon /> },
    { title: b('strip3Title'), text: b('strip3Text'), icon: <HeadsetIcon /> },
    { title: b('strip4Title'), text: b('strip4Text'), icon: <MunicipalIcon /> },
    { title: b('strip5Title'), text: b('strip5Text'), icon: <BilingualIcon /> },
  ];

  return (
    <section className="py-14 lg:py-16 bg-white border-t border-b border-gray-100">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              <div
                className="w-11 h-11 flex items-center justify-center mb-4"
                style={{ backgroundColor: '#F4F6F8' }}
              >
                {item.icon}
              </div>
              <h3 className="text-xs font-bold tracking-widest text-gray-900 uppercase mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WrenchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function HeadsetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}
function MunicipalIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="1" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
function BilingualIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
