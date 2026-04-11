"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ForgeCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "glass" | "glow" | "interactive";
  /** Optional glow color (CSS value) */
  glowColor?: string;
}

export function ForgeCard({
  children,
  variant = "default",
  glowColor,
  className,
  style,
  ...props
}: ForgeCardProps) {
  const baseStyles = [
    "rounded-2xl p-6 transition-all duration-300 ease-out",
    "border border-[var(--forge-border)]",
  ].join(" ");

  const variantMap: Record<string, string> = {
    default: "bg-[var(--forge-bg-elevated)]",
    glass: [
      "bg-[rgba(255,255,255,0.03)]",
      "backdrop-blur-xl",
      "border-[rgba(255,255,255,0.06)]",
    ].join(" "),
    glow: [
      "bg-[var(--forge-bg-elevated)]",
      "shadow-[var(--forge-shadow-glow)]",
      "hover:shadow-[var(--forge-shadow-glow-lg)]",
    ].join(" "),
    interactive: [
      "bg-[var(--forge-bg-elevated)]",
      "hover:border-[rgba(99,102,241,0.3)]",
      "hover:shadow-[var(--forge-shadow-glow)]",
      "hover:translate-y-[-2px]",
      "cursor-pointer",
    ].join(" "),
  };

  return (
    <div
      className={cn(baseStyles, variantMap[variant], className)}
      style={{
        ...(glowColor ? { "--forge-shadow-glow": `0 0 20px ${glowColor}` } as React.CSSProperties : {}),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
