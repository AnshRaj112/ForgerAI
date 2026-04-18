"use client";

import { ForgeButton } from "@/components/ui/forge-button";
import { Save, Play, Rocket, PanelLeft, Boxes, Link2 } from "lucide-react";
import type { Node, Edge } from "reactflow";
import { useState } from "react";
import styles from "./toolbar.module.css";

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
  const [deploying, setDeploying] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    // In a real app, this would persist nodes/edges to a DB
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
  };

  const handleCompile = async () => {
    setCompiling(true);
    try {
      const res = await fetch("/api/forge/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: agentName.toLowerCase().replace(/\s+/g, "-"),
          actorId: "system-auto",
        }),
      });
      const data = await res.json();
      if (data.ok && data.job?.jobId) {
        setJobId(data.job.jobId);
        console.log("Compilation started. Job ID:", data.job.jobId);
      }
    } catch (error) {
      console.error("Compilation failed:", error);
    } finally {
      setCompiling(false);
    }
  };

  const handleDeploy = async () => {
    if (!jobId) {
      alert("Please compile the agent first!");
      return;
    }
    setDeploying(true);
    try {
      const res = await fetch("/api/forge/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: jobId,
          environment: "production",
        }),
      });
      const data = await res.json();
      if (data.ok) {
        console.log("Deployment successful:", data.job?.deploymentId);
        alert("Agent deployed successfully!");
      }
    } catch (error) {
      console.error("Deployment failed:", error);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className={styles.toolbar}>
      {/* Left */}
      <div className={styles.leftGroup}>
        <button
          onClick={onTogglePalette}
          className={`${styles.toggleButton} ${paletteOpen ? styles.toggleButtonActive : ""}`}
          title="Toggle node palette"
        >
          <PanelLeft size(16) />
        </button>

        <div className={styles.divider} />

        <input
          type="text"
          value={agentName}
          onChange={(e) => onAgentNameChange(e.target.value)}
          className={styles.agentNameInput}
        />
      </div>

      {/* Center info */}
      <div className={styles.centerInfo}>
        <span className={styles.infoBadge}>
          <Boxes size={12} />
          {nodeCount} nodes
        </span>
        <span className={styles.infoBadge}>
          <Link2 size={12} />
          {edgeCount} edges
        </span>
      </div>

      {/* Right actions */}
      <div className={styles.rightGroup}>
        <ForgeButton variant="ghost" size="sm" onClick={handleSave} loading={saving} icon={<Save size={14} />}>
          Save
        </ForgeButton>
        <ForgeButton
          variant="secondary"
          size="sm"
          onClick={handleCompile}
          loading={compiling}
          icon={<Play size={14} />}
        >
          {jobId ? "Re-compile" : "Compile"}
        </ForgeButton>
        <ForgeButton
          variant="primary"
          size="sm"
          onClick={handleDeploy}
          loading={deploying}
          disabled={!jobId}
          icon={<Rocket size={14} />}
        >
          Deploy
        </ForgeButton>
      </div>
    </div>
  );
}
