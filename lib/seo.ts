import type { Metadata } from 'next';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://muni-quip.ca').replace(/\/$/, '');

/** Builds per-route metadata with canonical URL, EN/FR alternates, Open Graph and Twitter tags. */
export function buildMetadata(opts: {
  locale: string;
  path: string; // route without locale, e.g. '/about' or ''
  title: string;
  description: string;
  image?: string;
}): Metadata {
  const { locale, path, title, description } = opts;
  const url = `${SITE_URL}/${locale}${path}`;
  const image = opts.image
    ? opts.image.startsWith('http') ? opts.image : `${SITE_URL}${opts.image}`
    : undefined;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: {
        'en-CA': `${SITE_URL}/en${path}`,
        'fr-CA': `${SITE_URL}/fr${path}`,
        'x-default': `${SITE_URL}/en${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'MUNI-QUIP',
      locale: locale === 'fr' ? 'fr_CA' : 'en_CA',
      type: 'website',
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
