/**
 * Фирменный знак — трёхлопастной пропеллер. Один источник геометрии для логотипа,
 * фавиконок и OG-картинки (scripts/make-assets.mjs импортирует этот файл).
 * Центр — (0, 0), радиус лопасти ≈ 27.
 */
export const BLADE =
  'M1.5 -5.5C8 -7 14.5 -12 15.5 -19.5C16.5 -26 10.5 -30 4.5 -29C-1 -28 -3.5 -22.5 -3.5 -16.5C-3.5 -11.5 -2.5 -8 -1.5 -5.5Z';

export const BLADE_ANGLES = [0, 120, 240];

/** Самостоятельный SVG пропеллера (строка) — для фавиконок и OG. */
export const propellerSvg = ({
  size = 512,
  background = '#05070D',
  rounded = 0.22,
  scale = 1,
  glow = true,
}: {
  size?: number;
  background?: string | null;
  rounded?: number;
  scale?: number;
  glow?: boolean;
} = {}): string => {
  const s = (64 / 32) * scale;
  const blades = BLADE_ANGLES.map((a) => `<path d="${BLADE}" transform="rotate(${a})" fill="url(#pb)"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
<defs>
<linearGradient id="pb" x1="0" y1="-28" x2="0" y2="0" gradientUnits="userSpaceOnUse">
<stop offset="0" stop-color="#EAF2FF"/><stop offset=".35" stop-color="#4FB3FF"/><stop offset="1" stop-color="#0A4DFF"/>
</linearGradient>
<radialGradient id="pg" cx="32" cy="32" r="32" gradientUnits="userSpaceOnUse">
<stop offset="0" stop-color="#1E90FF" stop-opacity=".55"/><stop offset="1" stop-color="#1E90FF" stop-opacity="0"/>
</radialGradient>
<filter id="pf" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
${background ? `<rect width="64" height="64" rx="${64 * rounded}" fill="${background}"/>` : ''}
${glow ? '<circle cx="32" cy="32" r="30" fill="url(#pg)"/>' : ''}
<g transform="translate(32 32) scale(${s / 2})" ${glow ? 'filter="url(#pf)"' : ''}>
${blades}
<circle r="6.2" fill="#EAF2FF"/><circle r="2.6" fill="#0A4DFF"/>
</g>
</svg>`;
};
