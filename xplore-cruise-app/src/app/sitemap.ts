import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://xplorecruisetravel.com'

  const cruiseSlugs = [
    'western-mediterranean-discovery',
    'greek-islands-turkey-voyage',
    'norwegian-fjords-explorer',
    'romantic-danube-river-cruise',
    'caribbean-perfect-day',
    'adriatic-luxury-collection',
  ]

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/cruises`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/cookies`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/gdpr`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  const cruisePages: MetadataRoute.Sitemap = cruiseSlugs.map((slug) => ({
    url: `${baseUrl}/cruises/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...cruisePages]
}
