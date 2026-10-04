import { Injectable } from '@nestjs/common';
import { asc, count, desc, eq, ilike, or } from 'drizzle-orm';

import { users } from '../database/schema/index.js';
import { DatabaseService } from '../database/database.service.js';

export interface FindUsersOptions {
  page: number;
  limit: number;
  search?: string;
  sortBy: 'name' | 'email' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

@Injectable()
export class UsersRepository {
  constructor(private readonly database: DatabaseService) {}

  async create(data: typeof users.$inferInsert) {
    const [user] = await this.database.connection
      .insert(users)
      .values(data)
      .returning();

    return user;
  }

  async findAll(options: FindUsersOptions) {
    const { page, limit, search, sortBy, sortOrder } = options;

    const offset = (page - 1) * limit;

    const conditions = search
      ? or(ilike(users.name, `%${search}%`), ilike(users.email, `%${search}%`))
      : undefined;

    const sortColumn = {
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    }[sortBy];

    const orderBy = sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn);

    const [data, countResult] = await Promise.all([
      this.database.connection
        .select()
        .from(users)
        .where(conditions)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset),

      this.database.connection
        .select({
          count: count(),
        })
        .from(users)
        .where(conditions),
    ]);

    return {
      data,
      total: Number(countResult[0].count),
    };
  }

  async findById(id: number) {
    const [user] = await this.database.connection
      .select()
      .from(users)
      .where(eq(users.id, id));

    return user;
  }

  async findByEmail(email: string) {
    const [user] = await this.database.connection
      .select()
      .from(users)
      .where(eq(users.email, email));

    return user;
  }

  async update(id: number, data: Partial<typeof users.$inferInsert>) {
    const [user] = await this.database.connection
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    return user;
  }

  async delete(id: number) {
    const [user] = await this.database.connection
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    return user;
  }
}
