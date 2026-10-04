import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service.js';
import { users } from '../database/schema/index.js';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async create(name: string, email: string) {
    const [user] = await this.db.connection
      .insert(users)
      .values({
        name,
        email,
      })
      .returning();

    return user;
  }

  async findAll() {
    return this.db.connection.select().from(users);
  }

  async findOne(id: number) {
    const [user] = await this.db.connection
      .select()
      .from(users)
      .where(eq(users.id, id));

    return user;
  }

  async update(id: number, name: string, email: string) {
    const [user] = await this.db.connection
      .update(users)
      .set({
        name,
        email,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    return user;
  }

  async remove(id: number) {
    const [user] = await this.db.connection
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    return user;
  }
}
