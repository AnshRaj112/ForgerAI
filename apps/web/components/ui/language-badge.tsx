"use client";

import { cn } from "@/lib/utils";

const LANGUAGE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  python:     { label: "Python",     color: "var(--lang-python)",     bg: "rgba(59,130,246,0.12)" },
  rust:       { label: "Rust",       color: "var(--lang-rust)",       bg: "rgba(249,115,22,0.12)" },
  go:         { label: "Go",         color: "var(--lang-go)",         bg: "rgba(6,182,212,0.12)" },
  java:       { label: "Java",       color: "var(--lang-java)",       bg: "rgba(239,68,68,0.12)" },
  ruby:       { label: "Ruby",       color: "var(--lang-ruby)",       bg: "rgba(236,72,153,0.12)" },
  php:        { label: "PHP",        color: "var(--lang-php)",        bg: "rgba(139,92,246,0.12)" },
  node:       { label: "Node.js",    color: "var(--lang-node)",       bg: "rgba(34,197,94,0.12)" },
  typescript: { label: "TypeScript", color: "var(--lang-typescript)", bg: "rgba(59,130,246,0.12)" },
};

interface LanguageBadgeProps {
  language: string;
  size?: "sm" | "md";
  className?: string;
}

export function LanguageBadge({ language, size = "sm", className }: LanguageBadgeProps) {
  const config = LANGUAGE_CONFIG[language] ?? {
    label: language,
    color: "var(--forge-fg-muted)",
    bg: "var(--forge-glass-bg)",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        className,
      )}
      style={{ background: config.bg, color: config.color }}
    >
      <span
        className="rounded-full shrink-0"
        style={{
          width: size === "sm" ? 6 : 8,
          height: size === "sm" ? 6 : 8,
          background: config.color,
          boxShadow: `0 0 6px ${config.color}`,
        }}
      />
      {config.label}
    </span>
  );
}
