import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";

/**
 * POST /api/forge/run-agent
 * Proxies agent execution requests to the Python AI service.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetch(`${env.FORGE_PYTHON_AI_URL}/agents/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[api/forge/run-agent] error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to reach Python AI service" },
      { status: 502 },
    );
  }
}
