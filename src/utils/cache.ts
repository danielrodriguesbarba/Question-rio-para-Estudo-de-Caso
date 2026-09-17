/**
 * Unified Cache Utility to reduce network requests, Google API calls, and repetitive calculations
 */

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttlMs: number;
}

class AppCache {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private pendingPromises: Map<string, Promise<any>> = new Map();

  /**
   * Get an item from memory cache or optionally fallback to localStorage
   */
  get<T>(key: string, useStorageFallback = false): T | null {
    const entry = this.memoryCache.get(key);
    const now = Date.now();

    if (entry) {
      if (entry.ttlMs > 0 && now - entry.timestamp > entry.ttlMs) {
        this.memoryCache.delete(key);
      } else {
        return entry.value as T;
      }
    }

    if (useStorageFallback) {
      try {
        const stored = localStorage.getItem(`app_cache_${key}`);
        if (stored) {
          const parsed: CacheEntry<T> = JSON.parse(stored);
          if (parsed.ttlMs > 0 && now - parsed.timestamp > parsed.ttlMs) {
            localStorage.removeItem(`app_cache_${key}`);
          } else {
            // Restore to memory
            this.memoryCache.set(key, parsed);
            return parsed.value;
          }
        }
      } catch (e) {
        console.warn('Erro ao ler cache persistente:', e);
      }
    }

    return null;
  }

  /**
   * Set an item in cache with a TTL (Time To Live) in milliseconds.
   * Default ttlMs: 30 minutes (1800000 ms). Set 0 for no expiration.
   */
  set<T>(key: string, value: T, ttlMs: number = 30 * 60 * 1000, persistInStorage = false): void {
    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttlMs
    };
    this.memoryCache.set(key, entry);

    if (persistInStorage) {
      try {
        localStorage.setItem(`app_cache_${key}`, JSON.stringify(entry));
      } catch (e) {
        console.warn('Erro ao salvar no cache persistente:', e);
      }
    }
  }

  /**
   * Remove an item from cache
   */
  remove(key: string): void {
    this.memoryCache.delete(key);
    try {
      localStorage.removeItem(`app_cache_${key}`);
    } catch (e) {
      // ignore
    }
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.memoryCache.clear();
  }

  /**
   * Deduplicate concurrent async calls: if a promise for `key` is already running,
   * reuse it instead of initiating multiple parallel network calls.
   */
  async deduplicate<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const existingPromise = this.pendingPromises.get(key);
    if (existingPromise) {
      return existingPromise as Promise<T>;
    }

    const promise = (async () => {
      try {
        return await fetcher();
      } finally {
        this.pendingPromises.delete(key);
      }
    })();

    this.pendingPromises.set(key, promise);
    return promise;
  }

  /**
   * Get cached value or fetch fresh if missing/expired, automatically deduplicating in-flight calls
   */
  async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs: number = 30 * 60 * 1000,
    persistInStorage = false
  ): Promise<T> {
    const cached = this.get<T>(key, persistInStorage);
    if (cached !== null && cached !== undefined) {
      return cached;
    }

    return this.deduplicate(key, async () => {
      // Double check if cache was filled while waiting
      const current = this.get<T>(key, persistInStorage);
      if (current !== null && current !== undefined) {
        return current;
      }
      const fresh = await fetcher();
      this.set(key, fresh, ttlMs, persistInStorage);
      return fresh;
    });
  }
}

export const appCache = new AppCache();
