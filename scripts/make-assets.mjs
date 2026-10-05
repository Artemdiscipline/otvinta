/**
 * Генерация фавиконок, иконок PWA и OG-картинки 1200×630 в фирменном стиле.
 * Запуск: npm run assets (нужен установленный Google Chrome — для OG-картинки).
 * Результат кладётся в public/. Геометрия пропеллера — src/lib/propeller.ts.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { propellerSvg } from '../src/lib/propeller.ts';
import { site } from '../src/data/site.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(root, 'public');
const out = (f) => path.join(pub, f);

/* ── Иконки ── */
fs.writeFileSync(out('favicon.svg'), propellerSvg({ size: 64, rounded: 0.22 }));
const png = (size, opts = {}) => sharp(Buffer.from(propellerSvg({ size: 512, ...opts }))).resize(size, size).png().toBuffer();

const icons = {
  'favicon-32.png': await png(32, { glow: false }),
  'apple-touch-icon.png': await png(180, { rounded: 0 }),
  'icon-192.png': await png(192),
  'icon-512.png': await png(512),
  'icon-maskable-512.png': await png(512, { rounded: 0, scale: 0.72 }),
};
for (const [name, buf] of Object.entries(icons)) fs.writeFileSync(out(name), buf);

// favicon.ico: контейнер ICO с PNG 16/32/48
const icoSizes = [16, 32, 48];
const icoPngs = await Promise.all(icoSizes.map((s) => png(s, { glow: s >= 48 })));
const header = Buffer.alloc(6 + 16 * icoPngs.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icoPngs.length, 4);
let offset = header.length;
icoPngs.forEach((buf, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(icoSizes[i] % 256, e);
  header.writeUInt8(icoSizes[i] % 256, e + 1);
  header.writeUInt8(0, e + 2);
  header.writeUInt8(0, e + 3);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(buf.length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += buf.length;
});
fs.writeFileSync(out('favicon.ico'), Buffer.concat([header, ...icoPngs]));

/* ── Манифест ── */
fs.writeFileSync(
  out('manifest.webmanifest'),
  JSON.stringify(
    {
      name: site.name,
      short_name: site.brand,
      description: site.description,
      lang: 'ru',
      start_url: './',
      scope: './',
      display: 'standalone',
      background_color: '#05070D',
      theme_color: '#05070D',
      icons: [
        { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2,
  ),
);

/* ── OG-картинка (рендер HTML в Chrome) ── */
let chromium;
try {
  ({ chromium } = await import('playwright-core'));
} catch {
  console.warn('playwright-core не установлен — OG-картинка не пересоздана');
}
if (chromium) {
  const font = (file) => pathToFileURL(path.join(root, 'src/assets/fonts', file)).href;
  const photo = pathToFileURL(path.join(root, 'src/assets/img/snow-sunset.jpg')).href;
  const prop = propellerSvg({ size: 120, background: null });
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face{font-family:U;src:url(${font('unbounded-700-900.woff2')}) format('woff2');font-weight:700 900}
  @font-face{font-family:M;src:url(${font('manrope-400-800.woff2')}) format('woff2');font-weight:400 800}
  *{margin:0;box-sizing:border-box}
  body{width:1200px;height:630px;background:#05070D;color:#EAF2FF;font-family:M;position:relative;overflow:hidden}
  .ph{position:absolute;inset:0 0 0 420px;background:url(${photo}) center 62%/cover}
  .ph:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,#05070D 0%,rgba(5,7,13,.75) 30%,rgba(5,7,13,.1) 70%),radial-gradient(70% 80% at 90% 10%,rgba(10,77,255,.45),transparent 70%)}
  .c{position:absolute;left:72px;top:70px;right:520px}
  .logo{display:flex;align-items:center;gap:14px;font-family:U;font-weight:900;font-size:64px;letter-spacing:-1px;
    background:linear-gradient(180deg,#EAF2FF,#4FB3FF 50%,#1E7BFF);-webkit-background-clip:text;color:transparent;filter:drop-shadow(0 0 18px rgba(30,144,255,.7))}
  .logo svg{width:92px;height:92px;filter:none}
  .sl{margin-top:14px;font-weight:800;letter-spacing:.42em;font-size:17px;color:#9EC9FF}
  h1{margin-top:44px;font-family:U;font-weight:800;font-size:44px;line-height:1.12}
  p{margin-top:22px;font-size:24px;font-weight:600;color:#B8C7E0}
  .bar{position:absolute;left:72px;bottom:64px;display:flex;gap:12px}
  .t{width:46px;height:10px;border-radius:9px}
  </style></head><body>
  <div class="ph"></div>
  <div class="c">
    <div class="logo"><span>ОТ</span>${prop}<span>ВИНТА</span></div>
    <div class="sl">${site.slogan.toUpperCase()}</div>
    <h1>Снегоходы, квадроциклы и гидроциклы в&nbsp;Казани</h1>
    <p>${site.fromCenter} · техника Yamaha</p>
  </div>
  <div class="bar"><i class="t" style="background:#F2F5FA"></i><i class="t" style="background:#2ECC71"></i><i class="t" style="background:#E63946"></i><i class="t" style="background:#111;box-shadow:0 0 0 2px #fff inset"></i><i class="t" style="background:#D4A84B"></i></div>
  </body></html>`;
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  const tmp = path.join(os.tmpdir(), 'otvinta-og.html');
  fs.writeFileSync(tmp, html);
  await page.goto(pathToFileURL(tmp).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const shot = await page.screenshot({ type: 'png' });
  await browser.close();
  await sharp(shot).jpeg({ quality: 86, mozjpeg: true }).toFile(out('og-image.jpg'));
}

console.log('Готово: favicon.svg/ico, иконки PWA, manifest.webmanifest' + (chromium ? ', og-image.jpg' : ''));
