import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | null> {
    const result = await this.cacheManager.get<T>(key);
    return result === undefined ? null : result;
  }

  async set(key: string, value: any, ttl: number = 60): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async clearPattern(pattern: string): Promise<void> {
    const store: any = this.cacheManager.stores;
    if (typeof store.keys === 'function') {
      const keys = await store.keys(pattern);
      if (keys && Array.isArray(keys)) {
        await Promise.all(keys.map((key) => this.cacheManager.del(key)));
      } else if (keys) {
        await this.cacheManager.del(keys);
      }
    }
  }

  createKey(...parts: string[]): string {
    return parts.join(':');
  }
}
