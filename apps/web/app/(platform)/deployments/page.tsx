"use client";

import { ForgeCard } from "@/components/ui/forge-card";
import { LanguageBadge } from "@/components/ui/language-badge";
import { ForgeButton } from "@/components/ui/forge-button";
import {
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Eye,
} from "lucide-react";
import styles from "./deployments.module.css";

const DEPLOYMENTS = [
  {
    id: "deploy-001",
    agentName: "Customer Support AI",
    environment: "prod" as const,
    status: "running" as const,
    version: "1.2.0",
    deployedAt: "2026-04-11T05:30:00Z",
    languages: ["python", "go", "node", "ruby"],
    uptime: "99.95%",
    requests: "12.4K",
  },
  {
    id: "deploy-002",
    agentName: "Data Pipeline Orchestrator",
    environment: "staging" as const,
    status: "running" as const,
    version: "2.0.0-beta",
    deployedAt: "2026-04-10T14:00:00Z",
    languages: ["python", "rust", "go"],
    uptime: "99.99%",
    requests: "3.2K",
  },
  {
    id: "deploy-003",
    agentName: "Content Generator v1",
    environment: "dev" as const,
    status: "stopped" as const,
    version: "0.9.1",
    deployedAt: "2026-04-09T10:15:00Z",
    languages: ["python", "php", "node"],
    uptime: "—",
    requests: "456",
  },
  {
    id: "deploy-004",
    agentName: "Invoice Processing Agent",
    environment: "prod" as const,
    status: "failed" as const,
    version: "1.0.3",
    deployedAt: "2026-04-08T22:45:00Z",
    languages: ["python", "java", "rust"],
    uptime: "—",
    requests: "890",
  },
  {
    id: "deploy-005",
    agentName: "Sales Automation Pro",
    environment: "prod" as const,
    status: "running" as const,
    version: "3.1.0",
    deployedAt: "2026-04-07T08:00:00Z",
    languages: ["python", "java", "ruby", "node"],
    uptime: "99.97%",
    requests: "8.7K",
  },
];

const ENV_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  prod: { label: "Production", bg: "rgba(34,197,94,0.12)", color: "#22c55e" },
  staging: { label: "Staging", bg: "rgba(249,115,22,0.12)", color: "#f97316" },
  dev: { label: "Development", bg: "rgba(99,102,241,0.12)", color: "var(--color-accent)" },
};

const STATUS_CONFIG = {
  running: { icon: CheckCircle2, color: "#22c55e", label: "Running" },
  stopped: { icon: Clock, color: "var(--color-text-tertiary)", label: "Stopped" },
  failed: { icon: XCircle, color: "#ef4444", label: "Failed" },
};

export default function DeploymentsPage() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Deployments</h1>
          <p className={styles.subtitle}>Monitor and manage your deployed agents across environments</p>
        </div>
        <div className={styles.envList}>
          {Object.entries(ENV_STYLES).map(([key, env]) => (
            <span
              key={key}
              className={styles.envBadge}
              style={{ background: env.bg, color: env.color }}
            >
              {env.label}
            </span>
          ))}
        </div>
      </div>

      {/* Deployments List */}
      <div className={styles.list}>
        {DEPLOYMENTS.map((dep) => {
          const env = ENV_STYLES[dep.environment]!;
          const status = STATUS_CONFIG[dep.status];
          const StatusIcon = status.icon;
          return (
            <ForgeCard key={dep.id} variant="interactive" className={styles.itemWrapper}>
              <div className={styles.itemContent}>
                {/* Status indicator */}
                <div className={styles.statusIconWrapper}>
                  <StatusIcon size={20} style={{ color: status.color }} />
                </div>

                {/* Info */}
                <div className={styles.infoSection}>
                  <div className={styles.infoHeader}>
                    <h3 className={styles.agentName}>{dep.agentName}</h3>
                    <span
                      className={styles.envBadge}
                      style={{ background: env.bg, color: env.color, flexShrink: 0 }}
                    >
                      {env.label}
                    </span>
                    <span className={styles.versionText}>
                      v{dep.version}
                    </span>
                  </div>
                  <div className={styles.languagesWrapper}>
                    {dep.languages.map((lang) => (
                      <LanguageBadge key={lang} language={lang} size="sm" />
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className={styles.metricsSection}>
                  <div className={styles.metricBlock}>
                    <p className={styles.metricLabel}>Uptime</p>
                    <p className={styles.metricValue}>{dep.uptime}</p>
                  </div>
                  <div className={styles.metricBlock}>
                    <p className={styles.metricLabel}>Requests</p>
                    <p className={styles.metricValue}>{dep.requests}</p>
                  </div>
                  <div className={styles.metricBlock}>
                    <p className={styles.metricLabel}>Status</p>
                    <p className={styles.metricValue} style={{ color: status.color }}>{status.label}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className={styles.actionsSection}>
                  <ForgeButton variant="ghost" size="sm" icon={<Eye size={12} />}>
                    Logs
                  </ForgeButton>
                  {dep.status === "failed" && (
                    <ForgeButton variant="secondary" size="sm" icon={<RotateCcw size={12} />}>
                      Redeploy
                    </ForgeButton>
                  )}
                </div>
              </div>
            </ForgeCard>
          );
        })}
      </div>
    </div>
  );
}
