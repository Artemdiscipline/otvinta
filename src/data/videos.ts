import type { PhotoKey } from './photos';
import type { ServiceId } from './types';

/** Ролики клуба. iframe загружается только по клику на обложку. */
export interface Video {
  id: string;
  provider: 'youtube' | 'rutube';
  title: string;
  cover: PhotoKey;
  services: ServiceId[];
  /** вертикальное видео */
  vertical?: boolean;
}

export const videos: Video[] = [
  { id: '7mng8Sm_mHQ', provider: 'youtube', title: 'Настоящая стихия', cover: 'video-yt-stihiya', services: ['snegokhod'] },
  {
    id: 'lIYoJkV3Htk',
    provider: 'youtube',
    title: 'Прокат квадроциклов в Казани',
    cover: 'video-yt-kvadro',
    services: ['kvadrotsikl'],
  },
  {
    id: 'O5N3XnYcuHs',
    provider: 'youtube',
    title: 'Прокат гидроциклов в Казани',
    cover: 'video-yt-gidro',
    services: ['gidrocikl', 'flaybord'],
  },
  {
    id: '79b0ac53e39ac26c1ba063856d3bd91e',
    provider: 'rutube',
    title: 'Красная трасса на снегоходах',
    cover: 'video-rt-red-track',
    services: ['snegokhod'],
  },
  {
    id: '4329e6691252b4a40194e753946e615d',
    provider: 'rutube',
    title: 'Вечерняя экскурсия на снегоходах для всей семьи',
    cover: 'video-rt-evening',
    services: ['snegokhod'],
    vertical: true,
  },
];

export const homeVideos = videos.filter((v) => v.provider === 'youtube');

export const embedUrl = (v: Video): string =>
  v.provider === 'youtube'
    ? `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`
    : `https://rutube.ru/play/embed/${v.id}?autoplay=1`;

export const watchUrl = (v: Video): string =>
  v.provider === 'youtube' ? `https://www.youtube.com/watch?v=${v.id}` : `https://rutube.ru/video/${v.id}/`;
