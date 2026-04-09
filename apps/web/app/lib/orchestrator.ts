import type { AgentGraph, CompileJob } from "@forgerai/types";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const dispatchCompile = async (job: CompileJob, graph: AgentGraph): Promise<{
  artifactUri: string;
}> => {
  // Placeholder for Temporal/gRPC dispatch once go-orchestrator is live.
  await sleep(75);
  return {
    artifactUri: `forge://artifacts/${job.projectId}/${job.jobId}/${graph.version}`,
  };
};

export const dispatchDeploy = async (job: CompileJob, environment: string): Promise<void> => {
  // Placeholder for deploy workflow dispatch.
  await sleep(75);
  void environment;
  void job;
};
