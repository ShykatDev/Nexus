import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service.js';
import { users } from '../database/schema/index.js';

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

  async findAll() {
    return this.database.connection.select().from(users);
  }

  async findById(id: number) {
    const [user] = await this.database.connection
      .select()
      .from(users)
      .where(eq(users.id, id));

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

  async findByEmail(email: string) {
    const [user] = await this.database.connection
      .select()
      .from(users)
      .where(eq(users.email, email));

    return user;
  }
}
