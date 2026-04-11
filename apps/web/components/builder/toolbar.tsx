"use client";

import { ForgeButton } from "@/components/ui/forge-button";
import { Save, Play, Rocket, PanelLeft, Boxes, Link2 } from "lucide-react";
import type { Node, Edge } from "reactflow";
import { useState } from "react";

interface BuilderToolbarProps {
  agentName: string;
  onAgentNameChange: (name: string) => void;
  nodeCount: number;
  edgeCount: number;
  paletteOpen: boolean;
  onTogglePalette: () => void;
  nodes: Node[];
  edges: Edge[];
}

export function BuilderToolbar({
  agentName,
  onAgentNameChange,
  nodeCount,
  edgeCount,
  paletteOpen,
  onTogglePalette,
  nodes,
  edges,
}: BuilderToolbarProps) {
  const [saving, setSaving] = useState(false);
  const [compiling, setCompiling] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // TODO: POST to /api/forge/manifest
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
  };

  const handleCompile = async () => {
    setCompiling(true);
    // TODO: POST to /api/forge/compile-manifest
    await new Promise((r) => setTimeout(r, 1500));
    setCompiling(false);
  };

  return (
    <div
      className="h-14 px-4 flex items-center justify-between shrink-0 border-b"
      style={{
        background: "var(--forge-bg-subtle)",
        borderColor: "var(--forge-border)",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onTogglePalette}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
          style={{
            background: paletteOpen ? "var(--forge-accent-muted)" : "transparent",
            color: paletteOpen ? "var(--forge-accent)" : "var(--forge-fg-muted)",
            border: "1px solid var(--forge-border)",
          }}
          title="Toggle node palette"
        >
          <PanelLeft size={16} />
        </button>

        <div className="h-6 w-px" style={{ background: "var(--forge-border)" }} />

        <input
          type="text"
          value={agentName}
          onChange={(e) => onAgentNameChange(e.target.value)}
          className="bg-transparent text-sm font-semibold outline-none w-48"
          style={{ color: "var(--forge-fg)" }}
        />
      </div>

      {/* Center info */}
      <div className="hidden md:flex items-center gap-4 text-xs" style={{ color: "var(--forge-fg-subtle)" }}>
        <span className="flex items-center gap-1.5">
          <Boxes size={12} />
          {nodeCount} nodes
        </span>
        <span className="flex items-center gap-1.5">
          <Link2 size={12} />
          {edgeCount} edges
        </span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <ForgeButton variant="ghost" size="sm" onClick={handleSave} loading={saving} icon={<Save size={14} />}>
          Save
        </ForgeButton>
        <ForgeButton variant="secondary" size="sm" onClick={handleCompile} loading={compiling} icon={<Play size={14} />}>
          Compile
        </ForgeButton>
        <ForgeButton variant="glow" size="sm" icon={<Rocket size={14} />}>
          Deploy
        </ForgeButton>
      </div>
    </div>
  );
}
