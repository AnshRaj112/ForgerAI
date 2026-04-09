import { z } from "zod";

export const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  FORGE_API_URL: z.string().url().default("http://localhost:3000"),
  FORGE_REALTIME_URL: z.string().url().default("http://localhost:4010"),
  FORGE_REALTIME_EVENT_URL: z.string().url().default("http://localhost:4010/events"),
  FORGE_DATABASE_URL: z.string().min(1).default("mongodb://localhost:27017/forgeai"),
  FORGE_REDIS_URL: z.string().url().default("redis://localhost:6379"),
  FORGE_NATS_URL: z.string().url().default("nats://localhost:4222"),
});

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_REALTIME_URL: z.string().url().default("http://localhost:4010"),
});

export const parseServerEnv = (env: NodeJS.ProcessEnv = process.env) => serverEnvSchema.parse(env);

export const parseClientEnv = (env: NodeJS.ProcessEnv = process.env) => clientEnvSchema.parse(env);

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;
