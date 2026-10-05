/**
 * Цели Яндекс.Метрики. ID счётчика задаётся в src/data/site.ts (metrikaId).
 * TODO: ID счётчика — пока он не задан, цели только пишутся в консоль в режиме разработки.
 * Цели: phone_click, whatsapp_click, telegram_click, max_click, lead_submit.
 */
const counterId = Number(document.documentElement.dataset.metrika) || null;

export const goal = (name: string, params?: Record<string, unknown>): void => {
  if (counterId && typeof window.ym === 'function') window.ym(counterId, 'reachGoal', name, params);
  else if (import.meta.env.DEV) console.debug('[Метрика: цель]', name, params ?? '');
};

export const initGoals = (): void => {
  window.otvGoal = goal;
  document.addEventListener(
    'click',
    (e) => {
      const a = (e.target as Element | null)?.closest?.('a');
      if (!a) return;
      const h = a.getAttribute('href') ?? '';
      if (h.startsWith('tel:')) goal('phone_click', { phone: h.slice(4) });
      else if (h.includes('wa.me/')) goal('whatsapp_click');
      else if (h.includes('t.me/')) goal('telegram_click');
      else if (h.includes('max.ru/')) goal('max_click');
    },
    { capture: true },
  );
};
