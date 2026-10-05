/** Калькулятор: техника → трасса/программа → количество → «≈ X ₽». Цены — из src/data/prices.ts. */
import { catalog } from '@/data/prices';
import { formatPrice, formatTotal, multiplyPrice } from '@/lib/format';

export const initCalc = (): void => {
  const form = document.querySelector<HTMLFormElement>('[data-calc]');
  if (!form) return;
  const service = form.querySelector<HTMLSelectElement>('select[name="service"]')!;
  const item = form.querySelector<HTMLSelectElement>('select[name="item"]')!;
  const qty = form.querySelector<HTMLInputElement>('input[name="qty"]')!;
  const total = form.querySelector<HTMLElement>('[data-calc-total]')!;
  const detail = form.querySelector<HTMLElement>('[data-calc-detail]')!;
  const unit = form.querySelector<HTMLElement>('[data-calc-unit]')!;
  const book = form.querySelector<HTMLAnchorElement>('[data-calc-book]')!;

  const fillItems = () => {
    const s = catalog.find((c) => c.id === service.value) ?? catalog[0]!;
    item.replaceChildren();
    for (const g of s.groups) {
      const og = document.createElement('optgroup');
      og.label = g.label;
      for (const i of g.items) og.append(new Option(`${i.label} · ${formatPrice(i.price)}${i.unit ? ` ${i.unit}` : ''}`, i.id));
      if (s.groups.length > 1) item.append(og);
      else item.append(...og.childNodes);
    }
    unit.textContent = `(${s.unitLabel})`;
    // по умолчанию — самая популярная Красная трасса, если она есть
    const red = [...item.options].find((o) => o.value.includes('-red'));
    if (red) item.value = red.value;
  };

  const calc = () => {
    const s = catalog.find((c) => c.id === service.value) ?? catalog[0]!;
    const it = s.groups.flatMap((g) => g.items).find((i) => i.id === item.value);
    const n = Math.min(50, Math.max(1, Math.round(Number(qty.value) || 1)));
    if (!it) return;
    const sum = multiplyPrice(it.price, n);
    total.textContent = formatTotal(sum);
    detail.textContent = `${formatPrice(it.price)}${it.unit ? ` ${it.unit}` : ''} × ${n} (${s.unitLabel})${it.clarify ? ' · уточняйте у администратора' : ''}`;
    book.dataset.service = s.id;
    book.dataset.program = it.id;
    book.dataset.comment = `Расчёт на сайте: ${it.label} × ${n} (${s.unitLabel}) = ${formatTotal(sum)}`;
  };

  service.addEventListener('change', () => {
    fillItems();
    calc();
  });
  item.addEventListener('change', calc);
  qty.addEventListener('input', calc);
  qty.addEventListener('blur', () => {
    qty.value = String(Math.min(50, Math.max(1, Math.round(Number(qty.value) || 1))));
    calc();
  });
  form.querySelectorAll<HTMLButtonElement>('[data-calc-step]').forEach((b) =>
    b.addEventListener('click', () => {
      qty.value = String(Math.min(50, Math.max(1, (Number(qty.value) || 1) + Number(b.dataset.calcStep))));
      calc();
    }),
  );
  form.addEventListener('submit', (e) => e.preventDefault());
  fillItems();
  calc();
};
