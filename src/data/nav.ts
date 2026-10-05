/** Главное меню (шапка) и ссылки футера. */
export interface NavLink {
  label: string;
  href: string;
}

export const mainNav: NavLink[] = [
  { label: 'Снегоходы', href: '/snegokhod' },
  { label: 'Квадроциклы', href: '/kvadrotsikl' },
  { label: 'Гидроциклы', href: '/gidrocikl' },
  { label: 'Флайборд', href: '/flaybord' },
  { label: 'Шоу', href: '/vodnoye-shou' },
  { label: 'Корпоративы', href: '/korporativnyy-otdykh' },
  { label: 'Сертификаты', href: '/sertifikat' },
  { label: 'Цены', href: '/akcii-price' },
  { label: 'Контакты', href: '/contakt' },
];

export const footerServices: NavLink[] = [
  { label: 'Прокат снегоходов', href: '/snegokhod' },
  { label: 'Прокат квадроциклов', href: '/kvadrotsikl' },
  { label: 'Гидроциклы и туры', href: '/gidrocikl' },
  { label: 'Флайборд и ховерборд', href: '/flaybord' },
  { label: 'Аквабайк-шоу', href: '/vodnoye-shou' },
  { label: 'Корпоративный отдых', href: '/korporativnyy-otdykh' },
];

export const footerInfo: NavLink[] = [
  { label: 'Цены и акции', href: '/akcii-price' },
  { label: 'Подарочные сертификаты', href: '/sertifikat' },
  { label: 'База отдыха', href: '/klub-ot-vinta-baza-aktivnogo-otdyha-v-kazani' },
  { label: 'Контакты и как добраться', href: '/contakt' },
  { label: 'Политика конфиденциальности', href: '/privacy-policy' },
];
