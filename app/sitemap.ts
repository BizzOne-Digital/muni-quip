import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/data';
import { SITE_URL } from '@/lib/seo';

export const revalidate = 3600;

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' }[] = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/booking', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const routes = [
    ...STATIC_ROUTES,
    ...products.map((p) => ({ path: `/products/${p.slug}`, priority: 0.7, changeFrequency: 'monthly' as const })),
  ];

  return routes.flatMap((route) =>
    (['en', 'fr'] as const).map((locale) => ({
      url: `${SITE_URL}/${locale}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          'en-CA': `${SITE_URL}/en${route.path}`,
          'fr-CA': `${SITE_URL}/fr${route.path}`,
        },
      },
    }))
  );
}
