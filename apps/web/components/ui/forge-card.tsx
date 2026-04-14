"use client";

import type { HTMLAttributes, ReactNode } from "react";
import styles from "./forge-card.module.css";

interface ForgeCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "glass" | "glow" | "interactive";
  glowColor?: string;
}

export function ForgeCard({
  children,
  variant = "default",
  glowColor,
  className = "",
  style,
  ...props
}: ForgeCardProps) {
  const variantClass = {
    default: styles.variantDefault,
    glass: styles.variantGlass,
    glow: styles.variantGlow,
    interactive: styles.variantInteractive,
  }[variant];

  return (
    <div
      className={`${styles.card} ${variantClass} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
