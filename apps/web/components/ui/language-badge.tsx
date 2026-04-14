"use client";

import styles from "./language-badge.module.css";

const LANGUAGE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  python:     { label: "Python",     color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  rust:       { label: "Rust",       color: "#f97316", bg: "rgba(249,115,22,0.12)" },
  go:         { label: "Go",         color: "#06b6d4", bg: "rgba(6,182,212,0.12)" },
  java:       { label: "Java",       color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  ruby:       { label: "Ruby",       color: "#ec4899", bg: "rgba(236,72,153,0.12)" },
  php:        { label: "PHP",        color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
  node:       { label: "Node.js",    color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  typescript: { label: "TypeScript", color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
};

interface LanguageBadgeProps {
  language: string;
  size?: "sm" | "md";
  className?: string;
}

export function LanguageBadge({ language, size = "sm", className = "" }: LanguageBadgeProps) {
  const config = LANGUAGE_CONFIG[language] ?? {
    label: language,
    color: "var(--color-text-secondary)",
    bg: "var(--color-bg-subtle)",
  };

  const sizeClass = size === "sm" ? styles.sizeSm : styles.sizeMd;
  const dotSizeClass = size === "sm" ? styles.dotSm : styles.dotMd;

  return (
    <span
      className={`${styles.badge} ${sizeClass} ${className}`}
      style={{ background: config.bg, color: config.color }}
    >
      <span
        className={`${styles.dot} ${dotSizeClass}`}
        style={{
          background: config.color,
        }}
      />
      {config.label}
    </span>
  );
}
