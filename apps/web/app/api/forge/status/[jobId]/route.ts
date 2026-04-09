import { NextResponse } from "next/server";
import { getJob } from "../../../../lib/forge-store";

type Params = {
  params: Promise<{ jobId: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  const { jobId } = await params;
  const job = getJob(jobId);
  if (!job) return NextResponse.json({ ok: false, error: "Job not found" }, { status: 404 });
  return NextResponse.json({ ok: true, job }, { status: 200 });
}
