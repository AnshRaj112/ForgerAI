"use client";

import type { Node } from "reactflow";
import { LanguageBadge } from "@/components/ui/language-badge";
import { ForgeButton } from "@/components/ui/forge-button";
import { Trash2, Settings, Code } from "lucide-react";
import { useState } from "react";

interface PropertiesPanelProps {
  node: Node;
  onUpdateData: (data: Record<string, unknown>) => void;
  onDelete: () => void;
}

export function PropertiesPanel({ node, onUpdateData, onDelete }: PropertiesPanelProps) {
  const [configText, setConfigText] = useState(node.data?.config || "{}");
  const [configError, setConfigError] = useState<string | null>(null);

  const handleConfigChange = (value: string) => {
    setConfigText(value);
    try {
      JSON.parse(value);
      setConfigError(null);
      onUpdateData({ config: value });
    } catch {
      setConfigError("Invalid JSON");
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Settings size={14} style={{ color: "var(--forge-fg-muted)" }} />
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--forge-fg-subtle)" }}>
            Properties
          </h3>
        </div>
        <ForgeButton variant="danger" size="sm" onClick={onDelete} icon={<Trash2 size={12} />}>
          Delete
        </ForgeButton>
      </div>

      {/* Node meta */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-[10px] font-medium uppercase tracking-wider mb-1.5 block" style={{ color: "var(--forge-fg-subtle)" }}>
            Label
          </label>
          <input
            type="text"
            value={node.data?.label || ""}
            onChange={(e) => onUpdateData({ label: e.target.value })}
            className="w-full h-8 px-3 rounded-lg text-xs outline-none transition-colors"
            style={{
              background: "var(--forge-bg-muted)",
              border: "1px solid var(--forge-border)",
              color: "var(--forge-fg)",
            }}
          />
        </div>

        <div>
          <label className="text-[10px] font-medium uppercase tracking-wider mb-1.5 block" style={{ color: "var(--forge-fg-subtle)" }}>
            Node Type
          </label>
          <div
            className="h-8 px-3 rounded-lg text-xs flex items-center"
            style={{ background: "var(--forge-bg-muted)", border: "1px solid var(--forge-border)", color: "var(--forge-fg-muted)" }}
          >
            {node.data?.nodeType || node.type}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-medium uppercase tracking-wider mb-1.5 block" style={{ color: "var(--forge-fg-subtle)" }}>
            Runtime Language
          </label>
          <div className="flex items-center gap-2">
            <LanguageBadge language={node.data?.language || "typescript"} size="md" />
            <span className="text-[10px]" style={{ color: "var(--forge-fg-subtle)" }}>
              Auto-assigned
            </span>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-medium uppercase tracking-wider mb-1.5 block" style={{ color: "var(--forge-fg-subtle)" }}>
            Node ID
          </label>
          <div
            className="h-8 px-3 rounded-lg text-[10px] flex items-center font-mono"
            style={{ background: "var(--forge-bg-muted)", border: "1px solid var(--forge-border)", color: "var(--forge-fg-subtle)" }}
          >
            {node.id}
          </div>
        </div>
      </div>

      {/* JSON Config Editor */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <Code size={12} style={{ color: "var(--forge-fg-subtle)" }} />
          <label className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--forge-fg-subtle)" }}>
            Configuration (JSON)
          </label>
        </div>
        <textarea
          value={configText}
          onChange={(e) => handleConfigChange(e.target.value)}
          rows={8}
          spellCheck={false}
          className="w-full px-3 py-2 rounded-lg text-xs font-mono outline-none resize-y transition-colors"
          style={{
            background: "var(--forge-bg-muted)",
            border: `1px solid ${configError ? "var(--forge-error)" : "var(--forge-border)"}`,
            color: "var(--forge-fg)",
            minHeight: "100px",
          }}
        />
        {configError && (
          <p className="text-[10px] mt-1" style={{ color: "var(--forge-error)" }}>
            {configError}
          </p>
        )}
      </div>
    </div>
  );
}
