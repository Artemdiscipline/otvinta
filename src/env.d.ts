/// <reference types="astro/client" />

/** true, если сборка запущена с NOINDEX=1 (демо-версия — закрыта от индексации). */
declare const __NOINDEX__: boolean;

interface Window {
  ym?: (id: number, action: string, ...args: unknown[]) => void;
  otvGoal?: (name: string, params?: Record<string, unknown>) => void;
}
