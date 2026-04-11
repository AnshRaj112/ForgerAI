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
  prod: { label: "Production", bg: "rgba(34,197,94,0.12)", color: "var(--forge-success)" },
  staging: { label: "Staging", bg: "rgba(249,115,22,0.12)", color: "var(--lang-rust)" },
  dev: { label: "Development", bg: "rgba(99,102,241,0.12)", color: "var(--forge-accent)" },
};

const STATUS_CONFIG = {
  running: { icon: CheckCircle2, color: "var(--forge-success)", label: "Running" },
  stopped: { icon: Clock, color: "var(--forge-fg-subtle)", label: "Stopped" },
  failed: { icon: XCircle, color: "var(--forge-error)", label: "Failed" },
};

export default function DeploymentsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--forge-fg)" }}>
            Deployments
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--forge-fg-muted)" }}>
            Monitor and manage your deployed agents across environments
          </p>
        </div>
        <div className="flex items-center gap-3">
          {Object.entries(ENV_STYLES).map(([key, env]) => (
            <span
              key={key}
              className="px-3 py-1 rounded-full text-[10px] font-medium"
              style={{ background: env.bg, color: env.color }}
            >
              {env.label}
            </span>
          ))}
        </div>
      </div>

      {/* Deployments List */}
      <div className="space-y-3">
        {DEPLOYMENTS.map((dep) => {
          const env = ENV_STYLES[dep.environment]!;
          const status = STATUS_CONFIG[dep.status];
          const StatusIcon = status.icon;
          return (
            <ForgeCard key={dep.id} variant="interactive" className="!p-4">
              <div className="flex items-center gap-4">
                {/* Status indicator */}
                <div className="shrink-0">
                  <StatusIcon size={20} style={{ color: status.color }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold truncate" style={{ color: "var(--forge-fg)" }}>
                      {dep.agentName}
                    </h3>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0"
                      style={{ background: env.bg, color: env.color }}
                    >
                      {env.label}
                    </span>
                    <span className="text-[10px] font-mono" style={{ color: "var(--forge-fg-subtle)" }}>
                      v{dep.version}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {dep.languages.map((lang) => (
                      <LanguageBadge key={lang} language={lang} size="sm" />
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="hidden md:flex items-center gap-6 shrink-0">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--forge-fg-subtle)" }}>Uptime</p>
                    <p className="text-xs font-semibold" style={{ color: "var(--forge-fg)" }}>{dep.uptime}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--forge-fg-subtle)" }}>Requests</p>
                    <p className="text-xs font-semibold" style={{ color: "var(--forge-fg)" }}>{dep.requests}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--forge-fg-subtle)" }}>Status</p>
                    <p className="text-xs font-semibold" style={{ color: status.color }}>{status.label}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
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
