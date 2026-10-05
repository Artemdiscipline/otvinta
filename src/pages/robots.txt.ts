import type { APIRoute } from 'astro';
import { site } from '@/data/site';
import { absUrl } from '@/lib/url';

/** robots.txt. В демо-сборке (NOINDEX=1) сайт закрыт от индексации целиком. */
export const GET: APIRoute = ({ site: astroSite }) => {
  const origin = String(astroSite ?? site.url);
  const body = __NOINDEX__
    ? 'User-agent: *\nDisallow: /\n'
    : [
        'User-agent: *',
        'Allow: /',
        '',
        'User-agent: Yandex',
        'Allow: /',
        'Clean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term&yclid&gclid',
        '',
        `Sitemap: ${absUrl('/sitemap.xml', origin)}`,
        '',
      ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
