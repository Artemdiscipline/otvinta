/** Модальные окна на нативном <dialog>: фокус-ловушка и Esc — из коробки. */
const openers = new WeakMap<HTMLDialogElement, Element | null>();

export const openDialog = (d: HTMLDialogElement, opener?: Element | null): void => {
  if (d.open) return;
  openers.set(d, opener ?? document.activeElement);
  d.showModal();
  document.documentElement.classList.add('modal-open');
};

export const closeDialog = (d: HTMLDialogElement): void => {
  if (d.open) d.close();
};

export const initDialogs = (): void => {
  document.querySelectorAll<HTMLDialogElement>('dialog.modal').forEach((d) => {
    d.addEventListener('close', () => {
      if (!document.querySelector('dialog.modal[open]')) document.documentElement.classList.remove('modal-open');
      const opener = openers.get(d);
      if (opener instanceof HTMLElement) opener.focus({ preventScroll: true });
      document.querySelectorAll(`[aria-controls="${d.id}"]`).forEach((b) => b.setAttribute('aria-expanded', 'false'));
    });
    d.addEventListener('click', (e) => {
      const t = e.target as Element;
      if (t === d || t.hasAttribute('data-modal-backdrop') || t.closest('[data-modal-close]')) closeDialog(d);
    });
  });

  const menu = document.getElementById('mobile-menu') as HTMLDialogElement | null;
  document.querySelectorAll<HTMLButtonElement>('[data-menu-open]').forEach((btn) =>
    btn.addEventListener('click', () => {
      if (!menu) return;
      btn.setAttribute('aria-expanded', 'true');
      openDialog(menu, btn);
    }),
  );
  // Переход по пункту меню или нажатие «Забронировать» — закрываем меню.
  menu?.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a')) closeDialog(menu);
  });
};
