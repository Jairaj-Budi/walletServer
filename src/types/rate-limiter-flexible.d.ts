declare module 'rate-limiter-flexible' {
  export interface IRateLimiterMemoryOptions {
    points: number;
    duration: number;
    blockDuration?: number;
  }

  class RateLimiterMemory {
    constructor(options: IRateLimiterMemoryOptions);
    consume(key: string): Promise<void>;
    // add additional methods if needed
  }

  export = RateLimiterMemory;
} 