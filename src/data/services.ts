import type { PhotoKey } from './photos';
import { minPrice } from './prices';
import { onRequest, type IconName, type LocationId, type Price, type SeasonId, type ServiceId } from './types';

/**
 * Каталог услуг: карточки на главной, меню, карта сайта.
 * Адреса страниц совпадают со старым сайтом — позиции в Яндексе сохраняются.
 */
export interface Service {
  id: ServiceId;
  path: string;
  /** Название в меню */
  nav: string;
  title: string;
  tagline: string;
  photo: PhotoKey;
  icon: IconName;
  location?: LocationId;
  seasons: SeasonId[];
  /** «от X ₽» на карточке */
  price: Price;
  /** Подпись вместо цены, если цены нет */
  priceAlt?: string;
  /** id услуги в форме заявки */
  bookingId: ServiceId;
}

export const services: Service[] = [
  {
    id: 'snegokhod',
    path: '/snegokhod',
    nav: 'Снегоходы',
    title: 'Снегоходы',
    tagline: 'Yamaha Viking по зимнему лесу, ущельям и берегу Волги. Пять трасс — от пробной до экстрима.',
    photo: 'snow-forest-track',
    icon: 'snowflake',
    location: 'mirny',
    seasons: ['winter'],
    price: minPrice('snegokhod'),
    bookingId: 'snegokhod',
  },
  {
    id: 'kvadrotsikl',
    path: '/kvadrotsikl',
    nav: 'Квадроциклы',
    title: 'Квадроциклы',
    tagline: 'Полноприводные Yamaha Grizzly 750 и SHARK: лес, овраги, камыш и привал с чаем.',
    photo: 'quad-field',
    icon: 'mountain',
    location: 'mirny',
    seasons: ['offseason', 'summer'],
    price: minPrice('kvadrotsikl'),
    bookingId: 'kvadrotsikl',
  },
  {
    id: 'gidrocikl',
    path: '/gidrocikl',
    nav: 'Гидроциклы',
    title: 'Гидроциклы',
    tagline: '15+ гидроциклов Yamaha, программы с сап-доской и туры по Волге до Кремля и Голубых озёр.',
    photo: 'jet-volga',
    icon: 'waves',
    location: 'santa',
    seasons: ['summer'],
    price: minPrice('gidrocikl'),
    bookingId: 'gidrocikl',
  },
  {
    id: 'flaybord',
    path: '/flaybord',
    nav: 'Флайборд',
    title: 'Флайборд и ховерборд',
    tagline: 'Полёт над водой на реактивной струе. Возраст — от 7 до 70 лет.',
    photo: 'flyboard-arc',
    icon: 'wind',
    location: 'santa',
    seasons: ['summer'],
    price: minPrice('flaybord'),
    bookingId: 'flaybord',
  },
  {
    id: 'vodnoye-shou',
    path: '/vodnoye-shou',
    nav: 'Шоу',
    title: 'Аквабайк-шоу',
    tagline: 'От 1 до 5 спортсменов, трюки на гидроцикле, флайборде и ховерборде. Выезд в любой город.',
    photo: 'show-jet-flip',
    icon: 'sparkles',
    seasons: ['summer', 'winter', 'offseason'],
    price: onRequest(),
    bookingId: 'vodnoye-shou',
  },
  {
    id: 'korporativnyy-otdykh',
    path: '/korporativnyy-otdykh',
    nav: 'Корпоративы',
    title: 'Корпоративы',
    tagline: 'От 2 до 400 человек «под ключ»: сценарий, техника, инструкторы, банкет и фото.',
    photo: 'jet-duo',
    icon: 'users',
    location: 'mirny',
    seasons: ['winter', 'summer', 'offseason'],
    price: onRequest(),
    priceAlt: 'до 400 гостей',
    bookingId: 'korporativnyy-otdykh',
  },
];

export const service = (id: ServiceId): Service => services.find((s) => s.id === id)!;
