/**
 * Демо-сборка для показа (GitHub Pages и т. п.): сайт закрыт от индексации,
 * чтобы не конкурировать в поиске с действующим otvinta116.ru.
 *
 *   npm run build:demo -- --site https://artemdiscipline.github.io --base /otvinta
 *
 * --site  адрес хостинга (без подпапки), по умолчанию https://otvinta116.ru
 * --base  подпапка, если сайт открывается не с корня домена (например, /otvinta)
 */
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

// Git Bash на Windows превращает «/otvinta» в «C:/Program Files/Git/otvinta» — возвращаем как было.
// Можно писать и без слеша: --base otvinta
const normalizeBase = (raw = '/') => {
  let b = raw.trim();
  if (/^[A-Za-z]:[\\/]/.test(b)) b = b.split(/[\\/]/).pop() ?? '';
  b = `/${b.replace(/^\/+|\/+$/g, '')}`;
  return b === '/' ? '/' : b;
};

const env = {
  ...process.env,
  NOINDEX: '1',
  SITE_URL: arg('site') ?? process.env.SITE_URL ?? 'https://otvinta116.ru',
  BASE_PATH: normalizeBase(arg('base') ?? process.env.BASE_PATH),
};

console.log(`Демо-сборка: site=${env.SITE_URL} base=${env.BASE_PATH} (noindex)`);
const res = spawnSync('npx', ['astro', 'build'], { stdio: 'inherit', env, shell: true });
process.exit(res.status ?? 1);
