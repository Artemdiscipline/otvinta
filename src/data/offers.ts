import type { PhotoKey } from './photos';
import type { Fact, IconName, SeasonId, ServiceId } from './types';

/* ───────────── Подарочные сертификаты ───────────── */

export interface CertDesign {
  id: string;
  title: string;
  icon: IconName;
  photo?: PhotoKey;
}

export const certificate = {
  lead: 'Единый сертификат на любую активность клуба — получатель сам выберет, на чём кататься.',
  lineup: 'Линейка от бюджетных до премиум-класса',
  activities: [
    'заезд на снегоходе',
    'экскурсия на квадроцикле',
    'катание на гидроцикле',
    'полёт на флайборде',
    'полёт на ховерборде',
    'прокат сап-досок',
    'прокат мотоциклов и эндуро',
    'электрофойл и гидрофойл',
    'сёрф и вейкборд',
    'водные лыжи',
    'банан и ватрушка',
  ],
  designs: [
    { id: 'ice', title: 'В куске настоящего льда', icon: 'snowflake' },
    { id: 'wood-box', title: 'В деревянной коробке с гравировкой', icon: 'package', photo: 'cert-wood-box' },
    { id: 'metal', title: 'На металле', icon: 'shield-check' },
    { id: 'wax', title: 'Под сургучной печатью', icon: 'stamp', photo: 'cert-wax-seal' },
    { id: 'log', title: 'В бревне', icon: 'trees' },
    { id: 'magnets', title: 'С фирменными магнитиками', icon: 'magnet', photo: 'cert-magnets' },
  ] as CertDesign[],
  delivery: [
    {
      id: 'online',
      icon: 'smartphone',
      title: 'Онлайн в WhatsApp',
      text: 'Пришлём за 2 минуты. Распечатайте и упакуйте сами — или подарите в электронном виде.',
    },
    {
      id: 'taxi',
      icon: 'truck',
      title: 'Доставка Яндекс Такси',
      text: 'До подъезда по Казани. Доставку оплачивает получатель.',
    },
    {
      id: 'pickup',
      icon: 'map-pin',
      title: 'Самовывоз',
      text: 'Заберите в клубе — предварительно свяжитесь с нами.',
    },
  ] as { id: string; icon: IconName; title: string; text: string }[],
};

/* ───────────── Корпоративы ───────────── */

export const corporate = {
  min: 2,
  max: 400,
  seasons: [
    {
      id: 'summer' as SeasonId,
      title: 'Летний корпоратив на природе',
      icon: 'sun' as IconName,
      photo: 'jet-duo' as PhotoKey,
      items: [
        'гидроциклы и вейкборд',
        'плавающий дом с баней на воде',
        'сап-доски и водные развлечения',
        'электрофойл, банан, ватрушка',
        'флайборд, ховерборд и водное шоу',
      ],
    },
    {
      id: 'winter' as SeasonId,
      title: 'Зимний спортивный корпоратив',
      icon: 'snowflake' as IconName,
      photo: 'snow-sunset' as PhotoKey,
      items: ['снегоходы', 'зимние внедорожные маршруты', 'экстремальные заезды по лесу'],
    },
    {
      id: 'offseason' as SeasonId,
      title: 'Весна и осень',
      icon: 'leaf' as IconName,
      photo: 'quad-field' as PhotoKey,
      items: ['квадроциклы', 'эндуро', 'мотоциклы'],
    },
  ],
  turnkey: [
    { icon: 'clipboard-list', title: 'Сценарий', text: 'Разработаем программу мероприятия под вашу команду.' },
    { icon: 'route', title: 'Техника и маршруты', text: 'Подберём технику и трассы под уровень и состав группы.' },
    { icon: 'shield-check', title: 'Инструктаж и сопровождение', text: 'Инструкторы проводят инструктаж и едут вместе с группой.' },
    { icon: 'camera', title: 'Фото и видео', text: 'Снимем мероприятие — останется на память команде.' },
  ] as Fact[],
  infrastructure: [
    { icon: 'utensils', title: 'Банкетный зал' },
    { icon: 'house', title: 'Гостевые дома' },
    { icon: 'bath', title: 'Баня' },
    { icon: 'flame', title: 'Беседка с мангалом в лесу — бесплатно' },
    { icon: 'crosshair', title: 'Пейнтбол и лазертаг' },
    { icon: 'target', title: 'Стрельба по тарелкам' },
    { icon: 'goal', title: 'Футбольное поле и спортплощадки' },
  ] as Fact[],
  benefits: ['сплотить коллектив', 'повысить вовлечённость и мотивацию', 'наладить общение внутри команды'],
  /** Варианты для мультиселекта в форме расчёта */
  activities: [
    'Снегоходы',
    'Квадроциклы',
    'Гидроциклы',
    'Флайборд / ховерборд',
    'Аквабайк-шоу',
    'Сап-доски и водные развлечения',
    'Эндуро / мотоциклы',
    'Пейнтбол',
    'Лазертаг',
    'Стрельба по тарелкам',
    'Баня',
  ],
};

/* ───────────── Аквабайк-шоу ───────────── */

