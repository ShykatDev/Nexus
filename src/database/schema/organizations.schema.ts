import {
  index,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const organizations = pgTable(
  'organizations',
  {
    id: serial('id').primaryKey(),

    name: varchar('name', { length: 150 }).notNull(),

    slug: varchar('slug', { length: 150 }).notNull().unique(),

    createdAt: timestamp('created_at').defaultNow().notNull(),

    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [index('organizations_created_at_idx').on(table.createdAt)],
);
