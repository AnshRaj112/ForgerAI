"use client";

import { Search, Brain, Database, Wrench, GitBranch, Zap, ArrowLeftRight, Globe, Send } from "lucide-react";
import { useState } from "react";
import { LanguageBadge } from "../ui/language-badge";
import styles from "./node-palette.module.css";

interface NodePaletteProps {
  onAddNode: (type: string, label: string, language: string) => void;
}

const NODE_CATEGORIES = [
  {
    category: "AI",
    color: "#3b82f6", // python/blue
    nodes: [
      { type: "llm", label: "LLM Node", language: "python", icon: Brain, description: "High-performance Groq inference" },
      { type: "rag", label: "RAG Node", language: "python", icon: Database, description: "Retrieval-augmented generation" },
      { type: "agent_router", label: "Agent Router", language: "go", icon: GitBranch, description: "Multi-agent routing" },
    ],
  },
  {
    category: "Logic",
    color: "#06b6d4", // go/cyan
    nodes: [
      { type: "trigger", label: "Trigger", language: "go", icon: Zap, description: "API, webhook, or schedule trigger" },
      { type: "condition", label: "Condition", language: "go", icon: GitBranch, description: "Conditional branching" },
      { type: "transform", label: "Transform", language: "typescript", icon: ArrowLeftRight, description: "Data transformation" },
    ],
  },
  {
    category: "Integration",
    color: "#22c55e", // node/green
    nodes: [
      { type: "tool", label: "Tool", language: "rust", icon: Wrench, description: "Crypto, WASM, secure execution" },
      { type: "webhook", label: "Webhook", language: "node", icon: Globe, description: "External API integration" },
      { type: "output", label: "Output", language: "node", icon: Send, description: "Response/output node" },
    ],
  },
];

export function NodePalette({ onAddNode }: NodePaletteProps) {
  const [search, setSearch] = useState("");

  const filtered = NODE_CATEGORIES.map((cat) => ({
    ...cat,
    nodes: cat.nodes.filter(
      (n) =>
        n.label.toLowerCase().includes(search.toLowerCase()) ||
        n.description.toLowerCase().includes(search.toLowerCase()),
    ),
  })).filter((cat) => cat.nodes.length > 0);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Node Palette</h2>

      {/* Search */}
      <div className={styles.searchContainer}>
        <Search size={14} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search nodes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Categories */}
      <div>
        {filtered.map((category) => (
          <div key={category.category} className={styles.categoryGroup}>
            <div className={styles.categoryHeader}>
              <span className={styles.categoryDot} style={{ background: category.color }} />
              <span className={styles.categoryLabel}>{category.category}</span>
            </div>

            <div className={styles.nodeList}>
              {category.nodes.map((node) => {
                const Icon = node.icon;
                return (
                  <button
                    key={node.type}
                    onClick={() => onAddNode(node.type, node.label, node.language)}
                    className={styles.nodeItem}
                  >
                    <div
                      className={styles.iconWrapper}
                      style={{
                        background: `color-mix(in srgb, ${category.color} 12%, transparent)`,
                        color: category.color,
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div className={styles.contentWrapper}>
                      <div className={styles.nodeHeader}>
                        <span className={styles.nodeLabel}>{node.label}</span>
                        <LanguageBadge language={node.language} size="sm" />
                      </div>
                      <p className={styles.nodeDesc}>{node.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
