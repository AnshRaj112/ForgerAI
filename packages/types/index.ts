import { z } from "zod";

export const LanguageRuntimeSchema = z.enum([
  "python",
  "rust",
  "go",
  "java",
  "ruby",
  "php",
  "node",
  "typescript",
]);

export const AgentNodeTypeSchema = z.enum([
  "trigger",
  "llm",
  "rag",
  "tool",
  "transform",
  "condition",
  "output",
]);

export const AgentNodeSchema = z.object({
  id: z.string().min(1),
  type: AgentNodeTypeSchema,
  runtime: LanguageRuntimeSchema,
  config: z.record(z.string(), z.unknown()).default({}),
});

export const AgentEdgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  condition: z.string().optional(),
});

export const AgentGraphSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  version: z.string().default("0.1.0"),
  nodes: z.array(AgentNodeSchema).min(1),
  edges: z.array(AgentEdgeSchema).default([]),
});

export const CompileRequestSchema = z.object({
  projectId: z.string().min(1),
  actorId: z.string().min(1),
  graph: AgentGraphSchema,
});

export const CompileStatusSchema = z.enum([
  "queued",
  "compiling",
  "compiled",
  "deploying",
  "deployed",
  "failed",
]);

export const CompileJobSchema = z.object({
  jobId: z.string().min(1),
  projectId: z.string().min(1),
  actorId: z.string().min(1),
  status: CompileStatusSchema,
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  serviceTargets: z.array(LanguageRuntimeSchema),
  artifactUri: z.string().optional(),
  error: z.string().optional(),
});

export const CompileResponseSchema = z.object({
  ok: z.literal(true),
  job: CompileJobSchema,
});

export const DeployRequestSchema = z.object({
  jobId: z.string().min(1),
  environment: z.enum(["dev", "staging", "prod"]).default("dev"),
});

export const DeployResponseSchema = z.object({
  ok: z.literal(true),
  job: CompileJobSchema,
});

export const RuntimeEventSchema = z.object({
  type: z.enum(["compile.started", "compile.completed", "deploy.started", "deploy.completed", "job.failed"]),
  jobId: z.string().min(1),
  projectId: z.string().min(1),
  status: CompileStatusSchema,
  message: z.string().min(1),
  timestamp: z.string().min(1),
  data: z.record(z.string(), z.unknown()).optional(),
});

// Builder domain types
export const NodeDataSchema = z.object({
  label: z.string().min(1),
  nodeType: z.string().min(1),
  language: LanguageRuntimeSchema,
  config: z.string().default("{}"),
});

export const NodeTypeSchema = z.object({
  id: z.string().min(1),
  type: z.string().optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: NodeDataSchema,
});

export const EdgeTypeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
});

export const AgentVersionSchema = z.object({
  version: z.string().min(1),
  createdAt: z.string().min(1),
});

export const AgentManifestSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  versions: z.array(AgentVersionSchema).default([]),
  nodes: z.array(NodeTypeSchema),
  edges: z.array(EdgeTypeSchema),
});

// Core platform models
export const AgentSchema = z.object({
  id: z.string().min(1),
  ownerId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  manifest: AgentManifestSchema,
  tags: z.array(z.string()).default([]),
  visibility: z.enum(["private", "public", "unlisted"]).default("private"),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const ExecutionStatusSchema = z.enum([
  "pending",
  "running",
  "succeeded",
  "failed",
  "cancelled",
]);

export const ExecutionLogSchema = z.object({
  timestamp: z.string().min(1),
  level: z.enum(["debug", "info", "warn", "error"]).default("info"),
  message: z.string().min(1),
});

export const ExecutionSchema = z.object({
  id: z.string().min(1),
  agentId: z.string().min(1),
  agentVersion: z.string().min(1),
  status: ExecutionStatusSchema,
  startedAt: z.string().optional(),
  endedAt: z.string().optional(),
  runtime: LanguageRuntimeSchema,
  environment: z.enum(["dev", "staging", "prod"]).default("dev"),
  logs: z.array(ExecutionLogSchema).default([]),
  error: z.string().optional(),
});

export const MarketplaceListingSchema = z.object({
  id: z.string().min(1),
  agentId: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  category: z.string().min(1),
  pricingModel: z.enum(["free", "paid", "subscription"]).default("free"),
  priceUsd: z.number().nonnegative().optional(),
  rating: z.number().min(0).max(5).default(0),
  installs: z.number().int().nonnegative().default(0),
  publishedAt: z.string().optional(),
  updatedAt: z.string().min(1),
});

export type LanguageRuntime = z.infer<typeof LanguageRuntimeSchema>;
export type AgentNodeType = z.infer<typeof AgentNodeTypeSchema>;
export type AgentNode = z.infer<typeof AgentNodeSchema>;
export type AgentEdge = z.infer<typeof AgentEdgeSchema>;
export type AgentGraph = z.infer<typeof AgentGraphSchema>;
export type CompileRequest = z.infer<typeof CompileRequestSchema>;
export type CompileStatus = z.infer<typeof CompileStatusSchema>;
export type CompileJob = z.infer<typeof CompileJobSchema>;
export type CompileResponse = z.infer<typeof CompileResponseSchema>;
export type DeployRequest = z.infer<typeof DeployRequestSchema>;
export type DeployResponse = z.infer<typeof DeployResponseSchema>;
export type RuntimeEvent = z.infer<typeof RuntimeEventSchema>;
export type NodeData = z.infer<typeof NodeDataSchema>;
export type NodeType = z.infer<typeof NodeTypeSchema>;
export type EdgeType = z.infer<typeof EdgeTypeSchema>;
export type AgentVersion = z.infer<typeof AgentVersionSchema>;
export type AgentManifest = z.infer<typeof AgentManifestSchema>;
export type Agent = z.infer<typeof AgentSchema>;
export type ExecutionStatus = z.infer<typeof ExecutionStatusSchema>;
export type ExecutionLog = z.infer<typeof ExecutionLogSchema>;
export type Execution = z.infer<typeof ExecutionSchema>;
export type MarketplaceListing = z.infer<typeof MarketplaceListingSchema>;
