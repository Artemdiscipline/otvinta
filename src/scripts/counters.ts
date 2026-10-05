/** Счётчики «полосы цифр»: досчитывают до значения, когда блок появился на экране. */
export const initCounters = (): void => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = [...document.querySelectorAll<HTMLElement>('[data-count]')];
  if (!els.length || !('IntersectionObserver' in window)) return;
  const run = (el: HTMLElement) => {
    const target = Number(el.dataset.count);
    const start = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        run(e.target as HTMLElement);
      }
    },
    { threshold: 0.6 },
  );
  els.forEach((el) => io.observe(el));
};
