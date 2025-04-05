import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class TransactionCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Get cached transaction count
   */
  async getCachedCount(walletId: string): Promise<number | null> {
    const key = `transaction_count:${walletId}`;
    const result = await this.cacheManager.get<number>(key);
    return result === undefined ? null : result;
  }

  /**
   * Set cached transaction count
   */
  async setCachedCount(walletId: string, count: number): Promise<void> {
    const key = `transaction_count:${walletId}`;
    await this.cacheManager.set(key, Number(count), 300); // ensure a primitive is stored
  }

  /**
   * Clear cached data for wallet
   */
  async clearWalletCache(walletId: string): Promise<void> {
    const pattern = `transaction_*:${walletId}`;
    await this.cacheManager.del(pattern);
  }
}
