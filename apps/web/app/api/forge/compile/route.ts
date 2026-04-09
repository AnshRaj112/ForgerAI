import { NextResponse } from "next/server";
import {
  CompileRequestSchema,
  CompileResponseSchema,
  type LanguageRuntime,
} from "@forgerai/types";
import { createJob, updateJob } from "../../../lib/forge-store";
import { emitRealtimeEvent } from "../../../lib/realtime";
import { dispatchCompile } from "../../../lib/orchestrator";

const uniqueServiceTargets = (targets: LanguageRuntime[]) => [...new Set(targets)];

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = CompileRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid compile payload", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const {
    projectId,
    actorId,
    graph: { nodes, ...graph },
  } = parsed.data;
  const serviceTargets = uniqueServiceTargets(nodes.map((node) => node.runtime));
  const created = createJob({ projectId, actorId, serviceTargets });

  await emitRealtimeEvent({
    type: "compile.started",
    jobId: created.jobId,
    projectId: created.projectId,
    status: "compiling",
    message: "Compile workflow started",
    timestamp: new Date().toISOString(),
    data: { serviceTargets },
  });

  updateJob(created.jobId, { status: "compiling" });

  try {
    const { artifactUri } = await dispatchCompile(created, { ...graph, nodes });
    const compiled = updateJob(created.jobId, { status: "compiled", artifactUri });
    if (!compiled) throw new Error("Compile job not found after compile");

    await emitRealtimeEvent({
      type: "compile.completed",
      jobId: compiled.jobId,
      projectId: compiled.projectId,
      status: "compiled",
      message: "Compile workflow completed",
      timestamp: new Date().toISOString(),
      data: { artifactUri },
    });

    const response = CompileResponseSchema.parse({ ok: true, job: compiled });
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const failed = updateJob(created.jobId, {
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown compile error",
    });

    if (failed) {
      await emitRealtimeEvent({
        type: "job.failed",
        jobId: failed.jobId,
        projectId: failed.projectId,
        status: "failed",
        message: failed.error ?? "Job failed",
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({ ok: false, error: "Compile failed" }, { status: 500 });
  }
}
