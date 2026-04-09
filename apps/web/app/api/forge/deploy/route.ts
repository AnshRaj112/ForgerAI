import { NextResponse } from "next/server";
import { DeployRequestSchema, DeployResponseSchema } from "@forgerai/types";
import { getJob, updateJob } from "../../../lib/forge-store";
import { dispatchDeploy } from "../../../lib/orchestrator";
import { emitRealtimeEvent } from "../../../lib/realtime";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = DeployRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid deploy payload", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { jobId, environment } = parsed.data;
  const job = getJob(jobId);
  if (!job) return NextResponse.json({ ok: false, error: "Job not found" }, { status: 404 });
  if (job.status !== "compiled") {
    return NextResponse.json(
      { ok: false, error: `Job ${job.jobId} must be in compiled state` },
      { status: 409 },
    );
  }

  const deploying = updateJob(jobId, { status: "deploying" });
  if (!deploying) return NextResponse.json({ ok: false, error: "Job not found" }, { status: 404 });

  await emitRealtimeEvent({
    type: "deploy.started",
    jobId: deploying.jobId,
    projectId: deploying.projectId,
    status: "deploying",
    message: `Deploy started for ${environment}`,
    timestamp: new Date().toISOString(),
    data: { environment },
  });

  try {
    await dispatchDeploy(deploying, environment);
    const deployed = updateJob(jobId, { status: "deployed" });
    if (!deployed) throw new Error("Deploy job not found after deploy");

    await emitRealtimeEvent({
      type: "deploy.completed",
      jobId: deployed.jobId,
      projectId: deployed.projectId,
      status: "deployed",
      message: `Deploy completed for ${environment}`,
      timestamp: new Date().toISOString(),
      data: { environment },
    });

    const response = DeployResponseSchema.parse({ ok: true, job: deployed });
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const failed = updateJob(jobId, {
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown deploy error",
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
    return NextResponse.json({ ok: false, error: "Deploy failed" }, { status: 500 });
  }
}
