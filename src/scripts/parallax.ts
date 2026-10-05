/** Лёгкий параллакс фона первого экрана. Отключается при prefers-reduced-motion. */
export const initParallax = (): void => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layers = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
  if (!layers.length) return;
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    for (const el of layers) {
      const h = el.offsetHeight;
      if (y < h * 1.2) el.style.transform = `translate3d(0, ${Math.round(y * -0.12)}px, 0)`;
    }
    ticking = false;
  };
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
