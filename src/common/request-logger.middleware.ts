import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  private getMethodColor(method: string): string {
    const colors: Record<string, string> = {
      GET: '\x1b[32m',
      POST: '\x1b[33m',
      PUT: '\x1b[34m',
      PATCH: '\x1b[35m',
      DELETE: '\x1b[31m',
    };

    return colors[method] ?? '\x1b[37m';
  }

  private getStatusColor(statusCode: number): string {
    if (statusCode >= 500) return '\x1b[31m';
    if (statusCode >= 400) return '\x1b[33m';
    if (statusCode >= 300) return '\x1b[36m';

    return '\x1b[32m';
  }

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;

      const method = req.method;
      const url = req.originalUrl;
      const statusCode = res.statusCode;

      const methodColor = this.getMethodColor(method);
      const statusColor = this.getStatusColor(statusCode);

      this.logger.log(
        `${methodColor}${method}\x1b[0m ${url} ${statusColor}${statusCode}\x1b[0m - ${duration}ms`,
      );
    });

    next();
  }
}
