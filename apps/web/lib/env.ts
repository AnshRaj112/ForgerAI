import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_REALTIME_URL: z.string().url().default("http://localhost:4010"),
  FORGE_REALTIME_EVENT_URL: z.string().url().default("http://localhost:4010/events"),
  FORGE_GO_ORCHESTRATOR_URL: z.string().url().default("http://localhost:4001"),
  FORGE_PYTHON_AI_URL: z.string().url().default("http://localhost:4002"),
  FORGE_RUST_EXECUTOR_URL: z.string().url().default("http://localhost:4003"),
  FORGE_JAVA_ENTERPRISE_URL: z.string().url().default("http://localhost:4004"),
  /** Optional Bearer token for java-enterprise JWT (POST /api/auth/login). */
  FORGE_JAVA_ENTERPRISE_TOKEN: z.string().optional(),
  FORGE_RUBY_WORKFLOW_URL: z.string().url().default("http://localhost:4005"),
  FORGE_PHP_CMS_URL: z.string().url().default("http://localhost:4006"),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_REALTIME_URL: process.env.NEXT_PUBLIC_REALTIME_URL,
  FORGE_REALTIME_EVENT_URL: process.env.FORGE_REALTIME_EVENT_URL,
  FORGE_GO_ORCHESTRATOR_URL: process.env.FORGE_GO_ORCHESTRATOR_URL,
  FORGE_PYTHON_AI_URL: process.env.FORGE_PYTHON_AI_URL,
  FORGE_RUST_EXECUTOR_URL: process.env.FORGE_RUST_EXECUTOR_URL,
  FORGE_JAVA_ENTERPRISE_URL: process.env.FORGE_JAVA_ENTERPRISE_URL,
  FORGE_JAVA_ENTERPRISE_TOKEN: process.env.FORGE_JAVA_ENTERPRISE_TOKEN,
  FORGE_RUBY_WORKFLOW_URL: process.env.FORGE_RUBY_WORKFLOW_URL,
  FORGE_PHP_CMS_URL: process.env.FORGE_PHP_CMS_URL,
});
