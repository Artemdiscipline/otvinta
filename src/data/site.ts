import type { Fact, IconName, LocationId, ServiceId } from './types';

/**
 * Основные сведения о клубе: название, контакты, локации, цифры.
 * Поле `clarify: true` — значение спорное (см. TODO.md); рядом с ним на сайте
 * выводится сноска «уточняйте у администратора».
 */
export const site = {
  name: 'Клуб «От винта»',
  brand: 'От винта',
  slogan: 'Навстречу приключениям',
  description: 'Клуб активного отдыха в Казани: прокат снегоходов, квадроциклов, гидроциклов, флайборд, аквабайк-шоу, корпоративы',
  /** Боевой домен. Для демо-сборки переопределяется переменной SITE_URL. */
  url: 'https://otvinta116.ru',
  city: 'Казань',
  region: 'Республика Татарстан',
  /** Мета-тег Яндекс.Вебмастера — сохранён со старого сайта. */
  yandexVerification: '2769477e0dd6bb6f',
  /** TODO: ID счётчика Яндекс.Метрики (число). Пока null — счётчик не подключается. */
  metrikaId: null as number | null,
  /** Стаж клуба: на главной старого сайта «19 лет», на внутренних — «20 лет». */
  years: { value: 20, clarify: true },
  fromCenter: '15 минут от центра Казани',
  arriveBefore: 'за 15–25 минут до выезда',
} as const;

export interface Phone {
  id: string;
  /** Как показываем человеку */
  display: string;
  /** Для ссылки tel: — строго +7XXXXXXXXXX */
  e164: string;
  note?: string;
}

export const phones: Phone[] = [
  { id: 'main', display: '+7 (960) 040-10-60', e164: '+79600401060', note: 'основной, WhatsApp' },
  { id: 'second', display: '+7 (904) 761-17-46', e164: '+79047611746' },
  { id: 'city', display: '8 (843) 214-61-48', e164: '+78432146148', note: 'городской' },
];

export const mainPhone = phones[0]!;

/** Номер для WhatsApp-ссылок (без +). */
export const whatsappNumber = '79600401060';

export interface Social {
  id: 'telegram' | 'vk' | 'whatsapp' | 'max' | 'instagram';
  label: string;
  url: string;
  icon: IconName;
  handle?: string;
}

/** Порядок = приоритет. Instagram в РФ без VPN недоступен — только мелко в футере. */
export const socials: Social[] = [
  { id: 'telegram', label: 'Telegram', url: 'https://t.me/otvinta_16', icon: 'telegram', handle: '@otvinta_16' },
  { id: 'vk', label: 'ВКонтакте', url: 'https://vk.com/otvinta16', icon: 'vk', handle: 'vk.com/otvinta16' },
  { id: 'whatsapp', label: 'WhatsApp', url: `https://wa.me/${whatsappNumber}`, icon: 'whatsapp', handle: phones[0]!.display },
  {
    id: 'max',
    label: 'Max',
    url: 'https://max.ru/u/f9LHodD0cOLLdAHL5UrMyUo_iITHu1YYWwM095iN1eXaBejaDqlBsA4Y8T4',
    icon: 'max',
    handle: 'чат в Max',
  },
];

export const instagram: Social = {
  id: 'instagram',
  label: 'Instagram',
  url: 'https://www.instagram.com/otvinta16/',
  icon: 'instagram',
  handle: 'otvinta16',
};

export const social = (id: Social['id']): Social =>
  id === 'instagram' ? instagram : socials.find((s) => s.id === id)!;

/** Карточки клуба на картах — для ссылок «Читать отзывы». */
export const reviewPlatforms = [
  { id: '2gis', label: '2ГИС', url: 'https://2gis.ru/kazan/firm/2956015536601464/tab/reviews' },
  { id: 'yandex', label: 'Яндекс Картах', url: 'https://yandex.ru/maps/org/ot_vinta/1113537351/reviews/' },
] as const;

export interface Location {
  id: LocationId;
  /** Что здесь катают */
  title: string;
  short: string;
  services: ServiceId[];
  icon: IconName;
  locality: string;
  street: string;
  streetClarify?: boolean;
  landmarks: string[];
  route: string[];
  note: string;
  geo: { lat: number; lon: number };
  /** id карточки в 2ГИС, если есть — для точного маршрута */
  twoGisFirm?: string;
}

