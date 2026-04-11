"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { LanguageBadge } from "@/components/ui/language-badge";
import { Brain } from "lucide-react";

function LlmNodeComponent({ data, selected }: NodeProps) {
  const config = (() => {
    try { return JSON.parse(data.config || "{}"); } catch { return {}; }
  })();

  return (
    <div
      className="rounded-xl px-4 py-3 min-w-[180px] transition-all duration-200"
      style={{
        background: "var(--forge-bg-elevated)",
        border: `1.5px solid ${selected ? "var(--lang-python)" : "var(--forge-border)"}`,
        boxShadow: selected
          ? "0 0 20px rgba(59,130,246,0.2)"
          : "0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: "var(--lang-python)", border: "2px solid var(--forge-bg)", width: 10, height: 10 }} />

      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(59,130,246,0.12)", color: "var(--lang-python)" }}
        >
          <Brain size={14} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold truncate" style={{ color: "var(--forge-fg)" }}>{data.label}</p>
        </div>
        <LanguageBadge language="python" size="sm" />
      </div>

      {config.model && (
        <p className="text-[10px] px-2 py-0.5 rounded" style={{ background: "var(--forge-bg-muted)", color: "var(--forge-fg-muted)" }}>
          {config.model}
        </p>
      )}

      <Handle type="source" position={Position.Bottom} style={{ background: "var(--lang-python)", border: "2px solid var(--forge-bg)", width: 10, height: 10 }} />
    </div>
  );
}

export const LlmNode = memo(LlmNodeComponent);
