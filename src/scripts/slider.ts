/** Слайдер на нативной прокрутке: кнопки листают на ширину карточки. */
export const initSlider = (): void => {
  document.querySelectorAll<HTMLElement>('[data-slider]').forEach((track) => {
    const section = track.closest('section');
    const buttons = [...(section?.querySelectorAll<HTMLButtonElement>('[data-slide]') ?? [])];
    const step = () => (track.firstElementChild as HTMLElement | null)?.offsetWidth ?? track.clientWidth;
    const sync = () => {
      const max = track.scrollWidth - track.clientWidth - 4;
      buttons.forEach((b) => {
        b.disabled = b.dataset.slide === '-1' ? track.scrollLeft <= 4 : track.scrollLeft >= max;
      });
      const nav = section?.querySelector<HTMLElement>('[data-slider-nav]');
      if (nav) nav.hidden = track.scrollWidth <= track.clientWidth + 4;
    };
    buttons.forEach((b) =>
      b.addEventListener('click', () =>
        track.scrollBy({
          left: Number(b.dataset.slide) * (step() + 16),
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        }),
      ),
    );
    track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    window.addEventListener('resize', sync);
    sync();
  });
};
