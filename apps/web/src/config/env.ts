import { z } from 'zod';

const EnvSchema = z.object({
  VITE_API_URL: z.string().url().default('http://localhost:5000'),
  VITE_WS_URL: z.string().url().default('ws://localhost:5000'),
  VITE_ENVIRONMENT: z.enum(['development', 'staging', 'production']).default('development'),
});

export const env = EnvSchema.parse(import.meta.env);
