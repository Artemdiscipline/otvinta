import { approx, fixed, from, onRequest, range, type Price, type ServiceId, type TrackId } from './types';

/**
 * ВСЕ ЦЕНЫ САЙТА — ТОЛЬКО ЗДЕСЬ.
 * Источник: otvinta116.ru, страницы обновлены 01.06.2026 (квадроциклы — 18.06.2026).
 * `clarify: true` — по значению есть вопрос к владельцу (см. TODO.md),
 * на сайте рядом появится сноска «уточняйте у администратора».
 */
export const pricesMeta = {
  updatedAt: '2026-06',
  updatedAtLabel: 'июнь 2026',
  disclaimer: 'Цены актуальны на сезон 2026. Точную стоимость уточняйте у администратора.',
};

/* ───────────── Трассы: цветовая система клуба ───────────── */

export interface TrackMeta {
  name: string;
  color: string;
  /** цвет текста поверх цвета трассы (контраст AA) */
  ink: string;
  /** 1 — проще всего, 5 — сложнее всего */
  level: number;
}

export const tracks: Record<TrackId, TrackMeta> = {
  white: { name: 'Белая', color: '#F2F5FA', ink: '#05070D', level: 1 },
  green: { name: 'Зелёная', color: '#2ECC71', ink: '#05070D', level: 2 },
  red: { name: 'Красная', color: '#E63946', ink: '#05070D', level: 3 },
  individual: { name: 'Индивидуальная', color: '#D4A84B', ink: '#05070D', level: 4 },
  black: { name: 'Чёрная', color: '#111111', ink: '#FFFFFF', level: 5 },
};

export interface TariffVariant {
  id: string;
  /** Модель техники, если цена от неё зависит */
  tech?: string;
  price: Price;
  /** «за час», «за квадроцикл»… */
  unit?: string;
  capacity?: string;
  note?: string;
  clarify?: boolean;
}

export interface TrackTariff {
  id: string;
  track: TrackId;
  title: string;
  variants: TariffVariant[];
  duration?: string;
  durationClarify?: boolean;
  capacity?: string;
  audience: string;
  sights: string[];
  conditions?: string[];
  when?: string;
  badge?: string;
}

/* ───────────── Снегоходы (Мирный) ───────────── */

export const snowmobileTracks: TrackTariff[] = [
  {
    id: 'snow-white',
    track: 'white',
    title: 'Белая трасса',
    // Длительность и состав Белой трассы на сайте не указаны.
    variants: [{ id: 'snow-white', price: fixed(1000) }],
    durationClarify: true,
    audience: 'Пробный заезд — познакомиться со снегоходом',
    sights: [],
  },
  {
    id: 'snow-green',
    track: 'green',
    title: 'Зелёная трасса',
    variants: [{ id: 'snow-green', price: fixed(3000) }],
    duration: '35–45 мин',
    capacity: '2 человека',
    audience: 'Новичкам',
    sights: ['поля', 'болота и камыши', 'остановка для фото'],
  },
  {
    id: 'snow-red',
    track: 'red',
    title: 'Красная трасса',
    variants: [{ id: 'snow-red', price: range(6000, 7000), unit: 'за час', note: 'цена зависит от модели снегохода' }],
    duration: '1 час',
    capacity: '2 человека + ребёнок до 5 лет',
    audience: 'Самая популярная — для всей семьи',
    sights: ['хвойный лес', 'ущелья', 'берег Волги'],
    when: 'днём и вечером',
    badge: 'Хит',
  },
  {
    id: 'snow-black',
    track: 'black',
    title: 'Чёрная трасса',
    // На сайте встречается «15 000 ₽/час для 2-х человек» и «15 000 ₽ ~1 ч 20 мин».
    variants: [{ id: 'snow-black', price: fixed(15000), clarify: true }],
    duration: '~1 ч 20 мин',
    capacity: '2 человека',
    audience: 'Любителям экстрима',
    sights: ['нехоженые тропы', 'перепады рельефа'],
  },
  {
    id: 'snow-individual',
    track: 'individual',
    title: 'Индивидуальная трасса (VIP)',
    variants: [{ id: 'snow-individual', price: fixed(12000) }],
    duration: '~1 ч 20 мин',
    audience: 'VIP: углублённый маршрут',
    sights: ['вся Красная трасса', 'часть Чёрной трассы'],
  },
];

