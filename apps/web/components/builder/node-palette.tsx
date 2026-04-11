"use client";

import { Search, Brain, Database, Wrench, GitBranch, Zap, ArrowLeftRight, Globe, Send } from "lucide-react";
import { useState } from "react";
import { LanguageBadge } from "@/components/ui/language-badge";

interface NodePaletteProps {
  onAddNode: (type: string, label: string, language: string) => void;
}

const NODE_CATEGORIES = [
  {
    category: "AI",
    color: "var(--lang-python)",
    nodes: [
      { type: "llm", label: "LLM Node", language: "python", icon: Brain, description: "GPT-4, Claude, Groq inference" },
      { type: "rag", label: "RAG Node", language: "python", icon: Database, description: "Retrieval-augmented generation" },
      { type: "agent_router", label: "Agent Router", language: "go", icon: GitBranch, description: "Multi-agent routing" },
    ],
  },
  {
    category: "Logic",
    color: "var(--lang-go)",
    nodes: [
      { type: "trigger", label: "Trigger", language: "go", icon: Zap, description: "API, webhook, or schedule trigger" },
      { type: "condition", label: "Condition", language: "go", icon: GitBranch, description: "Conditional branching" },
      { type: "transform", label: "Transform", language: "typescript", icon: ArrowLeftRight, description: "Data transformation" },
    ],
  },
  {
    category: "Integration",
    color: "var(--lang-node)",
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
    <div className="p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--forge-fg-subtle)" }}>
        Node Palette
      </h2>

      {/* Search */}
      <div
        className="relative mb-4"
      >
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--forge-fg-subtle)" }}
        />
        <input
          type="text"
          placeholder="Search nodes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-8 pl-8 pr-3 rounded-lg text-xs outline-none transition-colors"
          style={{
            background: "var(--forge-bg-muted)",
            border: "1px solid var(--forge-border)",
            color: "var(--forge-fg)",
          }}
        />
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {filtered.map((category) => (
          <div key={category.category}>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: category.color }}
              />
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--forge-fg-muted)" }}>
                {category.category}
              </span>
            </div>

            <div className="space-y-1.5">
              {category.nodes.map((node) => {
                const Icon = node.icon;
                return (
                  <button
                    key={node.type}
                    onClick={() => onAddNode(node.type, node.label, node.language)}
                    className="w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-all duration-200 cursor-pointer group"
                    style={{
                      background: "transparent",
                      border: "1px solid transparent",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "var(--forge-bg-muted)";
                      e.currentTarget.style.borderColor = "var(--forge-border)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "transparent";
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110"
                      style={{
                        background: `color-mix(in srgb, ${category.color} 12%, transparent)`,
                        color: category.color,
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-medium" style={{ color: "var(--forge-fg)" }}>{node.label}</span>
                        <LanguageBadge language={node.language} size="sm" />
                      </div>
                      <p className="text-[10px] leading-relaxed" style={{ color: "var(--forge-fg-subtle)" }}>
                        {node.description}
                      </p>
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
