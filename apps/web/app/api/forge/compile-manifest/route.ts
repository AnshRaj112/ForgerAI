import { NextResponse } from "next/server";
import { z } from "zod";
import type { AgentNodeType, LanguageRuntime } from "@forgerai/types";
import { getManifest } from "@/app/lib/manifest-store";
import { emitRealtimeEvent } from "@/app/lib/realtime";
import { clients } from "@/lib/clients";

const CompileManifestRequestSchema = z.object({
  manifestId: z.string().min(1),
  projectId: z.string().min(1).default("project-forgeai-demo"),
  actorId: z.string().min(1).default("user-1"),
});

const asAgentNodeType = (value: string): AgentNodeType => {
  const allowed: AgentNodeType[] = ["trigger", "llm", "rag", "tool", "transform", "condition", "output"];
  return allowed.includes(value as AgentNodeType) ? (value as AgentNodeType) : "tool";
};

const runtimeToCompileRuntime = (runtime: string): LanguageRuntime => {
  if (runtime === "typescript") return "node";
  const allowed: LanguageRuntime[] = ["python", "rust", "go", "java", "ruby", "php", "node", "typescript"];
  return allowed.includes(runtime as LanguageRuntime) ? (runtime as LanguageRuntime) : "node";
};

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = CompileManifestRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid compile-manifest payload", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { manifestId, projectId, actorId } = parsed.data;
  const stored = getManifest(manifestId);
  if (!stored) return NextResponse.json({ ok: false, error: "Manifest not found" }, { status: 404 });

  const compileJobId = `compile-${manifestId}`;
  await emitRealtimeEvent({
    type: "compile.started",
    jobId: compileJobId,
    projectId,
    status: "compiling",
    message: "Compile started: sending manifest to Go Orchestrator",
    timestamp: new Date().toISOString(),
    data: { manifestId },
  });

  const compilePayload = {
    projectId,
    actorId,
    graph: {
      id: stored.manifest.id,
      name: stored.manifest.name,
      version: "0.1.0",
      nodes: stored.manifest.nodes.map((node) => ({
        id: node.id,
        type: asAgentNodeType(node.data.nodeType),
        runtime: runtimeToCompileRuntime(node.data.language),
        config: JSON.parse(node.data.config || "{}"),
      })),
      edges: stored.manifest.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      })),
    },
  };

  try {
    const result = await clients.goOrchestrator.compile(compilePayload);
    const jobId = result?.job?.jobId ?? compileJobId;
    await emitRealtimeEvent({
      type: "compile.completed",
      jobId,
      projectId,
      status: "compiled",
      message: "Compile completed by Go Orchestrator",
      timestamp: new Date().toISOString(),
      data: { manifestId },
    });
    return NextResponse.json({ ok: true, jobId, orchestrator: result }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Compile failed";
    await emitRealtimeEvent({
      type: "job.failed",
      jobId: compileJobId,
      projectId,
      status: "failed",
      message,
      timestamp: new Date().toISOString(),
      data: { manifestId },
    });
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
