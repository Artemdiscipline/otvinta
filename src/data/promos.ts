import type { IconName, ServiceId } from './types';

/** Акции и бонусы клуба (со страницы «Акции и цены»). */
export interface Promo {
  id: string;
  icon: IconName;
  title: string;
  text: string;
  /** Плашка: когда действует */
  tag: string;
  hot?: boolean;
  services: ServiceId[];
}

export const promos: Promo[] = [
  {
    id: 'friday',
    icon: 'percent',
    title: '−20% по пятницам',
    text: 'Скидка на вечерние семейные заезды на снегоходах в 18:00 и 19:00 по вечернему лесу.',
    tag: 'Зима',
    hot: true,
    services: ['snegokhod'],
  },
  {
    id: 'aerial',
    icon: 'drone',
    title: 'Аэросъёмка в подарок',
    text: 'Готовый видеоролик для соцсетей в конце снегоходной экскурсии. При лётной погоде.',
    tag: 'Зима',
    services: ['snegokhod'],
  },
  {
    id: 'sup',
    icon: 'waves',
    title: 'Сап-доска бесплатно',
    text: 'Гостям Красной трассы на снегоходе или квадроцикле — бесплатный заплыв на сап-доске летом.',
    tag: 'Летом',
    services: ['snegokhod', 'kvadrotsikl'],
  },
  {
    id: 'sport-jet',
    icon: 'gauge',
    title: 'Спортивный гидроцикл в подарок',
    text: 'Гостям Чёрной и Индивидуальной трасс — бесплатный заезд на спортивном гидроцикле летом.',
    tag: 'Летом',
    services: ['snegokhod', 'kvadrotsikl', 'gidrocikl'],
  },
  {
    id: 'gazebo',
    icon: 'flame',
    title: 'Беседка с мангалом',
    text: 'Бесплатная беседка в лесу после проката — для пикника или небольшого праздника.',
    tag: 'Всегда',
    services: ['snegokhod', 'kvadrotsikl', 'korporativnyy-otdykh'],
  },
  {
    id: 'banya',
    icon: 'bath',
    title: 'Плавучая баня',
    text: 'Бесплатная баня на воде для гостей гидроциклов в прохладную погоду — по будням, по запросу.',
    tag: 'Будни',
    services: ['gidrocikl'],
  },
  {
    id: 'phuket',
    icon: 'plane',
    title: 'Тур по Пхукету в подарок',
    text: 'Закажите индивидуальный гидро-тур в Казани — и получите бесплатный тур на гидроцикле по островам Пхукета (Таиланд).',
    tag: 'Гидро-туры',
    hot: true,
    services: ['gidrocikl'],
  },
];

export const promosFor = (id: ServiceId): Promo[] => promos.filter((p) => p.services.includes(id));