export const snowmobileIncluded = ['тёплые комбинезоны и рукавицы', 'костёр', 'горячий чай'];

export const snowmobileTech = {
  model: 'Yamaha Viking 540',
  features: [
    { icon: 'users', title: 'До 2 взрослых + ребёнок' },
    { icon: 'thermometer-snowflake', title: 'Подогрев рук и ног' },
    { icon: 'wind', title: 'Ветрозащита' },
    { icon: 'shield-check', title: 'Устойчивость на трассе' },
  ],
  example: { name: 'Yamaha VK540 IV «Сусанин»', color: 'золотистый' },
} as const;

/* ───────────── Квадроциклы (Мирный) ───────────── */

export const quadTracks: TrackTariff[] = [
  {
    id: 'quad-green',
    track: 'green',
    title: 'Зелёная трасса',
    // Диапазон 500–3 000 ₽ без расшифровки; в 2ГИС (14.06.2026) — 3 000 ₽ за 1 час.
    variants: [{ id: 'quad-green', price: range(500, 3000), clarify: true }],
    duration: '15–55 мин',
    capacity: '2 человека + ребёнок до 5 лет',
    audience: 'Новичкам и семьям',
    sights: [],
  },
  {
    id: 'quad-red',
    track: 'red',
    title: 'Красная трасса',
    variants: [
      { id: 'quad-red-shark', tech: 'SHARK (Китай)', price: fixed(4000), capacity: 'двухместный, до 140 кг' },
      {
        id: 'quad-red-grizzly',
        tech: 'Yamaha Grizzly 750',
        price: fixed(6000),
        capacity: '2 взрослых + ребёнок до 5 лет, до 160 кг',
      },
    ],
    duration: '~1 час',
    audience: 'Выбор техники: SHARK или полноприводный Yamaha Grizzly 750',
    sights: [],
  },
  {
    id: 'quad-black',
    track: 'black',
    title: 'Чёрная трасса',
    // На странице цен — 12 000 ₽, на странице квадроциклов — 15 000 ₽; за что именно — неясно.
    variants: [{ id: 'quad-black', tech: 'Yamaha Grizzly 750', price: fixed(15000), clarify: true }],
    duration: '~1 ч 20 мин',
    audience: 'Для опытных',
    sights: ['бездорожье', 'дремучий лес', 'привал с чаем'],
    conditions: ['от 2 квадроциклов'],
  },
  {
    id: 'quad-individual',
    track: 'individual',
    title: 'Индивидуальный маршрут',
    variants: [{ id: 'quad-individual', tech: 'Yamaha Grizzly 750', price: fixed(12000), unit: 'за квадроцикл' }],
    duration: '~1 ч 20 мин',
    audience: 'Длинный маршрут для компании',
    sights: ['сосновый лес', 'овраги и ущелья', 'завалы и камыш', 'берег Волги', 'привал, чай в термосах'],
    conditions: ['от 2 квадроциклов'],
  },
];

export const quadModels = [
  {
    id: 'shark',
    name: 'SHARK',
    origin: 'Китай',
    drive: '—',
    seats: 'двухместный',
    maxLoad: 'до 140 кг',
    tracks: ['Красная'],
    redPrice: 'quad-red-shark',
  },
  {
    id: 'grizzly',
    name: 'Yamaha Grizzly 750',
    origin: 'Япония',
    drive: 'полный привод',
    seats: '2 взрослых + ребёнок до 5 лет',
    maxLoad: 'до 160 кг',
    tracks: ['Красная', 'Индивидуальный', 'Чёрная'],
    redPrice: 'quad-red-grizzly',
  },
] as const;

/* ───────────── Гидроциклы (Боровое Матюшино) ───────────── */

export interface PriceLine {
  id: string;
  label: string;
  price: Price;
  unit?: string;
  note?: string;
}

