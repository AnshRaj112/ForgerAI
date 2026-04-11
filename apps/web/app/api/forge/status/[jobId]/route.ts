import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";

/**
 * GET /api/forge/status/[jobId]
 * Polls job status from the Go orchestrator.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  try {
    const { jobId } = await params;

    const res = await fetch(`${env.FORGE_GO_ORCHESTRATOR_URL}/status/${jobId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[api/forge/status] error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to reach orchestrator" },
      { status: 502 },
    );
  }
}
