"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import styles from "./theme-toggle.module.css";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={styles.toggle}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
