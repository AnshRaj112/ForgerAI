import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";

/**
 * POST /api/forge/compile
 * Proxies compile requests to the Go orchestrator service.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetch(`${env.FORGE_GO_ORCHESTRATOR_URL}/compile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[api/forge/compile] error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to reach orchestrator" },
      { status: 502 },
    );
  }
}
