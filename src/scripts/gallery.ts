/** Лайтбокс галереи: клик по фото, ←/→ для листания, Esc — закрыть. */
import { openDialog } from './modal';

export const initGallery = (): void => {
  const dlg = document.querySelector<HTMLDialogElement>('dialog[data-lightbox]');
  const img = dlg?.querySelector<HTMLImageElement>('[data-lightbox-img]');
  const cap = dlg?.querySelector<HTMLElement>('[data-lightbox-cap]');
  if (!dlg || !img || !cap) return;
  const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-gallery] button[data-full]')];
  let idx = 0;
  const show = (i: number) => {
    idx = (i + buttons.length) % buttons.length;
    const b = buttons[idx]!;
    img.src = b.dataset.full ?? '';
    img.alt = b.dataset.alt ?? '';
    cap.textContent = `${b.dataset.alt ?? ''} · ${idx + 1} / ${buttons.length}`;
  };
  buttons.forEach((b, i) =>
    b.addEventListener('click', () => {
      show(i);
      openDialog(dlg, b);
    }),
  );
  dlg.querySelectorAll<HTMLButtonElement>('[data-lightbox-step]').forEach((b) =>
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      show(idx + Number(b.dataset.lightboxStep));
    }),
  );
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(idx + 1);
    if (e.key === 'ArrowLeft') show(idx - 1);
  });
};
