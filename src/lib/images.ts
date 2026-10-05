import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import { photos, type PhotoKey } from '@/data/photos';

const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/img/*.{jpg,jpeg,png,webp}', { eager: true });

/** Метаданные фото по ключу из src/data/photos.ts */
export const photoSrc = (key: PhotoKey): ImageMetadata => {
  const hit = Object.entries(files).find(([path]) => path.split('/').pop()?.replace(/\.\w+$/, '') === key);
  if (!hit) throw new Error(`Фото «${key}» не найдено в src/assets/img`);
  return hit[1].default;
};

export const photoAlt = (key: PhotoKey): string => photos[key].alt;
export const photoPos = (key: PhotoKey): string => photos[key].pos ?? '50% 50%';

export interface PictureData {
  avif: string;
  webp: string;
  src: string;
  width: number;
  height: number;
}

const cache = new Map<string, Promise<PictureData>>();

/**
 * Адаптивные варианты фото (avif + webp + jpg-фолбэк). Одни и те же URL используются
 * и в <picture>, и в <link rel="preload"> — браузер не скачивает картинку дважды.
 * Astro не увеличивает фото больше оригинала — ширины выше исходной отбрасываются.
 */
export const pictureData = (key: PhotoKey, widths: number[] = [480, 800, 1200, 1600]): Promise<PictureData> => {
  const id = `${key}:${widths.join(',')}`;
  if (!cache.has(id)) {
    cache.set(
      id,
      (async () => {
        const src = photoSrc(key);
        const ws = widths.filter((w) => w < src.width);
        if (ws.length < widths.length || ws.length === 0) ws.push(src.width);
        const [avif, webp, jpg] = await Promise.all([
          getImage({ src, widths: ws, format: 'avif', quality: 58 }),
          getImage({ src, widths: ws, format: 'webp', quality: 72 }),
          getImage({ src, width: Math.min(1200, src.width), format: 'jpg', quality: 78 }),
        ]);
        return {
          avif: avif.srcSet.attribute,
          webp: webp.srcSet.attribute,
          src: jpg.src,
          width: src.width,
          height: src.height,
        };
      })(),
    );
  }
  return cache.get(id)!;
};

/** Одна картинка заданной ширины (для лайтбокса, OG и т. п.) */
export const singleImage = async (key: PhotoKey, width = 1600, format: 'webp' | 'jpg' = 'webp'): Promise<string> => {
  const src = photoSrc(key);
  const img = await getImage({ src, width: Math.min(width, src.width), format, quality: 80 });
  return img.src;
};

/** Ширины для полноэкранных фото первого экрана */
export const HERO_WIDTHS = [640, 960, 1280, 1600, 1920];
