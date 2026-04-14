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
import styles from "./dashboard.module.css";

const STATS = [
  { label: "Total Agents", value: "12", icon: Boxes, color: "var(--color-accent)", change: "+3 this week" },
  { label: "Active Executions", value: "4", icon: Activity, color: "#22c55e", change: "2 running" },
  { label: "Deployments", value: "8", icon: Rocket, color: "#06b6d4", change: "3 in prod" },
  { label: "Marketplace", value: "156", icon: Store, color: "#ec4899", change: "Browse agents" },
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
  success: "#22c55e",
  error: "#ef4444",
  info: "var(--color-accent)",
};

export default function DashboardPage() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Monitor your agents, executions, and deployments</p>
        </div>
        <Link href="/builder">
          <ForgeButton variant="primary" size="md" icon={<Plus size={16} />}>
            New Agent
          </ForgeButton>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <ForgeCard key={stat.label} variant="interactive">
              <div className={styles.statHeader}>
                <div
                  className={styles.iconWrapper}
                  style={{ color: stat.color }}
                >
                  <Icon size={20} />
                </div>
                <ArrowUpRight size={14} className={styles.arrowIcon} />
              </div>
              <p className={styles.statValue}>{stat.value}</p>
              <p className={styles.statLabel}>{stat.label}</p>
              <p className={styles.statChange}>{stat.change}</p>
            </ForgeCard>
          );
        })}
      </div>

      <div className={styles.mainGrid}>
        {/* Recent Activity */}
        <div>
          <ForgeCard variant="default">
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <Zap size={14} style={{ color: "var(--color-accent)" }} />
                Recent Activity
              </h2>
              <span className={styles.liveBadge}>Live</span>
            </div>

            <div className={styles.activityList}>
              {RECENT_ACTIVITY.map((activity) => {
                const StatusIcon = STATUS_ICON[activity.status];
                return (
                  <div key={activity.id} className={styles.activityItem}>
                    <StatusIcon
                      size={16}
                      className={styles.activityIcon}
                      style={{ color: STATUS_COLOR[activity.status] }}
                    />
                    <div className={styles.activityContent}>
                      <p className={styles.activityMessage}>{activity.message}</p>
                      <div className={styles.activityLanguages}>
                        {activity.languages.map((lang) => (
                          <LanguageBadge key={lang} language={lang} size="sm" />
                        ))}
                      </div>
                    </div>
                    <span className={styles.activityTime}>{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </ForgeCard>
        </div>

        {/* Quick Actions */}
        <div>
          <ForgeCard variant="default">
            <h2 className={styles.quickActionsTitle}>Quick Actions</h2>
            <div className={styles.quickActionsList}>
              <Link href="/builder" className={styles.quickActionLink}>
                <div className={styles.quickActionItem}>
                  <Plus size={14} style={{ color: "var(--color-accent)" }} />
                  <span className={styles.quickActionLabel}>Create New Agent</span>
                </div>
              </Link>
              <Link href="/marketplace" className={styles.quickActionLink}>
                <div className={styles.quickActionItem}>
                  <Store size={14} style={{ color: "#ec4899" }} />
                  <span className={styles.quickActionLabel}>Browse Marketplace</span>
                </div>
              </Link>
              <Link href="/deployments" className={styles.quickActionLink}>
                <div className={styles.quickActionItem}>
                  <Rocket size={14} style={{ color: "#06b6d4" }} />
                  <span className={styles.quickActionLabel}>View Deployments</span>
                </div>
              </Link>
            </div>
          </ForgeCard>

          {/* Polyglot Stats */}
          <ForgeCard variant="glow" className={styles.polyglotCard}>
            <h2 className={styles.polyglotTitle}>Polyglot Distribution</h2>
            <div className={styles.polyglotList}>
              {[
                { lang: "python", pct: 35, color: "#3b82f6" },
                { lang: "go", pct: 25, color: "#06b6d4" },
                { lang: "rust", pct: 15, color: "#f97316" },
                { lang: "node", pct: 12, color: "#22c55e" },
                { lang: "java", pct: 8, color: "#ef4444" },
                { lang: "ruby", pct: 3, color: "#ec4899" },
                { lang: "php", pct: 2, color: "#8b5cf6" },
              ].map((item) => (
                <div key={item.lang} className={styles.polyglotItem}>
                  <LanguageBadge language={item.lang} size="sm" />
                  <div className={styles.progressBarContainer}>
                    <div
                      className={styles.progressBarInner}
                      style={{
                        width: `${item.pct}%`,
                        background: item.color,
                      }}
                    />
                  </div>
                  <span className={styles.polyglotLabel}>{item.pct}%</span>
                </div>
              ))}
            </div>
          </ForgeCard>
        </div>
      </div>
    </div>
  );
}
