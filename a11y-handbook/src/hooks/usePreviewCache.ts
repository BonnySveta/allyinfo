import { PreviewData } from '../types/preview';

interface CacheItem {
  data: PreviewData;
  timestamp: number;
}

const CACHE_DURATION = 1000 * 60 * 5; // 5 минут

export function usePreviewCache() {
  const cache = new Map<string, CacheItem>();

  const get = (url: string): PreviewData | null => {
    const item = cache.get(url);
    if (!item) return null;

    if (Date.now() - item.timestamp > CACHE_DURATION) {
      cache.delete(url);
      return null;
    }

    return item.data;
  };

  const set = (url: string, data: PreviewData) => {
    cache.set(url, {
      data,
      timestamp: Date.now()
    });
  };

  return { get, set };
} 