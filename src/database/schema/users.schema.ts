import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { organizations } from './organizations.schema.js';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),

    organizationId: integer('organization_id')
      .notNull()
      .references(() => organizations.id),

    name: varchar('name', { length: 100 }).notNull(),

    email: varchar('email', { length: 255 }).notNull().unique(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },

  (table) => [
    index('users_organization_id_idx').on(table.organizationId),
    index('users_created_at_idx').on(table.createdAt),
  ],
);