export const show = {
  athletes: { min: 1, max: 5 },
  duration: 'от 2 до 20 минут',
  tricks: ['гидроцикл', 'флайборд', 'ховерборд'],
  dramaturgy:
    'В начале — простые элементы для разминки, потом сложность растёт, трюки становятся головокружительными, а напряжение достигает пика в финале.',
  venues: [
    { icon: 'sun', title: 'Открытая вода', text: 'Летом — на реке, озере или у набережной.' },
    { icon: 'droplets', title: 'Крытый бассейн или аквапарк', text: 'В любое время года.' },
  ] as Fact[],
  achievements: [
    { icon: 'trophy', title: 'Открывали чемпионат в Барселоне', text: 'Международный чемпионат по водным видам спорта.' },
    { icon: 'medal', title: 'Победители международных соревнований', text: 'Спортсмены клуба — профессионалы, а не любители.' },
    { icon: 'map-pin', title: 'Крым и другие города', text: 'Выступали на праздниках по всей России.' },
    { icon: 'plane', title: 'Выезд в любую точку мира', text: 'Всё снаряжение и оборудование привозим с собой.' },
  ] as Fact[],
  eventFormats: ['День города', 'Открытие соревнований', 'Спортивный фестиваль', 'Корпоратив', 'Частный праздник', 'Другое'],
  venueOptions: ['Открытая вода (река, озеро)', 'Крытый бассейн', 'Аквапарк', 'Пока не знаю'],
};

/* ───────────── База отдыха ───────────── */

export const base = {
  audiences: [
    { icon: 'heart-handshake', title: 'Парам', text: 'Необычное свидание на природе.' },
    { icon: 'users', title: 'Друзьям', text: 'Спорт, скорость и адреналин компанией.' },
    { icon: 'baby', title: 'Семьям', text: 'Дети катаются пассажирами с 2 лет.' },
    { icon: 'party-popper', title: 'Командам', text: 'Корпоративы от 2 до 400 человек.' },
  ] as Fact[],
  land: [
    { icon: 'house', title: 'Гостевые дома' },
    { icon: 'bath', title: 'Баня' },
    { icon: 'ship', title: 'Плавучий дом-баня на воде' },
    { icon: 'flame', title: 'Мангальная площадка и беседки' },
    { icon: 'utensils', title: 'Банкетный зал' },
    { icon: 'crosshair', title: 'Пейнтбол' },
    { icon: 'zap', title: 'Лазертаг' },
    { icon: 'target', title: 'Стрельба по тарелкам' },
    { icon: 'goal', title: 'Футбольное поле и аренда спортобъектов' },
  ] as Fact[],
  water: [
    { icon: 'waves', title: 'Сап-доски' },
    { icon: 'wind', title: 'Вейкборд' },
    { icon: 'droplets', title: 'Водные лыжи' },
    { icon: 'life-buoy', title: 'Банан' },
    { icon: 'life-buoy', title: 'Ватрушка' },
    { icon: 'zap', title: 'Электрофойл' },
    { icon: 'waves', title: 'Сёрф' },
  ] as Fact[],
  moto: [
    { icon: 'bike', title: 'Эндуро' },
    { icon: 'bike', title: 'Мотоциклы' },
  ] as Fact[],
};

/* ───────────── Сезоны для главной ───────────── */

export interface Season {
  id: SeasonId;
  label: string;
  icon: IconName;
  /** номера месяцев 1–12 */
  months: number[];
  kicker: string;
  headline: string;
  photo: PhotoKey;
  order: ServiceId[];
  cta: ServiceId;
}

export const seasons: Season[] = [
  {
    id: 'winter',
    label: 'Зима',
    icon: 'snowflake',
    months: [12, 1, 2, 3],
    kicker: 'Сезон снегоходов',
    headline: 'Снегоходы Yamaha по зимнему лесу и берегу Волги',
    photo: 'snow-sunset',
    order: ['snegokhod', 'korporativnyy-otdykh', 'kvadrotsikl', 'vodnoye-shou', 'gidrocikl', 'flaybord'],
    cta: 'snegokhod',
  },
  {
    id: 'offseason',
    label: 'Межсезонье',
    icon: 'leaf',
    months: [4, 10, 11],
    kicker: 'Межсезонье — время квадроциклов',
    headline: 'Квадроциклы Yamaha по лесу, оврагам и берегу Волги',
    photo: 'quad-beach-wheelie',
    order: ['kvadrotsikl', 'korporativnyy-otdykh', 'vodnoye-shou', 'snegokhod', 'gidrocikl', 'flaybord'],
    cta: 'kvadrotsikl',
  },
  {
    id: 'summer',
    label: 'Лето',
    icon: 'sun',
    months: [5, 6, 7, 8, 9],
    kicker: 'Сезон воды',
    headline: 'Гидроциклы, флайборд и туры по Волге',
    photo: 'jet-splash',
    order: ['gidrocikl', 'flaybord', 'kvadrotsikl', 'vodnoye-shou', 'korporativnyy-otdykh', 'snegokhod'],
    cta: 'gidrocikl',
  },
];

export const seasonForMonth = (month: number): SeasonId =>
  seasons.find((s) => s.months.includes(month))?.id ?? 'summer';
