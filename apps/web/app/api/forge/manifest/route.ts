import { NextResponse } from "next/server";
import { AgentManifestSchema } from "@forgerai/types";
import { saveManifest } from "@/app/lib/manifest-store";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = AgentManifestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid manifest payload", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const stored = saveManifest(parsed.data);
  return NextResponse.json(
    { ok: true, manifestId: stored.manifestId, createdAt: stored.createdAt },
    { status: 200 },
  );
}
