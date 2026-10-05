/**
 * Сборка SVG логотипа «От винта» (по оригинальному логотипу клуба).
 * Один источник для шапки, футера, фавиконок и OG-картинки (scripts/make-assets.mjs).
 */
import {
  BLADE_ANGLES,
  LOGO_BOTTOM_COMPACT,
  LOGO_BOTTOM_FULL,
  LOGO_LETTERS,
  LOGO_SLOGAN,
  LOGO_TOP,
  LOGO_WIDTH,
  PROP,
  blade,
} from './logo.ts';

export type LogoVariant = 'full' | 'compact';

const OUTLINE = '#04152E';
const PROP_OUTLINE = '#071A35';

/** Пропеллер: три овальные лопасти + втулка из колец (как в оригинале) */
export const propellerMarkup = (opts: { cx?: number; cy?: number; scale?: number; spin?: boolean } = {}): string => {
  const p = { ...PROP, ...(opts.cx !== undefined ? { cx: opts.cx } : {}), ...(opts.cy !== undefined ? { cy: opts.cy } : {}) };
  const blades = BLADE_ANGLES.map((a) => {
    const b = blade(a, p);
    return `<ellipse cx="${b.cx.toFixed(2)}" cy="${b.cy.toFixed(2)}" rx="${b.rx}" ry="${b.ry}" transform="${b.rotate}"/>`;
  }).join('');
  const style = opts.spin ? ` class="spin-on-hover" style="transform-box:view-box;transform-origin:${p.cx}px ${p.cy}px"` : '';
  return `<g${style}><g fill="#FFFFFF" stroke="${PROP_OUTLINE}" stroke-width="1.9">${blades}<circle cx="${p.cx}" cy="${p.cy}" r="${p.hubR}"/><circle cx="${p.cx}" cy="${p.cy}" r="${p.hubR2}" stroke-width="1.7"/></g></g>`;
};

export interface LogoOptions {
  variant?: LogoVariant;
  /** уникальный префикс id (если логотипов на странице несколько) */
  uid?: string;
  className?: string;
  /** подпись для скринридеров; без неё логотип декоративный */
  title?: string;
  spin?: boolean;
  width?: number;
}

export const logoViewBox = (variant: LogoVariant = 'compact'): [number, number, number, number] => {
  const pad = 7;
  const bottom = variant === 'full' ? LOGO_BOTTOM_FULL : LOGO_BOTTOM_COMPACT;
  return [-pad, LOGO_TOP - pad, LOGO_WIDTH + pad * 2, bottom - LOGO_TOP + pad * 2];
};

export const logoSvg = ({ variant = 'compact', uid = 'logo', className, title, spin = true, width }: LogoOptions = {}): string => {
  const [x, y, w, h] = logoViewBox(variant);
  const g = `${uid}-g`;
  const fl = `${uid}-f`;
  const fp = `${uid}-p`;
  const a11y = title ? `role="img" aria-label="${title}"` : 'aria-hidden="true" focusable="false"';
  const size = width ? ` width="${width}" height="${((width * h) / w).toFixed(1)}"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y.toFixed(2)} ${w} ${h.toFixed(2)}"${size}${className ? ` class="${className}"` : ''} ${a11y}>${title ? `<title>${title}</title>` : ''}
<defs>
<linearGradient id="${g}" x1="0" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#14A6F0"/><stop offset=".55" stop-color="#16BDF6"/><stop offset="1" stop-color="#46DDFF"/></linearGradient>
<filter id="${fl}" x="-4%" y="-40%" width="108%" height="180%" color-interpolation-filters="sRGB">
<feMorphology in="SourceAlpha" operator="dilate" radius="1.5" result="d"/>
<feFlood flood-color="${OUTLINE}"/><feComposite in2="d" operator="in" result="o"/>
<feGaussianBlur in="d" stdDeviation="4.5" result="b"/>
<feFlood flood-color="#1E90FF" flood-opacity=".9"/><feComposite in2="b" operator="in" result="glow"/>
<feMerge><feMergeNode in="glow"/><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
<filter id="${fp}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
<feGaussianBlur in="SourceAlpha" stdDeviation="3" result="b"/>
<feFlood flood-color="#4FB3FF" flood-opacity=".75"/><feComposite in2="b" operator="in" result="glow"/>
<feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
</defs>
<path filter="url(#${fl})" fill="url(#${g})" d="${LOGO_LETTERS.join('')}"/>
<g filter="url(#${fp})">${propellerMarkup({ spin })}</g>
${variant === 'full' ? `<path fill="#FFFFFF" d="${LOGO_SLOGAN}"/>` : ''}
</svg>`;
};

/** Квадратная иконка: пропеллер на тёмном фоне (фавиконки, PWA) */
export const markSvg = ({ size = 512, background = '#05070D' as string | null, rounded = 0.22, scale = 1 } = {}): string => {
  const R = PROP.reach + 4;
  const s = (32 / R) * scale;
  const prop = propellerMarkup({ cx: 0, cy: 0 });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
<defs><radialGradient id="mg" cx="32" cy="32" r="32" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1E90FF" stop-opacity=".55"/><stop offset="1" stop-color="#1E90FF" stop-opacity="0"/></radialGradient></defs>
${background ? `<rect width="64" height="64" rx="${64 * rounded}" fill="${background}"/><circle cx="32" cy="32" r="30" fill="url(#mg)"/>` : ''}
<g transform="translate(32 ${(32 + 6.5 * s).toFixed(2)}) scale(${s.toFixed(4)})">${prop}</g>
</svg>`;
};
