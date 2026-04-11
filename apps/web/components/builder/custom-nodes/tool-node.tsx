"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { LanguageBadge } from "@/components/ui/language-badge";
import { Wrench } from "lucide-react";

function ToolNodeComponent({ data, selected }: NodeProps) {
  return (
    <div
      className="rounded-xl px-4 py-3 min-w-[180px] transition-all duration-200"
      style={{
        background: "var(--forge-bg-elevated)",
        border: `1.5px solid ${selected ? "var(--lang-rust)" : "var(--forge-border)"}`,
        boxShadow: selected ? "0 0 20px rgba(249,115,22,0.2)" : "0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: "var(--lang-rust)", border: "2px solid var(--forge-bg)", width: 10, height: 10 }} />
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(249,115,22,0.12)", color: "var(--lang-rust)" }}>
          <Wrench size={14} />
        </div>
        <p className="text-xs font-semibold" style={{ color: "var(--forge-fg)" }}>{data.label}</p>
        <LanguageBadge language="rust" size="sm" />
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: "var(--lang-rust)", border: "2px solid var(--forge-bg)", width: 10, height: 10 }} />
    </div>
  );
}
export const ToolNode = memo(ToolNodeComponent);
