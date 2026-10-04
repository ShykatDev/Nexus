import { Injectable } from '@nestjs/common';
import { and, asc, count, desc, eq, ilike, or } from 'drizzle-orm';

import { organizations, users } from '../database/schema/index.js';
import { DatabaseService } from '../database/database.service.js';

export interface FindUsersOptions {
  organizationId: number;
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
    const { page, limit, search, sortBy, sortOrder, organizationId } = options;

    const offset = (page - 1) * limit;

    const conditions = search
      ? and(
          eq(users.organizationId, organizationId),
          or(
            ilike(users.name, `%${search}%`),
            ilike(users.email, `%${search}%`),
          ),
        )
      : eq(users.organizationId, organizationId);

    const sortColumn = {
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    }[sortBy];

    const orderBy = sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn);

    const [data, countResult] = await Promise.all([
      this.database.connection
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,

          organization: {
            id: organizations.id,
            name: organizations.name,
            slug: organizations.slug,
            createdAt: organizations.createdAt,
            updatedAt: organizations.updatedAt,
          },
        })
        .from(users)
        .innerJoin(organizations, eq(users.organizationId, organizations.id))
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

  async findById(organizationId: number, id: number) {
    const [user] = await this.database.connection
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,

        organization: {
          id: organizations.id,
          name: organizations.name,
          slug: organizations.slug,
          createdAt: organizations.createdAt,
          updatedAt: organizations.updatedAt,
        },
      })
      .from(users)
      .innerJoin(organizations, eq(users.organizationId, organizations.id))
      .where(and(eq(users.id, id), eq(users.organizationId, organizationId)));

    return user;
  }

  async findByEmail(organizationId: number, email: string) {
    const [user] = await this.database.connection
      .select()
      .from(users)
      .where(
        and(eq(users.organizationId, organizationId), eq(users.email, email)),
      );

    return user;
  }

  async update(
    organizationId: number,
    id: number,
    data: Partial<typeof users.$inferInsert>,
  ) {
    const [user] = await this.database.connection
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(users.id, id), eq(users.organizationId, organizationId)))
      .returning();

    return user;
  }

  async delete(organizationId: number, id: number) {
    const [user] = await this.database.connection
      .delete(users)
      .where(and(eq(users.id, id), eq(users.organizationId, organizationId)))
      .returning();

    return user;
  }
}
