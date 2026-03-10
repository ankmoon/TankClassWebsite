import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tankmentor.com';
    const locales = ['vi', 'en'];
    const pages = ['', '/programs', '/blog', '/about', '/contact', '/resources'];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    locales.forEach((locale) => {
        pages.forEach((page) => {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}${page}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: page === '' ? 1 : 0.8,
            });
        });
    });

    return sitemapEntries;
}
