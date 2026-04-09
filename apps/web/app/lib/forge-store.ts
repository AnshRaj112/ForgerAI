import { randomUUID } from "node:crypto";
import type { CompileJob, CompileStatus, LanguageRuntime } from "@forgerai/types";

const jobs = new Map<string, CompileJob>();

const nowIso = () => new Date().toISOString();

export const createJob = (input: {
  projectId: string;
  actorId: string;
  serviceTargets: LanguageRuntime[];
}): CompileJob => {
  const createdAt = nowIso();
  const job: CompileJob = {
    jobId: randomUUID(),
    projectId: input.projectId,
    actorId: input.actorId,
    status: "queued",
    createdAt,
    updatedAt: createdAt,
    serviceTargets: input.serviceTargets,
  };
  jobs.set(job.jobId, job);
  return job;
};

export const getJob = (jobId: string): CompileJob | undefined => jobs.get(jobId);

export const updateJob = (
  jobId: string,
  patch: Partial<Omit<CompileJob, "jobId" | "createdAt">> & { status?: CompileStatus },
): CompileJob | undefined => {
  const existing = jobs.get(jobId);
  if (!existing) return undefined;

  const updated: CompileJob = {
    ...existing,
    ...patch,
    updatedAt: nowIso(),
  };
  jobs.set(jobId, updated);
  return updated;
};
