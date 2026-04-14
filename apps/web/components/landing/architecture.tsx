"use client";

import { useState } from "react";
import styles from "./architecture.module.css";
import pageStyles from "../../app/page.module.css";
// import { LanguageBadge } from "@/components/ui/language-badge"; // Avoiding this if it uses tailwind, but it's okay to bring back if rewritten. We'll simplify for now.

const SERVICES = [
  {
    id: "web",
    name: "Next.js Gateway",
    language: "typescript",
    port: "3000",
    description: "UI/UX, Visual Builder, API Gateway, Auth",
    x: 50,
    y: 15,
    connections: ["go-orchestrator", "node-realtime"],
  },
  {
    id: "go-orchestrator",
    name: "Go Orchestrator",
    language: "go",
    port: "4001",
    description: "Central Brain — Workflow orchestration, Temporal, scaling & retries",
    x: 50,
    y: 45,
    connections: ["python-ai", "rust-executor", "java-enterprise", "ruby-workflow", "php-cms"],
  },
  {
    id: "python-ai",
    name: "Python AI",
    language: "python",
    port: "4002",
    description: "LLM inference, RAG, LangChain/LangGraph, multi-agent orchestration",
    x: 10,
    y: 80,
    connections: [],
  },
  {
    id: "rust-executor",
    name: "Rust Executor",
    language: "rust",
    port: "4003",
    description: "Crypto ops, WASM runtime, secure parsing, high-perf execution",
    x: 30,
    y: 80,
    connections: [],
  },
  {
    id: "java-enterprise",
    name: "Java Enterprise",
    language: "java",
    port: "4004",
    description: "Compliance, audit logging, transactions, billing, ERP integrations",
    x: 50,
    y: 80,
    connections: [],
  },
  {
    id: "ruby-workflow",
    name: "Ruby Workflow",
    language: "ruby",
    port: "4005",
    description: "Business rules, approval workflows, human-in-the-loop steps",
    x: 70,
    y: 80,
    connections: [],
  },
  {
    id: "php-cms",
    name: "PHP CMS",
    language: "php",
    port: "4006",
    description: "Content generation, templates, e-commerce, marketing automation",
    x: 90,
    y: 80,
    connections: [],
  },
  {
    id: "node-realtime",
    name: "Node.js Realtime",
    language: "node",
    port: "4010",
    description: "WebSockets, live monitoring, notifications, Socket.IO server",
    x: 85,
    y: 45,
    connections: [],
  },
];

export function Architecture() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hovered = SERVICES.find((s) => s.id === hoveredId);

  return (
    <section className={`${pageStyles.section} ${styles.architectureSection}`}>
      <div className={pageStyles.container}>
        {/* Section header */}
        <div className={styles.header}>
          <span className={styles.kicker}>Architecture</span>
          <h2 className={styles.title}>
            <span className="text-gradient">8 Services.</span>{" "}
            6 Languages. One Platform.
          </h2>
          <p className={styles.subtitle}>
            Each service uses the best programming language for its specific task,
            communicating via NATS JetStream and gRPC.
          </p>
        </div>

        {/* Interactive diagram */}
        <div className={styles.diagramContainer}>
          {/* Connection lines (SVG) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          >
            {SERVICES.flatMap((service) =>
              service.connections.map((targetId) => {
                const target = SERVICES.find((s) => s.id === targetId);
                if (!target) return null;
                const isActive = hoveredId === service.id || hoveredId === target.id;
                return (
                  <line
                    key={`${service.id}-${target.id}`}
                    x1={service.x}
                    y1={service.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={isActive ? "var(--color-text-primary)" : "var(--color-border)"}
                    strokeWidth={isActive ? 2 : 1}
                    strokeDasharray={isActive ? "none" : "4 4"}
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
              className={styles.serviceNode}
              style={{
                left: `${service.x}%`,
                top: `${service.y}%`,
                zIndex: hoveredId === service.id ? 10 : 1,
              }}
              onMouseEnter={() => setHoveredId(service.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className={`${styles.nodeCard} ${
                  hoveredId === service.id ? styles.nodeCardActive : ""
                }`}
              >
                <p className={styles.nodeName}>{service.name}</p>
                <p className={styles.nodePort}>:{service.port}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div
          className={`${styles.detailPanel} ${
            hovered ? "" : styles.detailPanelHidden
          }`}
        >
          {hovered ? (
            <>
              <p className={styles.detailName}>{hovered.name}</p>
              <p className={styles.detailDesc}>{hovered.description}</p>
            </>
          ) : (
            <div style={{ opacity: 0 }}>Placeholder</div> // Maintain height
          )}
        </div>

        {/* Infrastructure badges */}
        <div className={styles.infraContainer}>
          {["MongoDB 8.0", "Redis 7", "NATS JetStream", "Temporal", "gRPC", "Docker"].map(
            (tech) => (
              <span key={tech} className={styles.infraBadge}>
                {tech}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
