# Клуб «От винта» — сайт (прототип редизайна)

Сайт клуба активного отдыха в Казани: снегоходы, квадроциклы, гидроциклы, флайборд, аквабайк-шоу,
корпоративы, сертификаты. Статический сайт на **Astro 7 + TypeScript + Tailwind CSS 4**, почти без JS.

- 13 страниц, адреса старого сайта сохранены: `/snegokhod`, `/kvadrotsikl`, `/gidrocikl`, `/flaybord`,
  `/vodnoye-shou`, `/korporativnyy-otdykh`, `/sertifikat`, `/akcii-price`, `/contakt`,
  `/klub-ot-vinta-baza-aktivnogo-otdyha-v-kazani`, `/privacy-policy` + главная и фирменная 404.
- Форма заявки на каждой странице, калькулятор, конструктор сертификата, переключатель сезона.
- Lighthouse (мобайл, сборка со сжатием): Performance 96–99, Accessibility 100, Best Practices 100, SEO 100.

## Быстрый старт

Нужен **Node.js 22.12+**.

```bash
npm install
npm run dev        # http://localhost:4321
```

> **Windows:** держите проект в коротком пути (например, `C:\sites\otvinta`). Из-за лимита
> Windows в 260 символов `npm install`/сборка в очень глубоких папках падают с ошибкой
> `ERR_PACKAGE_IMPORT_NOT_DEFINED`.

| Команда | Что делает |
| --- | --- |
| `npm run dev` | разработка с автообновлением |
| `npm run build` | боевая сборка в `dist/` (индексируется поисковиками) |
| `npm run build:demo -- --site <адрес> --base <подпапка>` | демо-сборка, закрытая от индексации |
| `npm run preview` | посмотреть собранный `dist/` |
| `npm run check` | проверка типов TypeScript/Astro |
| `npm run verify` | после сборки: старые адреса, битые ссылки, формат `tel:`, h1/title/description, alt, цены вне `src/data` |
| `npm run assets` | пересоздать фавиконки, иконки PWA и OG-картинку (нужен Google Chrome) |

## Где менять контент

**Все цены, телефоны и тексты-факты — только в `src/data/`.** В разметке цифр нет.

| Файл | Что внутри |
| --- | --- |
| `src/data/prices.ts` | все тарифы: трассы снегоходов и квадроциклов, гидроциклы, программы, туры, флайборд; `updatedAt`, плашка «цены актуальны» |
| `src/data/site.ts` | название, стаж, телефоны, мессенджеры, адреса и координаты площадок, режим работы, цифры, «почему мы», гости, **ID Яндекс.Метрики** |
| `src/data/services.ts` | карточки услуг (фото, описание, «от X ₽» считается автоматически) |
| `src/data/promos.ts` | акции и бонусы |
| `src/data/offers.ts` | сертификаты, корпоративы, аквабайк-шоу, база отдыха, сезоны главной |
| `src/data/faq.ts` | частые вопросы (и разметка FAQPage) |
| `src/data/reviews.ts` | отзывы |
| `src/data/videos.ts` | ролики YouTube/Rutube |
| `src/data/pages.ts` | `title`, `description`, хлебные крошки, sitemap |
| `src/data/photos.ts` | подписи (alt) и кадрирование фото |

Флаг `clarify: true` у цены или факта выводит рядом оранжевую звёздочку «уточняйте у администратора».
Список открытых вопросов к владельцу — в **[TODO.md](TODO.md)**.

**Фото:** положите `.jpg` в `src/assets/img/` и добавьте строку в `src/data/photos.ts`. Astro сам сделает
avif/webp нужных размеров. Лучше загружать оригиналы шириной 1600–2400 px.

## Как работает форма заявки (демо-режим)

Форма проверяет поля, собирает текст заявки и открывает **WhatsApp клуба** с готовым сообщением
(или Telegram — тогда текст копируется в буфер обмена). Клиент сам нажимает «Отправить» в мессенджере.

Чтобы заявки приходили админу автоматически, есть заготовка Telegram-бота:
`serverless/telegram-lead.ts` (инструкция внутри) + `LEAD_ENDPOINT` в `src/scripts/lead-transport.ts`.

