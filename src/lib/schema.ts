/**
 * JSON-LD для поисковиков: организация, две площадки, тарифы, FAQ, хлебные крошки.
 */
import type { FaqItem } from '@/data/faq';
import { pages } from '@/data/pages';
import { catalog, type CatalogItem } from '@/data/prices';
import { instagram, locations, mainPhone, phones, site, socials } from '@/data/site';
import { absUrl } from './url';

type Json = Record<string, unknown>;

const sameAs = [...socials.filter((s) => s.id !== 'whatsapp').map((s) => s.url), instagram.url];

export const organization = (origin: string): Json => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${absUrl('/', origin)}#org`,
  name: site.name,
  alternateName: site.brand,
  slogan: site.slogan,
  url: absUrl('/', origin),
  logo: absUrl('/icon-512.png', origin),
  image: absUrl('/og-image.jpg', origin),
  telephone: mainPhone.e164,
  sameAs,
  contactPoint: phones.map((p) => ({
    '@type': 'ContactPoint',
    telephone: p.e164,
    contactType: 'customer service',
    areaServed: 'RU',
    availableLanguage: 'Russian',
  })),
  subOrganization: locations.map((l) => ({ '@id': `${absUrl('/', origin)}#${l.id}` })),
});

export const placesLd = (origin: string): Json[] =>
  locations.map((l) => ({
    '@context': 'https://schema.org',
    '@type': ['SportsActivityLocation', 'LocalBusiness'],
    '@id': `${absUrl('/', origin)}#${l.id}`,
    name: `${site.name} — ${l.title.toLowerCase()}`,
    description: `${l.title}: ${l.locality}, ${l.street}. ${l.note}.`,
    url: absUrl('/contakt', origin),
    image: absUrl('/og-image.jpg', origin),
    telephone: phones.map((p) => p.e164),
    priceRange: '₽₽',
    address: {
      '@type': 'PostalAddress',
      streetAddress: l.street,
      addressLocality: l.locality,
      addressRegion: site.region,
      addressCountry: 'RU',
    },
    geo: { '@type': 'GeoCoordinates', latitude: l.geo.lat, longitude: l.geo.lon },
    hasMap: `https://yandex.ru/maps/?pt=${l.geo.lon},${l.geo.lat}&z=15&l=map`,
    sameAs,
    parentOrganization: { '@id': `${absUrl('/', origin)}#org` },
  }));

/** Offer + PriceSpecification для тарифов услуги */
export const serviceLd = (origin: string, name: string, path: string, items: CatalogItem[]): Json => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  serviceType: name,
  url: absUrl(path, origin),
  areaServed: { '@type': 'City', name: site.city },
  provider: { '@id': `${absUrl('/', origin)}#org` },
  offers: items
    .filter((i) => i.price.kind !== 'request')
    .map((i) => {
      const p = i.price;
      const spec: Json = { '@type': 'PriceSpecification', priceCurrency: 'RUB' };
      if (p.kind === 'range') Object.assign(spec, { minPrice: p.min, maxPrice: p.max });
      else if (p.kind === 'from') Object.assign(spec, { minPrice: (p as { value: number }).value });
      else Object.assign(spec, { price: (p as { value: number }).value });
      return {
        '@type': 'Offer',
        name: i.label,
        priceCurrency: 'RUB',
        ...(p.kind === 'fixed' || p.kind === 'approx' ? { price: p.value } : {}),
        priceSpecification: spec,
        url: absUrl(path, origin),
        availability: 'https://schema.org/InStock',
      };
    }),
});

export const faqLd = (items: FaqItem[]): Json => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const breadcrumbsLd = (origin: string, trail: { name: string; path: string }[]): Json => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: pages.home.crumb, path: '/' }, ...trail].map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: absUrl(c.path, origin),
  })),
});

/** Набор разметки для страницы услуги: Service+Offer, хлебные крошки, площадка */
export const servicePageLd = (
  origin: string,
  opts: { name: string; path: string; crumb: string; serviceId?: import('@/data/types').ServiceId; location?: 'mirny' | 'santa' },
): Json[] => {
  const out: Json[] = [breadcrumbsLd(origin, [{ name: opts.crumb, path: opts.path }])];
  if (opts.serviceId) {
    const cat = catalog.find((c) => c.id === opts.serviceId);
    if (cat) out.push(serviceLd(origin, opts.name, opts.path, cat.groups.flatMap((g) => g.items)));
  }
  if (opts.location) out.push(...placesLd(origin).filter((p) => String(p['@id']).endsWith(`#${opts.location}`)));
  return out;
};
