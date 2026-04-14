"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { LanguageBadge } from "../../ui/language-badge";
import { GitBranch } from "lucide-react";
import styles from "./custom-node.module.css";

function ConditionNodeComponent({ data, selected }: NodeProps) {
  const langColor = "#06b6d4"; // Go/Cyan

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
          style={{ background: "rgba(6,182,212,0.12)", color: langColor }}
        >
          <GitBranch size={14} />
        </div>
        <div className={styles.titleContainer}>
          <p className={styles.nodeTitle}>{data.label}</p>
        </div>
        <LanguageBadge language="go" size="sm" />
      </div>
      {/* Multiple outputs for branching */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="true" 
        style={{ background: "#22c55e", border: "2px solid var(--color-bg)", width: 10, height: 10, left: "30%" }} 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="false" 
        style={{ background: "#ef4444", border: "2px solid var(--color-bg)", width: 10, height: 10, left: "70%" }} 
      />
    </div>
  );
}
export const ConditionNode = memo(ConditionNodeComponent);
