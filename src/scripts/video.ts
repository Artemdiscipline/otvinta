/** Видео грузятся только по клику: до этого — лёгкая обложка, никаких iframe. */
export const initVideos = (): void => {
  document.querySelectorAll<HTMLElement>('.lite-video').forEach((box) => {
    const btn = box.querySelector('button');
    btn?.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = box.dataset.embed ?? '';
      iframe.title = box.dataset.title ?? 'Видео';
      iframe.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.className = 'absolute inset-0 h-full w-full border-0';
      box.replaceChildren(iframe);
      iframe.focus();
    });
  });
};
