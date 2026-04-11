import { NextResponse, type NextRequest } from "next/server";

/**
 * GET /api/forge/manifest - List saved manifests
 * POST /api/forge/manifest - Save a new manifest
 * 
 * Currently stores in-memory for development.
 * TODO: use MongoDB via Go orchestrator or direct connection.
 */

// Ephemeral store for dev
const manifests: Map<string, unknown> = new Map();

export async function GET() {
  const list = Array.from(manifests.entries()).map(([id, data]) => ({
    id,
    ...(data as Record<string, unknown>),
  }));
  return NextResponse.json({ ok: true, manifests: list });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = `manifest-${Date.now()}`;
    manifests.set(id, {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (error) {
    console.error("[api/forge/manifest] error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to save manifest" },
      { status: 400 },
    );
  }
}
