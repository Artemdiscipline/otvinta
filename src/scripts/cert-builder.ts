/**
 * Конструктор сертификата: активность/номинал → оформление → способ получения.
 * Кнопка «Заказать» открывает заявку с готовым описанием сертификата.
 */
import { catalogItem } from '@/data/prices';
import { formatPrice, rub } from '@/lib/format';

export const initCertBuilder = (): void => {
  const form = document.querySelector<HTMLFormElement>('[data-cert-builder]');
  if (!form) return;
  const $ = <T extends HTMLElement>(sel: string) => form.querySelector<T>(sel);
  const activity = $<HTMLSelectElement>('select[name="activity"]')!;
  const amount = $<HTMLInputElement>('input[name="amount"]')!;
  const amountBox = $<HTMLElement>('[data-cert-amount-box]')!;
  const order = $<HTMLAnchorElement>('[data-cert-order]')!;

  const update = () => {
    const isAny = activity.value === 'any';
    amountBox.hidden = !isAny;
    const item = isAny ? undefined : catalogItem(activity.value);
    const sum = Number(amount.value);
    const title = item ? item.label : 'Любая активность';
    const price = item
      ? `${formatPrice(item.price)}${item.unit ? ` ${item.unit}` : ''}`
      : sum > 0
        ? rub(sum)
        : 'номинал на выбор';
    const design = form.querySelector<HTMLInputElement>('input[name="design"]:checked');
    const delivery = form.querySelector<HTMLInputElement>('input[name="delivery"]:checked');

    $<HTMLElement>('[data-cert-title]')!.textContent = title;
    $<HTMLElement>('[data-cert-price]')!.textContent = price;
    $<HTMLElement>('[data-cert-design]')!.textContent = design?.dataset.title ?? '';
    $<HTMLElement>('[data-cert-delivery]')!.textContent = delivery?.dataset.title ?? '';

    order.dataset.program = design ? `cert-${design.value}` : '';
    order.dataset.comment = [
      `Сертификат: ${title}${price ? ` (${price})` : ''}`,
      `Оформление: ${design?.dataset.title ?? '—'}`,
      `Получение: ${delivery?.dataset.title ?? '—'}`,
    ].join('\n');
  };

  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', (e) => e.preventDefault());
  update();
};
