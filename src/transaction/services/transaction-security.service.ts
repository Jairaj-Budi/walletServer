import { Injectable, Logger } from '@nestjs/common';
import * as rateLimiterFlexible from 'rate-limiter-flexible';
import { createHash } from 'crypto';

@Injectable()
export class TransactionSecurityService {
  private readonly logger = new Logger(TransactionSecurityService.name);
  // private readonly rateLimiter: rateLimiterFlexible.RateLimiterMemory;

  constructor() {
    // this.rateLimiter = new rateLimiterFlexible.RateLimiterMemory({
    //   points: 10,        // 10 requests
    //   duration: 60,      // per 60 seconds
    //   blockDuration: 60, // block for 60 seconds if limit exceeded
    // });
  }

  /**
   * Rate limit check for exports
   */
  // async checkRateLimit(walletId: string): Promise<boolean> {
  //   try {
  //     await this.rateLimiter.consume(walletId);
  //     return true;
  //   } catch (error) {
  //     this.logger.warn(`Rate limit exceeded for wallet: ${walletId}`);
  //     return false;
  //   }
  // }

  /**
   * Generate secure filename for export
   */
  generateSecureFilename(walletId: string): string {
    const hash = createHash('sha256')
      .update(walletId + Date.now().toString())
      .digest('hex')
      .substring(0, 8);
    return `transactions-${hash}.csv`;
  }

  /**
   * Validate transaction data
   */
  validateTransactionData(data: any): boolean {
    return !!(
      data &&
      typeof data.amount === 'number' &&
      typeof data.description === 'string' &&
      data.description.length <= 1000
    );
  }
}
