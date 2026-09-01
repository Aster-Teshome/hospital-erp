import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration. Check .env against .env.example.');
}

export const env = {
  apiBaseUrl: parsed.data.VITE_API_BASE_URL,
};
