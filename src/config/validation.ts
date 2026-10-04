import { z } from 'zod';

export const configValidationSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'prod']).default('dev'),
  PORT: z.coerce.number().default(8000),
  APP_NAME: z.string().default('nexus-api'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
});
