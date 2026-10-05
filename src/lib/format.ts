import type { Price } from '@/data/types';

const NBSP = ' ';

/** 12000 → «12 000 ₽» (неразрывные пробелы) */
export const rub = (n: number): string => `${Math.round(n).toLocaleString('ru-RU').replace(/\s/g, NBSP)}${NBSP}₽`;

/** Число без знака рубля: 12000 → «12 000» */
export const num = (n: number): string => Math.round(n).toLocaleString('ru-RU').replace(/\s/g, NBSP);

export const formatPrice = (p: Price): string => {
  switch (p.kind) {
    case 'fixed':
      return rub(p.value);
    case 'from':
      return `от${NBSP}${rub(p.value)}`;
    case 'approx':
      return `≈${NBSP}${rub(p.value)}`;
    case 'range':
      return `${num(p.min)}–${rub(p.max)}`;
    case 'request':
      return 'по запросу';
  }
};

/** Цена × количество — для калькулятора */
export const multiplyPrice = (p: Price, qty: number): Price => {
  switch (p.kind) {
    case 'range':
      return { kind: 'range', min: p.min * qty, max: p.max * qty };
    case 'request':
      return p;
    default:
      return { ...p, value: p.value * qty };
  }
};

/** Итог калькулятора: «≈ 12 000 ₽», «от 24 000 ₽», «≈ 12 000–14 000 ₽» */
export const formatTotal = (p: Price): string => {
  switch (p.kind) {
    case 'fixed':
    case 'approx':
      return `≈${NBSP}${rub(p.value)}`;
    case 'from':
      return `от${NBSP}${rub(p.value)}`;
    case 'range':
      return `≈${NBSP}${num(p.min)}–${rub(p.max)}`;
    case 'request':
      return 'по запросу';
  }
};

/** Для schema.org: нижняя граница цены */
export const priceLow = (p: Price): number | null =>
  p.kind === 'request' ? null : p.kind === 'range' ? p.min : p.value;

export const telHref = (e164: string): string => `tel:${e164}`;

export const formatDate = (iso: string): string =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

/** Склонение: plural(5, ['снегоход', 'снегохода', 'снегоходов']) */
export const plural = (n: number, forms: [string, string, string]): string => {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
};
