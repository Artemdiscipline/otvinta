/**
 * Переключатель сезона на главной: фон и подзаголовок меняет CSS по html[data-season],
 * здесь — кнопки, порядок карточек услуг и событие для блока «Выбери трассу».
 */
import { seasons } from '@/data/offers';
import type { SeasonId } from '@/data/types';

const isSeason = (v: string | undefined): v is SeasonId => seasons.some((s) => s.id === v);

const reorderCards = (season: SeasonId) => {
  const order = seasons.find((s) => s.id === season)?.order ?? [];
  document.querySelectorAll<HTMLElement>('[data-season-cards]').forEach((list) => {
    const cards = [...list.querySelectorAll<HTMLElement>(':scope > [data-service-card]')];
    cards
      .sort((a, b) => order.indexOf(a.dataset.serviceCard as never) - order.indexOf(b.dataset.serviceCard as never))
      .forEach((c) => list.append(c));
  });
};

export const applySeason = (season: SeasonId): void => {
  document.documentElement.dataset.season = season;
  document.querySelectorAll<HTMLButtonElement>('[data-season-btn]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.seasonBtn === season));
  });
  reorderCards(season);
  document.dispatchEvent(new CustomEvent('season:change', { detail: season }));
};

export const initSeason = (): void => {
  const current = document.documentElement.dataset.season;
  applySeason(isSeason(current) ? current : 'summer');
  document.querySelectorAll<HTMLButtonElement>('[data-season-btn]').forEach((b) =>
    b.addEventListener('click', () => {
      if (isSeason(b.dataset.seasonBtn)) applySeason(b.dataset.seasonBtn);
    }),
  );
};
