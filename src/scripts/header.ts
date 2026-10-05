/** Шапка: прозрачная над первым экраном → тёмная при прокрутке. */
export const initHeader = (): void => {
  const header = document.getElementById('site-header');
  if (!header) return;
  let ticking = false;
  const update = () => {
    header.dataset.scrolled = String(window.scrollY > 24);
    ticking = false;
  };
  update();
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
};
