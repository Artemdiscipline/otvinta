/**
 * Проверка готовой сборки (запускать после npm run build): npm run verify
 *  - все старые адреса на месте;
 *  - внутренние ссылки и якоря ведут на существующие страницы/элементы;
 *  - все ссылки tel: в формате tel:+7XXXXXXXXXX;
 *  - на каждой странице один <h1>, уникальные title/description, canonical, yandex-verification;
 *  - у всех <img> есть alt;
 *  - в разметке и скриптах нет захардкоженных цен и телефонов (они только в src/data).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const errors = [];
const warn = (m) => errors.push(m);

const OLD_URLS = [
  '/',
  '/snegokhod',
  '/kvadrotsikl',
  '/gidrocikl',
  '/flaybord',
  '/vodnoye-shou',
  '/korporativnyy-otdykh',
  '/sertifikat',
  '/akcii-price',
  '/contakt',
  '/klub-ot-vinta-baza-aktivnogo-otdyha-v-kazani',
  '/privacy-policy',
];

// Git Bash превращает «/otvinta» в «C:/Program Files/Git/otvinta» — берём последнюю часть пути
const rawBase = process.env.BASE_PATH || '/';
const base = /^[A-Za-z]:[\\/]/.test(rawBase) ? `/${rawBase.split(/[\\/]/).pop()}` : rawBase.replace(/\/$/, '');
const fileFor = (p) => {
  let clean = decodeURI(p.split('#')[0].split('?')[0]);
  if (base && clean.startsWith(base)) clean = clean.slice(base.length) || '/';
  if (clean === '/' || clean === '') return path.join(dist, 'index.html');
  const direct = path.join(dist, clean);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;
  if (fs.existsSync(`${direct}.html`)) return `${direct}.html`;
  return null;
};

const pages = fs.readdirSync(dist).filter((f) => f.endsWith('.html'));
const html = Object.fromEntries(pages.map((f) => [f, fs.readFileSync(path.join(dist, f), 'utf8')]));
const ids = (h) => new Set([...h.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

for (const u of OLD_URLS) if (!fileFor(u)) warn(`Нет страницы для старого адреса ${u}`);

const titles = new Map();
const descs = new Map();
let links = 0;
let tels = 0;
for (const [file, h] of Object.entries(html)) {
  const h1 = (h.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) warn(`${file}: <h1> — ${h1} шт.`);
  const title = h.match(/<title>([^<]*)<\/title>/)?.[1];
  const desc = h.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!title) warn(`${file}: нет <title>`);
  if (!desc) warn(`${file}: нет description`);
  if (titles.has(title)) warn(`${file}: title совпадает с ${titles.get(title)}`);
  if (descs.has(desc)) warn(`${file}: description совпадает с ${descs.get(desc)}`);
  titles.set(title, file);
  descs.set(desc, file);
  if (!h.includes('rel="canonical"')) warn(`${file}: нет canonical`);
  if (!h.includes('name="yandex-verification" content="2769477e0dd6bb6f"')) warn(`${file}: нет yandex-verification`);

  // alt="" после сжатия HTML пишется как пустой атрибут alt — это корректно
  for (const m of h.matchAll(/<img\b[^>]*>/g)) if (!/\salt(="|[\s>])/.test(m[0])) warn(`${file}: <img> без alt: ${m[0].slice(0, 120)}`);

  const pageIds = ids(h);
  for (const m of h.matchAll(/\shref="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, '&');
    if (href.startsWith('tel:')) {
      tels++;
      if (!/^tel:\+7\d{10}$/.test(href)) warn(`${file}: неверный tel: ${href}`);
      continue;
    }
    if (/^(https?:|mailto:|\/\/)/.test(href)) continue;
    links++;
    if (href.startsWith('#')) {
      if (href.length > 1 && !pageIds.has(href.slice(1))) warn(`${file}: якорь ${href} не найден`);
      continue;
    }
    const target = fileFor(href);
    if (!target) {
      warn(`${file}: битая ссылка ${href}`);
      continue;
    }
    const hash = href.split('#')[1];
    if (hash && target.endsWith('.html') && !ids(fs.readFileSync(target, 'utf8')).has(hash)) warn(`${file}: якорь ${href} не найден`);
  }
  for (const m of h.matchAll(/\s(?:src|srcset|imagesrcset)="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      const u = part.trim().split(/\s+/)[0];
      if (!u || /^(https?:|data:)/.test(u)) continue;
      if (!fileFor(u)) warn(`${file}: нет файла ${u}`);
    }
  }
}

// Цены и телефоны — только в src/data
const PRICE = /\d[\d\s ]{2,}\s?₽|₽\s?\d/;
const PHONE = /(\+7|\b8)[\s(-]*\d{3}[\s)-]*\d{3}[\s-]*\d{2}[\s-]*\d{2}/;
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]));
for (const f of walk(path.join(root, 'src'))) {
  if (f.includes(`${path.sep}data${path.sep}`) || f.endsWith('logo.ts') ||!/\.(astro|ts|css)$/.test(f)) continue;
  const text = fs.readFileSync(f, 'utf8');
  text.split('\n').forEach((line, i) => {
    if (/^\s*(\*|\/\/|\/\*)/.test(line)) return; // комментарии с примерами
    if (PRICE.test(line)) warn(`${path.relative(root, f)}:${i + 1}: похоже на цену вне src/data: ${line.trim().slice(0, 100)}`);
    if (PHONE.test(line)) warn(`${path.relative(root, f)}:${i + 1}: похоже на телефон вне src/data: ${line.trim().slice(0, 100)}`);
  });
}

console.log(`Страниц: ${pages.length}, внутренних ссылок: ${links}, ссылок tel: ${tels}`);
if (errors.length) {
  console.log(`\nПроблем: ${errors.length}`);
  for (const e of errors) console.log(` - ${e}`);
  process.exit(1);
}
console.log('Всё в порядке ✓');
