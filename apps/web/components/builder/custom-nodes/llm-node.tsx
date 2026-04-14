"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { LanguageBadge } from "../../ui/language-badge";
import { Brain } from "lucide-react";
import styles from "./custom-node.module.css";

function LlmNodeComponent({ data, selected }: NodeProps) {
  const config = (() => {
    try { return JSON.parse(data.config || "{}"); } catch { return {}; }
  })();

  const langColor = "#3b82f6"; // Python/Blue

  return (
    <div
      className={`${styles.nodeWrapper} ${selected ? styles.nodeWrapperSelected : ""}`}
      style={{
        borderColor: selected ? langColor : "var(--color-border)",
      }}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ background: langColor, border: "2px solid var(--color-bg)", width: 10, height: 10 }} 
      />

      <div className={styles.header}>
        <div
          className={styles.iconContainer}
          style={{ background: "rgba(59,130,246,0.12)", color: langColor }}
        >
          <Brain size={14} />
        </div>
        <div className={styles.titleContainer}>
          <p className={styles.nodeTitle}>{data.label}</p>
        </div>
        <LanguageBadge language="python" size="sm" />
      </div>

      {config.model && (
        <p className={styles.configText}>
          {config.model}
        </p>
      )}

      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ background: langColor, border: "2px solid var(--color-bg)", width: 10, height: 10 }} 
      />
    </div>
  );
}

export const LlmNode = memo(LlmNodeComponent);
