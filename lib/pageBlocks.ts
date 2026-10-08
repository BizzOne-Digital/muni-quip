import { translations } from './localization';
import { IMAGES, type PageContentData } from './defaults';

// Editable text/image blocks per page. Stored in PageContent.blocks as
// `<key>En` / `<key>Fr` (text) or `<key>` (image). Admin renders these
// automatically; the public site reads them with blockText()/blockImage().

export interface BlockDef {
  key: string;
  label: string;
  group: string;
  type?: 'text' | 'textarea' | 'image';
  en?: string;
  fr?: string;
  image?: string;
}

const en = translations.en;
const fr = translations.fr;

export const PAGE_BLOCKS: Record<string, BlockDef[]> = {
  home: [
    { group: 'Our Solutions', key: 'solutionsEyebrow', label: 'Eyebrow', en: en.solutions.eyebrow, fr: fr.solutions.eyebrow },
    { group: 'Our Solutions', key: 'solutionsHeading', label: 'Heading', en: en.solutions.heading, fr: fr.solutions.heading },
    { group: 'Our Solutions', key: 'solutionsText', label: 'Description', type: 'textarea', en: en.solutions.description, fr: fr.solutions.description },

    { group: 'Featured Products', key: 'productsEyebrow', label: 'Eyebrow', en: en.products.eyebrow, fr: fr.products.eyebrow },
    { group: 'Featured Products', key: 'productsHeading', label: 'Heading', en: en.products.heading, fr: fr.products.heading },

    { group: 'About Section', key: 'aboutEyebrow', label: 'Eyebrow', en: en.about.eyebrow, fr: fr.about.eyebrow },
    { group: 'About Section', key: 'aboutHeading', label: 'Heading', en: en.about.heading, fr: fr.about.heading },
    { group: 'About Section', key: 'aboutText', label: 'Text', type: 'textarea', en: en.about.text, fr: fr.about.text },
    { group: 'About Section', key: 'aboutCta', label: 'Button Label', en: en.about.cta, fr: fr.about.cta },
    { group: 'About Section', key: 'aboutImage', label: 'Image', type: 'image', image: IMAGES.snowplow },
    { group: 'About Section', key: 'benefit1Title', label: 'Benefit 1 Title', en: en.about.benefit1Title, fr: fr.about.benefit1Title },
    { group: 'About Section', key: 'benefit1Text', label: 'Benefit 1 Text', en: en.about.benefit1Text, fr: fr.about.benefit1Text },
    { group: 'About Section', key: 'benefit2Title', label: 'Benefit 2 Title', en: en.about.benefit2Title, fr: fr.about.benefit2Title },
    { group: 'About Section', key: 'benefit2Text', label: 'Benefit 2 Text', en: en.about.benefit2Text, fr: fr.about.benefit2Text },
    { group: 'About Section', key: 'benefit3Title', label: 'Benefit 3 Title', en: en.about.benefit3Title, fr: fr.about.benefit3Title },
    { group: 'About Section', key: 'benefit3Text', label: 'Benefit 3 Text', en: en.about.benefit3Text, fr: fr.about.benefit3Text },

    ...([1, 2, 3, 4, 5] as const).flatMap((n) => [
      { group: 'Credibility Strip', key: `strip${n}Title`, label: `Item ${n} Title`, en: en.strip[`item${n}Title`], fr: fr.strip[`item${n}Title`] },
      { group: 'Credibility Strip', key: `strip${n}Text`, label: `Item ${n} Text`, en: en.strip[`item${n}Text`], fr: fr.strip[`item${n}Text`] },
    ]),

    { group: 'Contact Section', key: 'contactEyebrow', label: 'Eyebrow', en: en.contact.eyebrow, fr: fr.contact.eyebrow },
    { group: 'Contact Section', key: 'contactHeading', label: 'Heading', en: en.contact.heading, fr: fr.contact.heading },
    { group: 'Contact Section', key: 'contactText', label: 'Text', type: 'textarea', en: en.contact.text, fr: fr.contact.text },
  ],
};

function findDef(pageKey: string, key: string): BlockDef | undefined {
  return PAGE_BLOCKS[pageKey]?.find((b) => b.key === key);
}

type Blocks = Record<string, string> | undefined;

/** Localized block text: admin value → other language → built-in default. */
export function blockText(page: PageContentData, key: string, locale: string): string {
  const blocks = page.blocks as Blocks;
  const def = findDef(page.pageKey, key);
  const primary = blocks?.[`${key}${locale === 'fr' ? 'Fr' : 'En'}`];
  const secondary = blocks?.[`${key}${locale === 'fr' ? 'En' : 'Fr'}`];
  const fallback = (locale === 'fr' ? def?.fr : def?.en) ?? '';
  return primary?.trim() || secondary?.trim() || fallback;
}

export function blockImage(page: PageContentData, key: string): string {
  const blocks = page.blocks as Blocks;
  return blocks?.[key]?.trim() || findDef(page.pageKey, key)?.image || '';
}

/** Initial DB values for a page's blocks, so admin opens with the live text filled in. */
export function defaultBlocks(pageKey: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const b of PAGE_BLOCKS[pageKey] ?? []) {
    if (b.type === 'image') out[b.key] = b.image ?? '';
    else {
      out[`${b.key}En`] = b.en ?? '';
      out[`${b.key}Fr`] = b.fr ?? '';
    }
  }
  return out;
}

const t = translations;

/** Seeded page documents (hero text, blocks). */
export const DEFAULT_PAGES: PageContentData[] = [
  {
    pageKey: 'home',
    heroHeadingEn: [t.en.hero.headline1, t.en.hero.headline2, t.en.hero.headline3, t.en.hero.headline4].join('\n'),
    heroHeadingFr: [t.fr.hero.headline1, t.fr.hero.headline2, t.fr.hero.headline3, t.fr.hero.headline4].join('\n'),
    heroDescriptionEn: t.en.hero.description,
    heroDescriptionFr: t.fr.hero.description,
    heroCta1En: t.en.hero.cta1,
    heroCta1Fr: t.fr.hero.cta1,
    heroCta2En: t.en.hero.cta2,
    heroCta2Fr: t.fr.hero.cta2,
    heroImage: IMAGES.hero,
    seoTitleEn: 'MUNI-QUIP | Municipal Equipment, Parts & Service in Ontario & Quebec',
    seoTitleFr: 'MUNI-QUIP | Équipement municipal, pièces et service en Ontario et au Québec',
    seoDescriptionEn:
      'Municipal equipment, asphalt recycling, road maintenance, winter maintenance, fleet technology, parts and service solutions across Ontario and Quebec.',
    seoDescriptionFr:
      "Équipement municipal, recyclage d'asphalte, entretien routier et hivernal, technologie de flotte, pièces et service en Ontario et au Québec.",
    blocks: defaultBlocks('home'),
  },
  { pageKey: 'about' },
  { pageKey: 'services' },
  { pageKey: 'contact' },
  { pageKey: 'booking' },
];
