"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./forge-button.module.css";

interface ForgeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "glow";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  loading?: boolean;
  icon?: ReactNode;
}

export function ForgeButton({
  variant = "primary",
  size = "md",
  children,
  loading = false,
  icon,
  className = "",
  disabled,
  ...props
}: ForgeButtonProps) {
  const variantClass = {
    primary: styles.variantPrimary,
    secondary: styles.variantSecondary,
    ghost: styles.variantGhost,
    danger: styles.variantDanger,
    glow: styles.variantGlow,
  }[variant];

  const sizeClass = {
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
  }[size];

  return (
    <button
      className={`${styles.button} ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className={styles.spinner} viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="shrink-0 flex items-center justify-center">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
