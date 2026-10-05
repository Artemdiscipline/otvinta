// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Боевой адрес сайта. Для демо-сборки (GitHub Pages и т. п.) переопределяется
// переменными окружения — см. scripts/build-demo.mjs и README.md.
const SITE = process.env.SITE_URL || 'https://otvinta116.ru';
const BASE = process.env.BASE_PATH || '/';
const NOINDEX = process.env.NOINDEX === '1';

export default defineConfig({
  site: SITE,
  base: BASE,
  // Старые адреса WordPress — без слеша на конце (/snegokhod), сохраняем их.
  trailingSlash: 'never',
  build: {
    format: 'file',
    inlineStylesheets: 'always',
  },
  // HTML-сжатие без JSX-правил: пробелы между строчными элементами сохраняются.
  compressHTML: true,
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
    define: {
      __NOINDEX__: JSON.stringify(NOINDEX),
    },
  },
});
