"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ForgeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "glow";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  loading?: boolean;
  icon?: ReactNode;
}

const variantStyles: Record<string, string> = {
  primary: [
    "bg-[var(--forge-accent)] text-white",
    "hover:bg-[var(--forge-accent-hover)]",
    "shadow-[0_0_20px_rgba(99,102,241,0.3)]",
    "hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]",
  ].join(" "),
  secondary: [
    "bg-[var(--forge-bg-elevated)] text-[var(--forge-fg)]",
    "border border-[var(--forge-border)]",
    "hover:border-[var(--forge-accent)]",
    "hover:bg-[var(--forge-bg-muted)]",
  ].join(" "),
  ghost: [
    "bg-transparent text-[var(--forge-fg-muted)]",
    "hover:text-[var(--forge-fg)]",
    "hover:bg-[var(--forge-glass-hover)]",
  ].join(" "),
  danger: [
    "bg-[var(--forge-error)] text-white",
    "hover:bg-[#dc2626]",
    "shadow-[0_0_20px_rgba(239,68,68,0.2)]",
  ].join(" "),
  glow: [
    "bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a78bfa] text-white",
    "shadow-[0_0_30px_rgba(99,102,241,0.4)]",
    "hover:shadow-[0_0_50px_rgba(99,102,241,0.6)]",
    "hover:brightness-110",
  ].join(" "),
};

const sizeStyles: Record<string, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-5 text-sm gap-2 rounded-xl",
  lg: "h-12 px-7 text-base gap-2.5 rounded-xl",
};

export function ForgeButton({
  variant = "primary",
  size = "md",
  children,
  loading = false,
  icon,
  className,
  disabled,
  ...props
}: ForgeButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium",
        "transition-all duration-200 ease-out cursor-pointer",
        "active:scale-[0.97]",
        "disabled:opacity-50 disabled:pointer-events-none",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
