import { formatPrice } from '@/lib/format';
import { base, certificate, corporate, show } from './offers';
import { catalog } from './prices';
import type { ServiceId } from './types';

/**
 * Услуги и программы для формы «Заявка на заезд».
 * Строится из прайса автоматически — при смене цены в prices.ts форма обновится сама.
 */
export interface BookingOption {
  id: string;
  label: string;
  group?: string;
}

export interface BookingService {
  id: ServiceId;
  label: string;
  /** Подпись второго поля: «Трасса», «Программа / тур»… */
  programLabel: string;
  options: BookingOption[];
}

const programLabels: Partial<Record<ServiceId, string>> = {
  snegokhod: 'Трасса',
  kvadrotsikl: 'Маршрут и техника',
  gidrocikl: 'Формат, программа или тур',
  flaybord: 'Тариф',
};

export const bookingServices: BookingService[] = [
  ...catalog.map((c) => ({
    id: c.id,
    label: c.label,
    programLabel: programLabels[c.id] ?? 'Программа',
    options: c.groups.flatMap((g) =>
      g.items.map((i) => ({
        id: i.id,
        label: `${i.label} · ${formatPrice(i.price)}${i.unit ? ` ${i.unit}` : ''}`,
        group: c.groups.length > 1 ? g.label : undefined,
      })),
    ),
  })),
  {
    id: 'vodnoye-shou',
    label: 'Аквабайк-шоу',
    programLabel: 'Площадка',
    options: show.venueOptions.map((v, i) => ({ id: `show-${i}`, label: v })),
  },
  {
    id: 'korporativnyy-otdykh',
    label: 'Корпоратив',
    programLabel: 'Сезон',
    options: corporate.seasons.map((s) => ({ id: `corp-${s.id}`, label: s.title })),
  },
  {
    id: 'sertifikat',
    label: 'Подарочный сертификат',
    programLabel: 'Оформление',
    options: certificate.designs.map((d) => ({ id: `cert-${d.id}`, label: d.title })),
  },
  {
    id: 'baza',
    label: 'База отдыха',
    programLabel: 'Что интересует',
    options: [...base.land, ...base.water, ...base.moto].map((f, i) => ({ id: `base-${i}`, label: f.title })),
  },
];

export const bookingService = (id: string | undefined): BookingService | undefined =>
  bookingServices.find((s) => s.id === id);

/** Найти услугу по id программы (например, «snow-red» → снегоходы) */
export const serviceByProgram = (programId: string): BookingService | undefined =>
  bookingServices.find((s) => s.options.some((o) => o.id === programId));
