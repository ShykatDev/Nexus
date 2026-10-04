import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { organizations } from '../database/schema/index.js';
import { eq } from 'drizzle-orm';

@Injectable()
export class OrganizationsRepository {
  constructor(private readonly database: DatabaseService) {}

  async create(data: typeof organizations.$inferInsert) {
    const [organization] = await this.database.connection
      .insert(organizations)
      .values(data)
      .returning();

    return organization;
  }

  async findById(id: number) {
    const [org] = await this.database.connection
      .select()
      .from(organizations)
      .where(eq(organizations.id, id));

    return org;
  }

  async findBySlug(slug: string) {
    const [org] = await this.database.connection
      .select()
      .from(organizations)
      .where(eq(organizations.slug, slug));

    return org;
  }
}
