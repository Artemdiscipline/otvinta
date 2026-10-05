import type { APIRoute } from 'astro';
import { pages } from '@/data/pages';
import { pricesMeta } from '@/data/prices';
import { site } from '@/data/site';
import { absUrl } from '@/lib/url';

/** sitemap.xml со всеми страницами (адреса как на старом сайте). */
export const GET: APIRoute = ({ site: astroSite }) => {
  const origin = String(astroSite ?? site.url);
  const lastmod = `${pricesMeta.updatedAt}-01`;
  const urls = Object.values(pages)
    .map(
      (p) =>
        `  <url>\n    <loc>${absUrl(p.path, origin)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority.toFixed(1)}</priority>\n  </url>`,
    )
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
