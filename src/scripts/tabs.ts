/**
 * Доступные табы (WAI-ARIA): [data-tabs] → [data-tablist] → [role=tab] + панели по aria-controls.
 * Стрелки ←/→, Home/End. Поддерживает вложенные табы.
 */
const tabsOf = (root: Element) =>
  [...root.querySelectorAll<HTMLElement>('[data-tablist] [role="tab"]')].filter(
    (t) => t.closest('[data-tabs]') === root,
  );

export const selectTab = (tab: HTMLElement, focus = false): void => {
  const root = tab.closest('[data-tabs]');
  if (!root) return;
  for (const t of tabsOf(root)) {
    const on = t === tab;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    const panel = document.getElementById(t.getAttribute('aria-controls') ?? '');
    if (panel) {
      panel.hidden = !on;
      panel.toggleAttribute('data-active', on);
    }
  }
  if (focus) tab.focus();
  root.dispatchEvent(new CustomEvent('tabs:change', { detail: tab.dataset.tabKey, bubbles: true }));
};

export const initTabs = (scope: ParentNode = document): void => {
  scope.querySelectorAll<HTMLElement>('[data-tabs]').forEach((root) => {
    if (root.dataset.tabsReady) return;
    root.dataset.tabsReady = '1';
    const tabs = tabsOf(root);
    const active = tabs.find((t) => t.getAttribute('aria-selected') === 'true') ?? tabs[0];
    if (active) selectTab(active);
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => selectTab(t));
      t.addEventListener('keydown', (e) => {
        const enabled = tabs.filter((x) => !x.hidden);
        const idx = enabled.indexOf(t);
        let next: HTMLElement | undefined;
        if (e.key === 'ArrowRight') next = enabled[(idx + 1) % enabled.length];
        if (e.key === 'ArrowLeft') next = enabled[(idx - 1 + enabled.length) % enabled.length];
        if (e.key === 'Home') next = enabled[0];
        if (e.key === 'End') next = enabled[enabled.length - 1];
        if (next) {
          e.preventDefault();
          selectTab(next, true);
        }
        void i;
      });
    });
  });
};

/** Выбрать таб по ключу внутри корня */
export const selectTabByKey = (root: Element, key: string): void => {
  const t = tabsOf(root).find((x) => x.dataset.tabKey === key);
  if (t) selectTab(t);
};
