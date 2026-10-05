/**
 * Внутренние ссылки с учётом base (для демо на GitHub Pages сайт живёт в подпапке).
 * На боевом домене base = '/', и href('/snegokhod') === '/snegokhod'.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export const href = (path: string): string => {
  if (/^(https?:|tel:|mailto:|#|\/\/)/.test(path)) return path;
  if (path === '/' || path === '') return BASE ? `${BASE}/` : '/';
  return `${BASE}${path.startsWith('/') ? path : `/${path}`}`;
};

/** Абсолютный адрес для canonical, og:url, sitemap */
export const absUrl = (path: string, site: URL | string): string => new URL(href(path), new URL(String(site)).origin).href;

/** Активный пункт меню */
export const isCurrent = (current: string, path: string): boolean => {
  const clean = (s: string) => s.replace(/\/$/, '').replace(/\.html$/, '') || '/';
  return clean(current) === clean(href(path));
};