export const jetFormats = [
  {
    id: 'beach',
    title: 'Пляжный',
    icon: 'sun',
    text: 'Катание у пляжа под контролем инструктора — самое простое начало.',
    age: 'от 3 лет',
    prices: [{ id: 'jet-beach-ride', label: 'заезд', price: from(500), unit: 'за заезд' }] as PriceLine[],
  },
  {
    id: 'sport',
    title: 'Спортивный',
    icon: 'gauge',
    text: 'Трасса по буям на Yamaha Super Jet и GP1800 — для тех, кто хочет скорости.',
    age: 'от 12 лет',
    prices: [
      { id: 'jet-sport-10', label: '10 минут', price: from(2000), unit: 'за 10 мин' },
      { id: 'jet-sport-60', label: '1 час', price: from(6000), unit: 'за час' },
    ] as PriceLine[],
  },
  {
    id: 'tour',
    title: 'Туристический',
    icon: 'compass',
    text: 'Прогулка по Волге с инструктором на отдельном гидроцикле. До 3 человек / 150 кг на одном гидроцикле.',
    age: 'от 3 лет',
    prices: [] as PriceLine[],
  },
] as const;

export const jetBeachPrices: PriceLine[] = [
  { id: 'jet-beach-5-kid', label: '5 минут с ребёнком', price: fixed(1000) },
  { id: 'jet-beach-10-single', label: '10 минут, одноместный', price: fixed(1000) },
  { id: 'jet-beach-10-double', label: '10 минут, двухместный', price: approx(3000) },
  { id: 'jet-beach-60-single', label: '1 час, одноместный', price: from(6000) },
  { id: 'jet-beach-60-double', label: '1 час, двухместный', price: approx(18000) },
];

export interface JetProgram {
  id: string;
  name: string;
  variants: { id: string; label?: string; price: Price }[];
  includes: string[];
  people: string;
  note?: string;
  badge?: string;
}

export const jetPrograms: JetProgram[] = [
  {
    id: 'jet-start',
    name: 'Старт',
    variants: [{ id: 'jet-start', price: fixed(3500) }],
    includes: ['гидроцикл 10 мин', 'сап-доска 30 мин'],
    people: '1–2 человека',
  },
  {
    id: 'jet-light',
    name: 'Лайт',
    variants: [{ id: 'jet-light', price: fixed(5000) }],
    includes: ['гидроцикл 15 мин', 'сап-доска 40 мин'],
    people: '1–2 человека',
  },
  {
    id: 'jet-standard',
    name: 'Стандарт',
    variants: [{ id: 'jet-standard', price: fixed(6000) }],
    includes: ['гидроцикл 20 мин', 'сап-доска 50 мин'],
    people: '1–2 человека или пара с ребёнком',
  },
  {
    id: 'jet-optimum',
    name: 'Оптимум',
    variants: [{ id: 'jet-optimum', price: fixed(8500) }],
    includes: ['гидроцикл 30 мин', 'сап-доска 1 час'],
    people: '2–3 человека или пара с 2+ детьми',
    badge: 'Семьям',
  },
  {
    id: 'jet-sport',
    name: 'Спорт',
    variants: [
      { id: 'jet-sport-1', label: '1 человек, час', price: fixed(6000) },
      { id: 'jet-sport-2', label: '2 человека, час', price: fixed(12000) },
    ],
    includes: ['Yamaha Super Jet', 'обучение включено'],
    people: '1–2 человека',
  },
  {
    id: 'jet-otryv',
    name: 'Полный отрыв',
    variants: [{ id: 'jet-otryv', price: fixed(19000) }],
    includes: ['4 гидроцикла по 10 мин — по возрастанию мощности: 80 / 110 / 180 / 260 л. с.', 'сап-доска 1 час'],
    people: '1–2 человека',
    badge: 'Хит',
  },
  {
    id: 'jet-bak',
    name: 'Полный бак',
    variants: [
      { id: 'jet-bak-2t', label: 'Yamaha SJ 2t', price: fixed(12000) },
      { id: 'jet-bak-4t', label: 'Yamaha SJ 4t (новая)', price: fixed(14000) },
    ],
    includes: ['2 часа или пока не кончится бак 20 л'],
    people: '1 человек',
    note: 'Только при небольшой загрузке клуба',
  },
];

export interface JetTour {
  id: string;
  name: string;
  duration: string;
  variants: { id: string; label?: string; price: Price }[];
  priceNote?: string;
  route: string[];
  extras?: string[];
  /** Точки для схемы маршрута (относительные координаты 0–100) */
  scheme: { x: number; y: number; label?: string }[];
  badge?: string;
}

