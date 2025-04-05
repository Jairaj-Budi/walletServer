import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as compression from 'compression';

@Injectable()
export class CompressionMiddleware implements NestMiddleware {
  private compress: any;

  constructor() {
    this.compress = compression({
      level: 6, // compression level
      threshold: 100 * 1024, // only compress responses that are larger than 100KB
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.compress(req, res, next);
  }
}
