"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { LanguageBadge } from "../../ui/language-badge";
import { Zap } from "lucide-react";
import styles from "./custom-node.module.css";

function TriggerNodeComponent({ data, selected }: NodeProps) {
  const langColor = "#06b6d4"; // Go/Cyan

  return (
    <div
      className={`${styles.nodeWrapper} ${selected ? styles.nodeWrapperSelected : ""}`}
      style={{
        borderColor: selected ? langColor : "var(--color-border)",
      }}
    >
      <div className={styles.header}>
        <div 
          className={styles.iconContainer} 
          style={{ background: "rgba(6,182,212,0.12)", color: langColor }}
        >
          <Zap size={14} />
        </div>
        <div className={styles.titleContainer}>
          <p className={styles.nodeTitle}>{data.label}</p>
        </div>
        <LanguageBadge language="go" size="sm" />
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ background: langColor, border: "2px solid var(--color-bg)", width: 10, height: 10 }} 
      />
    </div>
  );
}
export const TriggerNode = memo(TriggerNodeComponent);
