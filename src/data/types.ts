/**
 * Общие типы данных сайта. Сами данные — в соседних файлах src/data/*.ts.
 */

/** Цена. Всегда задаётся только в src/data — в разметке цифр нет. */
export type Price =
  | { kind: 'fixed'; value: number }
  | { kind: 'from'; value: number }
  | { kind: 'approx'; value: number }
  | { kind: 'range'; min: number; max: number }
  | { kind: 'request' };

export const fixed = (value: number): Price => ({ kind: 'fixed', value });
export const from = (value: number): Price => ({ kind: 'from', value });
export const approx = (value: number): Price => ({ kind: 'approx', value });
export const range = (min: number, max: number): Price => ({ kind: 'range', min, max });
export const onRequest = (): Price => ({ kind: 'request' });

/** Цвета трасс — собственная навигационная система клуба. */
export type TrackId = 'white' | 'green' | 'red' | 'black' | 'individual';

export type ServiceId =
  | 'snegokhod'
  | 'kvadrotsikl'
  | 'gidrocikl'
  | 'flaybord'
  | 'vodnoye-shou'
  | 'korporativnyy-otdykh'
  | 'sertifikat'
  | 'baza';

export type SeasonId = 'winter' | 'summer' | 'offseason';

export type LocationId = 'mirny' | 'santa';

/** Имена иконок (lucide + бренды) — см. src/components/ui/Icon.astro */
export type IconName =
  | 'snowflake'
  | 'sun'
  | 'leaf'
  | 'mountain'
  | 'mountain-snow'
  | 'waves'
  | 'wind'
  | 'sparkles'
  | 'users'
  | 'gift'
  | 'tent'
  | 'trophy'
  | 'shirt'
  | 'lightbulb'
  | 'camera'
  | 'drone'
  | 'flame'
  | 'baby'
  | 'badge-check'
  | 'map-pin'
  | 'clock'
  | 'timer'
  | 'phone'
  | 'calendar'
  | 'star'
  | 'percent'
  | 'bath'
  | 'plane'
  | 'ship'
  | 'route'
  | 'gauge'
  | 'shield-check'
  | 'life-buoy'
  | 'truck'
  | 'package'
  | 'smartphone'
  | 'stamp'
  | 'magnet'
  | 'trees'
  | 'house'
  | 'utensils'
  | 'crosshair'
  | 'target'
  | 'goal'
  | 'party-popper'
  | 'clipboard-list'
  | 'video'
  | 'navigation'
  | 'car'
  | 'info'
  | 'zap'
  | 'droplets'
  | 'heart-handshake'
  | 'medal'
  | 'fuel'
  | 'compass'
  | 'thermometer-snowflake'
  | 'bike'
  | 'arrow-right'
  | 'arrow-up-right'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'play'
  | 'x'
  | 'menu'
  | 'check'
  | 'quote'
  | 'calculator'
  | 'copy'
  | 'circle-check-big'
  | 'external-link'
  | 'send'
  | 'ticket'
  | 'whatsapp'
  | 'telegram'
  | 'vk'
  | 'max'
  | 'instagram';

export interface Fact {
  icon: IconName;
  title: string;
  text?: string;
}
