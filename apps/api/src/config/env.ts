import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const EnvSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().optional(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  TAX_RATE_FOOD: z.string().transform(Number).default('0.05'),
  TAX_RATE_BEVERAGE: z.string().transform(Number).default('0.18'),
  TAX_RATE_ALCOHOL: z.string().transform(Number).default('0.25'),
});

export const env = EnvSchema.parse(process.env);