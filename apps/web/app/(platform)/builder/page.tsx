"use client";

import { AgentCanvas } from "@/components/builder/agent-canvas";

export default function BuilderPage() {
  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <AgentCanvas />
    </div>
  );
}
