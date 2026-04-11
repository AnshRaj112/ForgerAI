"use client";

import { ForgeCard } from "@/components/ui/forge-card";
import { ForgeButton } from "@/components/ui/forge-button";
import { LanguageBadge } from "@/components/ui/language-badge";
import Link from "next/link";
import {
  Boxes,
  Activity,
  Rocket,
  Store,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
} from "lucide-react";

const STATS = [
  { label: "Total Agents", value: "12", icon: Boxes, color: "var(--forge-accent)", change: "+3 this week" },
  { label: "Active Executions", value: "4", icon: Activity, color: "var(--forge-success)", change: "2 running" },
  { label: "Deployments", value: "8", icon: Rocket, color: "var(--lang-go)", change: "3 in prod" },
  { label: "Marketplace", value: "156", icon: Store, color: "var(--lang-ruby)", change: "Browse agents" },
];

const RECENT_ACTIVITY = [
  { id: 1, type: "deploy", message: "Customer Support Agent deployed to prod", time: "2 min ago", status: "success" as const, languages: ["python", "go", "node"] },
  { id: 2, type: "compile", message: "Data Pipeline Agent compiled", time: "15 min ago", status: "success" as const, languages: ["python", "rust"] },
  { id: 3, type: "execute", message: "Content Generator Agent execution failed", time: "1 hr ago", status: "error" as const, languages: ["python", "php"] },
  { id: 4, type: "create", message: "New agent: Sales Automation v2", time: "3 hrs ago", status: "info" as const, languages: ["python", "java", "ruby"] },
  { id: 5, type: "execute", message: "Security Audit Agent completed", time: "5 hrs ago", status: "success" as const, languages: ["rust", "java", "go"] },
];

const STATUS_ICON = {
  success: CheckCircle2,
  error: XCircle,
  info: Clock,
};

const STATUS_COLOR = {
  success: "var(--forge-success)",
  error: "var(--forge-error)",
  info: "var(--forge-accent)",
};

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--forge-fg)" }}>
            Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--forge-fg-muted)" }}>
            Monitor your agents, executions, and deployments
          </p>
        </div>
        <Link href="/builder">
          <ForgeButton variant="glow" size="md" icon={<Plus size={16} />}>
            New Agent
          </ForgeButton>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <ForgeCard key={stat.label} variant="interactive">
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: `color-mix(in srgb, ${stat.color} 12%, transparent)`,
                    color: stat.color,
                  }}
                >
                  <Icon size={20} />
                </div>
                <ArrowUpRight size={14} style={{ color: "var(--forge-fg-subtle)" }} />
              </div>
              <p className="text-2xl font-bold mb-1" style={{ color: "var(--forge-fg)" }}>
                {stat.value}
              </p>
              <p className="text-xs" style={{ color: "var(--forge-fg-muted)" }}>
                {stat.label}
              </p>
              <p className="text-[10px] mt-2" style={{ color: "var(--forge-fg-subtle)" }}>
                {stat.change}
              </p>
            </ForgeCard>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <ForgeCard variant="default">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--forge-fg)" }}>
                <Zap size={14} style={{ color: "var(--forge-accent)" }} />
                Recent Activity
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "var(--forge-accent-muted)", color: "var(--forge-accent)" }}>
                Live
              </span>
            </div>

            <div className="space-y-3">
              {RECENT_ACTIVITY.map((activity) => {
                const StatusIcon = STATUS_ICON[activity.status];
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg transition-colors"
                    style={{ background: "var(--forge-bg-muted)" }}
                  >
                    <StatusIcon
                      size={16}
                      className="mt-0.5 shrink-0"
                      style={{ color: STATUS_COLOR[activity.status] }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium" style={{ color: "var(--forge-fg)" }}>
                        {activity.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {activity.languages.map((lang) => (
                          <LanguageBadge key={lang} language={lang} size="sm" />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] whitespace-nowrap shrink-0" style={{ color: "var(--forge-fg-subtle)" }}>
                      {activity.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </ForgeCard>
        </div>

        {/* Quick Actions */}
        <div>
          <ForgeCard variant="default">
            <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--forge-fg)" }}>
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Link href="/builder" className="block">
                <div
                  className="p-3 rounded-lg flex items-center gap-3 transition-all duration-200 cursor-pointer"
                  style={{ border: "1px solid var(--forge-border)" }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; e.currentTarget.style.background = "var(--forge-bg-muted)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--forge-border)"; e.currentTarget.style.background = "transparent"; }}
                >
                  <Plus size={14} style={{ color: "var(--forge-accent)" }} />
                  <span className="text-xs font-medium" style={{ color: "var(--forge-fg)" }}>Create New Agent</span>
                </div>
              </Link>
              <Link href="/marketplace" className="block">
                <div
                  className="p-3 rounded-lg flex items-center gap-3 transition-all duration-200 cursor-pointer"
                  style={{ border: "1px solid var(--forge-border)" }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; e.currentTarget.style.background = "var(--forge-bg-muted)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--forge-border)"; e.currentTarget.style.background = "transparent"; }}
                >
                  <Store size={14} style={{ color: "var(--lang-ruby)" }} />
                  <span className="text-xs font-medium" style={{ color: "var(--forge-fg)" }}>Browse Marketplace</span>
                </div>
              </Link>
              <Link href="/deployments" className="block">
                <div
                  className="p-3 rounded-lg flex items-center gap-3 transition-all duration-200 cursor-pointer"
                  style={{ border: "1px solid var(--forge-border)" }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; e.currentTarget.style.background = "var(--forge-bg-muted)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--forge-border)"; e.currentTarget.style.background = "transparent"; }}
                >
                  <Rocket size={14} style={{ color: "var(--lang-go)" }} />
                  <span className="text-xs font-medium" style={{ color: "var(--forge-fg)" }}>View Deployments</span>
                </div>
              </Link>
            </div>
          </ForgeCard>

          {/* Polyglot Stats */}
          <ForgeCard variant="glow" className="mt-4">
            <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--forge-fg)" }}>
              Polyglot Distribution
            </h2>
            <div className="space-y-2.5">
              {[
                { lang: "python", pct: 35 },
                { lang: "go", pct: 25 },
                { lang: "rust", pct: 15 },
                { lang: "node", pct: 12 },
                { lang: "java", pct: 8 },
                { lang: "ruby", pct: 3 },
                { lang: "php", pct: 2 },
              ].map((item) => (
                <div key={item.lang} className="flex items-center gap-2">
                  <LanguageBadge language={item.lang} size="sm" />
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--forge-bg-muted)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${item.pct}%`,
                        background: `var(--lang-${item.lang})`,
                        boxShadow: `0 0 8px var(--lang-${item.lang})`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-mono w-8 text-right" style={{ color: "var(--forge-fg-subtle)" }}>
                    {item.pct}%
                  </span>
                </div>
              ))}
            </div>
          </ForgeCard>
        </div>
      </div>
    </div>
  );
}
