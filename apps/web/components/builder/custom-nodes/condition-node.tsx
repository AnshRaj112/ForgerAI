"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { LanguageBadge } from "@/components/ui/language-badge";
import { GitBranch } from "lucide-react";

function ConditionNodeComponent({ data, selected }: NodeProps) {
  return (
    <div
      className="rounded-xl px-4 py-3 min-w-[180px] transition-all duration-200"
      style={{
        background: "var(--forge-bg-elevated)",
        border: `1.5px solid ${selected ? "var(--lang-go)" : "var(--forge-border)"}`,
        boxShadow: selected ? "0 0 20px rgba(6,182,212,0.2)" : "0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: "var(--lang-go)", border: "2px solid var(--forge-bg)", width: 10, height: 10 }} />
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(6,182,212,0.12)", color: "var(--lang-go)" }}>
          <GitBranch size={14} />
        </div>
        <p className="text-xs font-semibold" style={{ color: "var(--forge-fg)" }}>{data.label}</p>
        <LanguageBadge language="go" size="sm" />
      </div>
      {/* Multiple outputs for branching */}
      <Handle type="source" position={Position.Bottom} id="true" style={{ background: "var(--forge-success)", border: "2px solid var(--forge-bg)", width: 10, height: 10, left: "30%" }} />
      <Handle type="source" position={Position.Bottom} id="false" style={{ background: "var(--forge-error)", border: "2px solid var(--forge-bg)", width: 10, height: 10, left: "70%" }} />
    </div>
  );
}
export const ConditionNode = memo(ConditionNodeComponent);
