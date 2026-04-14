"use client";

import {
  Cpu,
  Layers,
  Rocket,
  Activity,
  Store,
  Shield,
  Workflow,
  Globe,
} from "lucide-react";
import styles from "./features.module.css";
import pageStyles from "../../app/page.module.css";

const FEATURES = [
  {
    icon: Layers,
    title: "Visual Agent Builder",
    description: "Drag-and-drop interface powered by React Flow. Design complex multi-step AI agents without writing a single line of code.",
    color: "#6366f1",
  },
  {
    icon: Cpu,
    title: "Polyglot Compilation",
    description: "Each node automatically compiles to the optimal language — Python for AI, Rust for crypto, Go for orchestration, Java for enterprise.",
    color: "#f97316",
  },
  {
    icon: Rocket,
    title: "One-Click Deploy",
    description: "Deploy your agents instantly to any environment. Automatic containerization, scaling, and load balancing built-in.",
    color: "#06b6d4",
  },
  {
    icon: Activity,
    title: "Real-Time Monitoring",
    description: "Live execution tracing, performance metrics, and log streaming. See every node execute in real-time across languages.",
    color: "#22c55e",
  },
  {
    icon: Store,
    title: "Agent Marketplace",
    description: "Publish, discover, and monetize AI agents. One-click install into your workspace with full customization.",
    color: "#ec4899",
  },
  {
    icon: Shield,
    title: "Enterprise Ready",
    description: "SOC2/GDPR/HIPAA compliance, audit logging, role-based access, and full transaction history powered by Java/Spring Boot.",
    color: "#ef4444",
  },
  {
    icon: Workflow,
    title: "Workflow Engine",
    description: "Complex business logic, approval processes, and human-in-the-loop steps with an elegant Ruby-powered rule engine.",
    color: "#ec4899",
  },
  {
    icon: Globe,
    title: "CMS & Content",
    description: "Content generation, template management, and marketing automation with a mature PHP/Laravel ecosystem.",
    color: "#8b5cf6",
  },
];

export function Features() {
  return (
    <section className={`${pageStyles.section} ${styles.featuresSection}`}>
      <div className={pageStyles.container}>
        {/* Section header */}
        <div className={styles.header}>
          <span className={styles.kicker}>
            Platform Capabilities
          </span>
          <h2 className={styles.title}>
            Everything You Need to{" "}
            <span className="text-gradient">Forge Intelligence</span>
          </h2>
          <p className={styles.subtitle}>
            A complete platform for building, deploying, and managing AI agents with
            the power of polyglot microservices.
          </p>
        </div>

        {/* Feature grid */}
        <div className={styles.grid}>
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className={styles.card}>
                <div
                  className={styles.iconWrapper}
                  style={{ color: feature.color }}
                >
                  <Icon size={24} />
                </div>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardDescription}>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