## Деплой

### Vercel
1. Залить проект в GitHub, в Vercel → **Add New Project** → выбрать репозиторий.
2. Framework: Astro (определится сам), Build: `npm run build`, Output: `dist`. Настройки уже в `vercel.json`
   (чистые адреса без `.html` и без слеша на конце, кэш для `/_astro/`).
3. В **Domains** привязать `otvinta116.ru`.

### Netlify
Подключить репозиторий — всё задано в `netlify.toml` (`npm run build` → `dist`). Netlify сам отдаёт
`/snegokhod` из `snegokhod.html`.

### Обычный хостинг (REG.RU, Timeweb, Beget — Apache)
1. `npm run build`
2. Загрузить **содержимое** папки `dist/` в корень сайта (`public_html`). Файл `.htaccess` уже внутри:
   чистые адреса, редирект `/snegokhod/` → `/snegokhod`, 404, сжатие и кэш.

Для nginx:

```nginx
location / {
  try_files $uri $uri.html $uri/ =404;
}
rewrite ^/(.+)/$ /$1 permanent;
error_page 404 /404.html;
location /_astro/ { expires 1y; add_header Cache-Control "public, immutable"; }
gzip on; gzip_types text/css application/javascript image/svg+xml application/xml;
```

### Демо на GitHub Pages (для показа клиенту)

Демо: **https://artemdiscipline.github.io/otvinta/**. Обновляется само: каждый `git push` в `main`
запускает `.github/workflows/deploy.yml` — сборка, проверка `verify` и публикация (вкладка **Actions** на GitHub).

Демо-сборка ставит `noindex` и `Disallow: /`, чтобы прототип не конкурировал в поиске с действующим сайтом.
Собрать её локально:

```bash
npm run build:demo -- --site https://<логин>.github.io --base <репозиторий>
```

## SEO

- Старые URL сохранены, канонические адреса — `https://otvinta116.ru/...` без слеша на конце.
- `sitemap.xml` и `robots.txt` генерируются при сборке; мета-тег `yandex-verification` сохранён.
- JSON-LD: Organization, две площадки (SportsActivityLocation/LocalBusiness), Service + Offer/PriceSpecification,
  FAQPage, BreadcrumbList.
- Open Graph и Twitter-превью: `public/og-image.jpg` (1200×630).
- Яндекс.Метрика: задать `metrikaId` в `src/data/site.ts` — счётчик и цели подключатся сами.

## Шрифты

Unbounded (заголовки, 700–900) и Manrope (текст, 400–800) из Google Fonts, размещены на сайте и урезаны
до кириллицы, латиницы и нужных знаков (₽ — « » ≈ № →) — 34 + 21 КБ. Пересобрать (Python + fonttools):

```bash
pip install fonttools brotli
python -m fontTools.varLib.instancer "Unbounded[wght].ttf" wght=700:900 -o u.ttf
python -m fontTools.subset u.ttf --flavor=woff2 --output-file=src/assets/fonts/unbounded-700-900.woff2 \
  --unicodes="U+0020-007E,U+00A0,U+00A9,U+00AB,U+00B0,U+00B7,U+00BB,U+00D7,U+0401,U+0410-044F,U+0451,U+2009,U+2010-2014,U+2019,U+201C-201E,U+2022,U+2026,U+20BD,U+2116,U+2192,U+2212,U+2248"
```

(для Manrope — то же с `wght=400:800`).

## Структура

```
src/
  data/        контент и цены (редактировать здесь)
  components/  layout (шапка, футер, нижняя панель), sections (hero), blocks (блоки страниц), ui
  layouts/     Base.astro — <head>, мета, JSON-LD, Метрика
  pages/       страницы (имя файла = адрес), sitemap.xml.ts, robots.txt.ts
  scripts/     клиентский TypeScript: форма, модалка, сезон, табы, калькулятор, слайдер, галерея
  lib/         форматирование цен, адреса, картинки, JSON-LD, геометрия пропеллера
  assets/      фото и шрифты (оптимизируются при сборке)
public/        фавиконки, OG-картинка, manifest, .htaccess
scripts/       make-assets, verify, build-demo
serverless/    заготовка Telegram-бота для заявок
```
