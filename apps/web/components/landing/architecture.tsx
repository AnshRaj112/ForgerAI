"use client";

import { useState } from "react";
import { LanguageBadge } from "@/components/ui/language-badge";

const SERVICES = [
  {
    id: "web",
    name: "Next.js Gateway",
    language: "typescript",
    port: "3000",
    description: "UI/UX, Visual Builder, API Gateway, Auth",
    x: 50,
    y: 8,
    connections: ["go-orchestrator", "node-realtime"],
  },
  {
    id: "go-orchestrator",
    name: "Go Orchestrator",
    language: "go",
    port: "4001",
    description: "Central Brain — Workflow orchestration, Temporal, scaling & retries",
    x: 50,
    y: 35,
    connections: ["python-ai", "rust-executor", "java-enterprise", "ruby-workflow", "php-cms"],
  },
  {
    id: "python-ai",
    name: "Python AI",
    language: "python",
    port: "4002",
    description: "LLM inference, RAG, LangChain/LangGraph, multi-agent orchestration",
    x: 10,
    y: 62,
    connections: [],
  },
  {
    id: "rust-executor",
    name: "Rust Executor",
    language: "rust",
    port: "4003",
    description: "Crypto ops, WASM runtime, secure parsing, high-perf execution",
    x: 30,
    y: 62,
    connections: [],
  },
  {
    id: "java-enterprise",
    name: "Java Enterprise",
    language: "java",
    port: "4004",
    description: "Compliance, audit logging, transactions, billing, ERP integrations",
    x: 50,
    y: 62,
    connections: [],
  },
  {
    id: "ruby-workflow",
    name: "Ruby Workflow",
    language: "ruby",
    port: "4005",
    description: "Business rules, approval workflows, human-in-the-loop steps",
    x: 70,
    y: 62,
    connections: [],
  },
  {
    id: "php-cms",
    name: "PHP CMS",
    language: "php",
    port: "4006",
    description: "Content generation, templates, e-commerce, marketing automation",
    x: 90,
    y: 62,
    connections: [],
  },
  {
    id: "node-realtime",
    name: "Node.js Realtime",
    language: "node",
    port: "4010",
    description: "WebSockets, live monitoring, notifications, Socket.IO server",
    x: 85,
    y: 35,
    connections: [],
  },
];

export function Architecture() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hovered = SERVICES.find((s) => s.id === hoveredId);

  return (
    <section className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p
            className="text-sm font-semibold tracking-widest uppercase mb-4"
            style={{ color: "var(--forge-accent)" }}
          >
            Architecture
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
            <span className="forge-gradient-text">8 Services.</span>{" "}
            6 Languages. One Platform.
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--forge-fg-muted)" }}>
            Each service uses the best programming language for its specific task,
            communicating via NATS JetStream and gRPC.
          </p>
        </div>

        {/* Interactive diagram */}
        <div className="relative w-full aspect-[16/8] max-w-4xl mx-auto">
          {/* Connection lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 80">
            {SERVICES.flatMap((service) =>
              service.connections.map((targetId) => {
                const target = SERVICES.find((s) => s.id === targetId);
                if (!target) return null;
                const isActive = hoveredId === service.id || hoveredId === target.id;
                return (
                  <line
                    key={`${service.id}-${target.id}`}
                    x1={service.x}
                    y1={service.y + 3}
                    x2={target.x}
                    y2={target.y - 1}
                    stroke={isActive ? "rgba(99,102,241,0.6)" : "rgba(99,102,241,0.15)"}
                    strokeWidth={isActive ? 0.4 : 0.2}
                    strokeDasharray={isActive ? "none" : "1 1"}
                    style={{ transition: "all 300ms ease" }}
                  />
                );
              }),
            )}
          </svg>

          {/* Service nodes */}
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
              style={{
                left: `${service.x}%`,
                top: `${service.y}%`,
                zIndex: hoveredId === service.id ? 10 : 1,
              }}
              onMouseEnter={() => setHoveredId(service.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className="rounded-xl px-3 py-2 cursor-pointer transition-all duration-300 text-center min-w-[110px]"
                style={{
                  background: hoveredId === service.id ? "var(--forge-bg-elevated)" : "var(--forge-bg-muted)",
                  border: `1px solid ${hoveredId === service.id ? "rgba(99,102,241,0.4)" : "var(--forge-border)"}`,
                  boxShadow: hoveredId === service.id ? "0 0 30px rgba(99,102,241,0.15)" : "none",
                  transform: hoveredId === service.id ? "scale(1.08)" : "scale(1)",
                }}
              >
                <p className="text-[11px] font-semibold mb-1 whitespace-nowrap">{service.name}</p>
                <div className="flex justify-center">
                  <LanguageBadge language={service.language} size="sm" />
                </div>
                <p className="text-[9px] mt-1" style={{ color: "var(--forge-fg-subtle)" }}>
                  :{service.port}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div
          className="mt-8 max-w-lg mx-auto rounded-xl px-6 py-4 text-center transition-all duration-300"
          style={{
            background: hovered ? "var(--forge-bg-elevated)" : "transparent",
            border: hovered ? "1px solid var(--forge-border)" : "1px solid transparent",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(8px)",
          }}
        >
          {hovered && (
            <>
              <p className="text-sm font-semibold mb-1">{hovered.name}</p>
              <p className="text-xs" style={{ color: "var(--forge-fg-muted)" }}>
                {hovered.description}
              </p>
            </>
          )}
        </div>

        {/* Infrastructure badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
          {["MongoDB 8.0", "Redis 7", "NATS JetStream", "Temporal", "gRPC", "Docker"].map(
            (tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-full text-xs font-medium"
                style={{
                  background: "var(--forge-glass-bg)",
                  border: "1px solid var(--forge-glass-border)",
                  color: "var(--forge-fg-muted)",
                }}
              >
                {tech}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
