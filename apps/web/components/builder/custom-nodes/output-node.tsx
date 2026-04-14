"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { LanguageBadge } from "../../ui/language-badge";
import { Send } from "lucide-react";
import styles from "./custom-node.module.css";

function OutputNodeComponent({ data, selected }: NodeProps) {
  const langColor = "#22c55e"; // Node/Green

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
          style={{ background: "rgba(34,197,94,0.12)", color: langColor }}
        >
          <Send size={14} />
        </div>
        <div className={styles.titleContainer}>
          <p className={styles.nodeTitle}>{data.label}</p>
        </div>
        <LanguageBadge language="node" size="sm" />
      </div>
    </div>
  );
}
export const OutputNode = memo(OutputNodeComponent);
