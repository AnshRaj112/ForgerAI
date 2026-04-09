import type { AgentManifest, CompileJob, CompileRequest, DeployRequest, Execution, MarketplaceListing } from "@forgerai/types";

export type ServiceHealth = {
  ok: boolean;
  service: string;
  version?: string;
};

export type CompileResult = {
  ok: true;
  job: CompileJob;
};

export type DeployResult = {
  ok: true;
  job: CompileJob;
};

export type RunAgentRequest = {
  agentId: string;
  version?: string;
  input?: Record<string, unknown>;
};

export type RunAgentResult = {
  ok: true;
  execution: Execution;
};

export type PublishListingRequest = {
  agentId: string;
  title: string;
  summary: string;
  category: string;
  pricingModel?: "free" | "paid" | "subscription";
  priceUsd?: number;
};

export type PublishListingResult = {
  ok: true;
  listing: MarketplaceListing;
};

export type SaveAgentRequest = {
  manifest: AgentManifest;
  name: string;
  description?: string;
};

export type SaveAgentResult = {
  ok: true;
  agentId: string;
};

export type OrchestratorCompileRequest = CompileRequest;
export type OrchestratorDeployRequest = DeployRequest;