export const jetTours: JetTour[] = [
  {
    id: 'tour-south',
    name: 'Южный берег',
    duration: '40 мин',
    variants: [{ id: 'tour-south', label: 'двухместный гидроцикл', price: from(12000) }],
    priceNote: 'за двухместный гидроцикл, выезжают 2 гидроцикла',
    route: ['водопад и родник', 'вокруг моста трассы «Москва — Китай»', 'купание в Волге'],
    scheme: [
      { x: 18, y: 30, label: 'Старт' },
      { x: 42, y: 62, label: 'Родник' },
      { x: 70, y: 55, label: 'Мост' },
      { x: 52, y: 28 },
    ],
  },
  {
    id: 'tour-teteevo',
    name: 'Тетеевские джунгли',
    duration: 'более часа',
    variants: [
      { id: 'tour-teteevo-1', price: fixed(18000) },
      { id: 'tour-teteevo-2', price: fixed(22000) },
      { id: 'tour-teteevo-3', price: fixed(24000) },
      { id: 'tour-teteevo-4', price: fixed(30000) },
      { id: 'tour-teteevo-5', price: fixed(36000) },
      { id: 'tour-teteevo-6', price: fixed(42000) },
    ],
    priceNote: 'в зависимости от мощности гидроцикла',
    route: ['под мостом', 'вдоль восточного берега', 'протоки Кордона и Тетеево', 'тёплые затоны'],
    scheme: [
      { x: 15, y: 70, label: 'Старт' },
      { x: 35, y: 45, label: 'Мост' },
      { x: 60, y: 30, label: 'Кордон' },
      { x: 84, y: 48, label: 'Тетеево' },
    ],
  },
  {
    id: 'tour-blue-lakes',
    name: 'Голубые озёра',
    duration: '3 часа',
    variants: [{ id: 'tour-blue-lakes', price: from(36000) }],
    route: [
      'Боровое Матюшино',
      'Зелёный Бор',
      'Победилово',
      'Речной порт',
      'Казанский Кремль',
      'Ривьера',
      'Казань Арена',
      'река Казанка',
      'Голубые озёра',
    ],
    extras: ['сопровождение', 'привал и чай', '«космическое питание» в тюбиках', 'фотосессия', 'купание'],
    scheme: [
      { x: 8, y: 82, label: 'Б. Матюшино' },
      { x: 30, y: 66 },
      { x: 48, y: 52, label: 'Кремль' },
      { x: 64, y: 40, label: 'Казань Арена' },
      { x: 92, y: 14, label: 'Голубые озёра' },
    ],
    badge: 'Большой тур',
  },
  {
    id: 'tour-free',
    name: 'Свободный полёт',
    duration: 'по договорённости',
    variants: [{ id: 'tour-free', price: onRequest() }],
    route: ['индивидуальный маршрут под ваши пожелания'],
    scheme: [
      { x: 20, y: 50, label: 'Старт' },
      { x: 50, y: 25 },
      { x: 80, y: 55, label: '?' },
    ],
  },
];

export const jetModelPicker = [
  { who: 'Новичкам', icon: 'leaf', models: ['Yamaha VX Cruiser'] },
  { who: 'Хочется активнее', icon: 'zap', models: ['Yamaha VX Sport'] },
  { who: 'Семьям', icon: 'users', models: ['Yamaha FX Cruiser'] },
  { who: 'Экстрим', icon: 'flame', models: ['Super Jet', 'EXR', 'FZR', 'GP1800'] },
] as const;

export const jetFleet = {
  count: '15+',
  text: 'гидроциклов Yamaha — от детских (8+) до гоночных',
  top: '350 л. с. и до 120 км/ч',
  kids: 'Детские гидроциклы — с 8 лет',
  advice: 'Совет клуба: за один визит попробуйте 2–3 разных гидроцикла.',
};

/* ───────────── Флайборд и ховерборд ───────────── */

export const flyboardTariffs = [
  {
    id: 'fly-single',
    name: 'Одинарный полёт',
    price: fixed(12000),
    duration: '~1 час для новичка',
    text: 'Инструктаж, экипировка и первый полёт.',
  },
  {
    id: 'fly-double',
    name: 'Двойной полёт',
    price: fixed(16000),
    duration: '~1,5 часа',
    text: 'Обучающий полёт и повторный — после 15 минут отдыха.',
    badge: 'Хит',
  },
  {
    id: 'fly-all',
    name: '«Всё включено»',
    price: fixed(24000),
    duration: '~2 часа',
    text: 'Флайборд + ховерборд за один визит.',
  },
] as const;

