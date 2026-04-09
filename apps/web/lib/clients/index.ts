import { env } from "../env";
import { createGoOrchestratorClient } from "./go-orchestrator.client";
import { createJavaEnterpriseClient } from "./java-enterprise.client";
import { createNodeRealtimeClient } from "./node-realtime.client";
import { createPhpCmsClient } from "./php-cms.client";
import { createPythonAiClient } from "./python-ai.client";
import { createRubyWorkflowClient } from "./ruby-workflow.client";
import { createRustExecutorClient } from "./rust-executor.client";

export const clients = {
  goOrchestrator: createGoOrchestratorClient(env.FORGE_GO_ORCHESTRATOR_URL),
  pythonAi: createPythonAiClient(env.FORGE_PYTHON_AI_URL),
  rustExecutor: createRustExecutorClient(env.FORGE_RUST_EXECUTOR_URL),
  javaEnterprise: createJavaEnterpriseClient(env.FORGE_JAVA_ENTERPRISE_URL),
  rubyWorkflow: createRubyWorkflowClient(env.FORGE_RUBY_WORKFLOW_URL),
  phpCms: createPhpCmsClient(env.FORGE_PHP_CMS_URL),
  nodeRealtime: createNodeRealtimeClient(env.NEXT_PUBLIC_REALTIME_URL),
};

export * from "./http";
export * from "./types";
export * from "./go-orchestrator.client";
export * from "./python-ai.client";
export * from "./rust-executor.client";
export * from "./java-enterprise.client";
export * from "./ruby-workflow.client";
export * from "./php-cms.client";
export * from "./node-realtime.client";
