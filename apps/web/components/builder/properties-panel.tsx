"use client";

import type { Node } from "reactflow";
import { LanguageBadge } from "@/components/ui/language-badge";
import { ForgeButton } from "@/components/ui/forge-button";
import { Trash2, Settings, Code } from "lucide-react";
import { useState } from "react";
import styles from "./properties-panel.module.css";

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
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Settings size={14} className={styles.settingsIcon} />
          <h3 className={styles.title}>Properties</h3>
        </div>
        <ForgeButton variant="danger" size="sm" onClick={onDelete} icon={<Trash2 size={12} />}>
          Delete
        </ForgeButton>
      </div>

      {/* Node meta */}
      <div className={styles.section}>
        <div className={styles.field}>
          <label className={styles.label}>Label</label>
          <input
            type="text"
            value={node.data?.label || ""}
            onChange={(e) => onUpdateData({ label: e.target.value })}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Node Type</label>
          <div className={styles.valueBox}>
            {node.data?.nodeType || node.type}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Runtime Language</label>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <LanguageBadge language={node.data?.language || "typescript"} size="md" />
            <span className={styles.autoAssignText}>Auto-assigned</span>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Node ID</label>
          <div className={`${styles.valueBox} ${styles.monoBox}`}>
            {node.id}
          </div>
        </div>
      </div>

      {/* JSON Config Editor */}
      <div>
        <div className={styles.editorHeader}>
          <Code size={12} className={styles.editorIcon} />
          <label className={styles.label}>Configuration (JSON)</label>
        </div>
        <textarea
          value={configText}
          onChange={(e) => handleConfigChange(e.target.value)}
          rows={8}
          spellCheck={false}
          className={`${styles.textarea} ${configError ? styles.textareaError : ""}`}
        />
        {configError && (
          <p className={styles.errorText}>
            {configError}
          </p>
        )}
      </div>
    </div>
  );
}