/* ───────────── Без прайса на сайте — «по запросу» (см. TODO.md) ───────────── */

export const onRequestServices = [
  'электрофойл',
  'сап-доски',
  'вейкборд',
  'водные лыжи',
  'банан',
  'ватрушка',
  'сёрф',
  'плавучий дом с баней',
  'эндуро и мотоциклы',
  'баня',
  'гостевые дома',
  'банкетный зал',
  'пейнтбол',
  'лазертаг',
  'стрельба по тарелкам',
  'аквабайк-шоу',
  'корпоративы',
];

/* ───────────── Плоский каталог для калькулятора и формы заявки ───────────── */

export interface CatalogItem {
  id: string;
  label: string;
  price: Price;
  unit?: string;
  clarify?: boolean;
}

export interface CatalogGroup {
  label: string;
  items: CatalogItem[];
}

export interface CatalogService {
  id: ServiceId;
  label: string;
  /** «снегоходов», «гидроциклов»… — для поля «количество» */
  unitLabel: string;
  groups: CatalogGroup[];
}

const fromTracks = (list: TrackTariff[]): CatalogItem[] =>
  list.flatMap((t) =>
    t.variants.map((v) => ({
      id: v.id,
      label: v.tech ? `${t.title} — ${v.tech}` : t.title,
      price: v.price,
      unit: v.unit,
      clarify: v.clarify,
    })),
  );

const multi = (name: string, v: { id: string; label?: string; price: Price }[], prefix = ''): CatalogItem[] =>
  v.map((x) => ({ id: x.id, label: `${prefix}${name}${x.label ? ` — ${x.label}` : ''}`, price: x.price }));

export const catalog: CatalogService[] = [
  {
    id: 'snegokhod',
    label: 'Снегоходы',
    unitLabel: 'снегоходов',
    groups: [{ label: 'Трассы', items: fromTracks(snowmobileTracks) }],
  },
  {
    id: 'kvadrotsikl',
    label: 'Квадроциклы',
    unitLabel: 'квадроциклов',
    groups: [{ label: 'Маршруты', items: fromTracks(quadTracks) }],
  },
  {
    id: 'gidrocikl',
    label: 'Гидроциклы',
    unitLabel: 'гидроциклов / программ',
    groups: [
      {
        label: 'Пляжный формат',
        items: [...jetFormats[0].prices, ...jetBeachPrices].map((p) => ({
          id: p.id,
          label: `Пляжный: ${p.label}`,
          price: p.price,
          unit: p.unit,
        })),
      },
      {
        label: 'Спортивный формат',
        items: jetFormats[1].prices.map((p) => ({ id: p.id, label: `Спортивный: ${p.label}`, price: p.price })),
      },
      { label: 'Программы', items: jetPrograms.flatMap((p) => multi(`«${p.name}»`, p.variants, 'Программа ')) },
      { label: 'Туры', items: jetTours.flatMap((t) => multi(`«${t.name}»`, t.variants, 'Тур ')) },
    ],
  },
  {
    id: 'flaybord',
    label: 'Флайборд и ховерборд',
    unitLabel: 'участников',
    groups: [{ label: 'Тарифы', items: flyboardTariffs.map((t) => ({ id: t.id, label: t.name, price: t.price })) }],
  },
];

export const catalogItem = (id: string): CatalogItem | undefined => {
  for (const s of catalog) for (const g of s.groups) for (const i of g.items) if (i.id === id) return i;
  return undefined;
};

/** Минимальная цена по услуге — для «от X ₽» на карточках. */
export const minPrice = (service: ServiceId): Price => {
  const s = catalog.find((c) => c.id === service);
  if (!s) return onRequest();
  let min = Infinity;
  for (const g of s.groups)
    for (const i of g.items) {
      const v = i.price.kind === 'range' ? i.price.min : i.price.kind === 'request' ? Infinity : i.price.value;
      if (v < min) min = v;
    }
  return Number.isFinite(min) ? from(min) : onRequest();
};
