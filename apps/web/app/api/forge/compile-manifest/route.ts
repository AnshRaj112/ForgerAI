import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";

/**
 * POST /api/forge/compile-manifest
 * Takes builder manifest → compiles via Go orchestrator.
 * This is the main endpoint called when user clicks "Compile" in the builder.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentName, nodes, edges } = body;

    // Build compile request from manifest
    const compilePayload = {
      projectId: `agent-${Date.now()}`,
      actorId: "user-1", // TODO: get from auth session
      graph: {
        id: `graph-${Date.now()}`,
        name: agentName || "Unnamed Agent",
        version: "0.1.0",
        nodes: (nodes || []).map((n: { id: string; data: { nodeType?: string; language?: string; config?: string } }) => ({
          id: n.id,
          type: n.data?.nodeType || "transform",
          runtime: n.data?.language || "typescript",
          config: (() => { try { return JSON.parse(n.data?.config || "{}"); } catch { return {}; } })(),
        })),
        edges: (edges || []).map((e: { id: string; source: string; target: string }) => ({
          id: e.id,
          source: e.source,
          target: e.target,
        })),
      },
    };

    const res = await fetch(`${env.FORGE_GO_ORCHESTRATOR_URL}/compile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(compilePayload),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[api/forge/compile-manifest] error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to compile manifest" },
      { status: 502 },
    );
  }
}