export const locations: Location[] = [
  {
    id: 'mirny',
    title: 'Снегоходы и квадроциклы',
    short: 'Мирный',
    services: ['snegokhod', 'kvadrotsikl'],
    icon: 'snowflake',
    locality: 'Казань, посёлок Мирный',
    // На сайте — 138, в 2ГИС и Яндексе — 124 и 2А. Уточнить у владельца (TODO.md).
    street: 'ул. Ново-Давликеевская, 138',
    streetClarify: true,
    landmarks: ['спортивная база «Динамо»', '«Охотничий клуб»'],
    route: [
      'Проезжайте посёлок Мирный по главной дороге до самого конца.',
      'Поверните направо по указателю — щиту на базу «Динамо».',
      'Мы на территории спортивной базы «Динамо», рядом «Охотничий клуб».',
    ],
    note: '15 минут от центра Казани',
    geo: { lat: 55.689333, lon: 49.113073 },
    twoGisFirm: '2956015536601464',
  },
  {
    id: 'santa',
    title: 'Гидроциклы и флайборд',
    short: 'Боровое Матюшино',
    services: ['gidrocikl', 'flaybord'],
    icon: 'waves',
    locality: 'посёлок Боровое Матюшино',
    street: 'санаторий «Санта» и база «Гидроспецстрой»',
    landmarks: ['берег Волги', 'пляж санатория «Санта»'],
    route: [
      'Едем в посёлок Боровое Матюшино, на берег Волги.',
      'Ориентиры — санаторий «Санта» и база «Гидроспецстрой».',
      'Перед выездом уточните у администратора, у какого причала встречаемся.',
    ],
    note: 'Летний сезон',
    geo: { lat: 55.607653, lon: 49.020823 },
  },
];

export const location = (id: LocationId): Location => locations.find((l) => l.id === id)!;

/** Режим работы: в 2ГИС — круглосуточно, на сайте не указан. См. TODO.md. */
export const hours = {
  label: 'Заезды по предварительной записи',
  note: 'Режим работы и сезонные даты уточняйте у администратора',
  clarify: true,
};

export interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  clarify?: boolean;
}

export const stats: Stat[] = [
  { value: site.years.value, suffix: ' лет', label: 'катаем гостей', clarify: site.years.clarify },
  { value: 50, suffix: '+', label: 'единиц японской техники' },
  { value: 24, label: 'снегохода Yamaha' },
  { value: 15, suffix: '+', label: 'гидроциклов Yamaha' },
  { value: 30, suffix: '+ км', label: 'авторских трасс' },
  { value: 400, prefix: 'до ', label: 'гостей на корпоративе' },
];

/** «Почему мы» */
export const advantages: Fact[] = [
  { icon: 'badge-check', title: 'Японская Yamaha', text: 'Самый большой парк Yamaha в России — не китайские аналоги.' },
  { icon: 'trophy', title: 'Инструкторы-чемпионы', text: 'Призёры чемпионатов мира по гонкам на гидроциклах.' },
  { icon: 'shirt', title: 'Экипировка бесплатно', text: 'Тёплые комбинезоны и рукавицы выдаём перед заездом.' },
  { icon: 'lightbulb', title: 'Вечерняя шоу-подсветка', text: 'Первыми в Казани подсветили трассы для вечерних заездов.' },
  { icon: 'drone', title: 'Аэросъёмка в подарок', text: 'Готовый ролик для соцсетей после снегоходной экскурсии — при лётной погоде.' },
  { icon: 'flame', title: 'Беседка с мангалом', text: 'Бесплатно — в лесу, после проката.' },
  { icon: 'baby', title: 'Дети от 2 лет', text: 'Пассажиром на снегоходе и квадроцикле вместе со взрослыми.' },
  { icon: 'map-pin', title: '15 минут от центра', text: 'База в посёлке Мирный, вода — в Боровом Матюшине.' },
];

/** Среди гостей клуба — только текстом, без логотипов. */
export const guests = [
  'игроки ХК «Ак Барс»',
  'игроки ФК «Рубин»',
  'игроки БК «УНИКС»',
  'пилоты «КАМАЗ-мастер»',
  'победители ралли «Париж — Дакар»',
];
