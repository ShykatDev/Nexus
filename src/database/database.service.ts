import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

import * as schema from './schema/index.js';

@Injectable()
export class DatabaseService {
  private readonly db;

  constructor(private readonly configService: ConfigService) {
    const databaseUrl = this.configService.getOrThrow<string>('database.url');

    const sql = neon(databaseUrl);

    this.db = drizzle(sql, {
      schema,
    });
  }

  get connection() {
    return this.db;
  }
}
