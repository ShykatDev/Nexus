import { neon } from '@neondatabase/serverless';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';

@Injectable()
export class DatabaseService {
  private readonly db: NeonHttpDatabase;

  constructor(private readonly configService: ConfigService) {
    const databaseUrl = this.configService.getOrThrow<string>('database.url');
    const sql = neon(process.env.DATABASE_URL!);

    this.db = drizzle(sql);
  }

  get connection() {
    return this.db;
  }
}
