"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, Gauge, Rocket, Store, ChevronLeft, ChevronRight } from "lucide-react";
import { navigationItems } from "@/lib/constants/navigation";
import { useState } from "react";
import styles from "./app-sidebar.module.css";

const iconsByRoute: Record<string, ComponentType<{ size?: number }>> = {
  "/dashboard": Gauge,
  "/builder": Boxes,
  "/marketplace": Store,
  "/deployments": Rocket,
};

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarClass = collapsed ? styles.collapsed : styles.expanded;

  return (
    <aside className={`${styles.sidebar} ${sidebarClass}`}>
      {/* Brand */}
      <div className={styles.brandArea}>
        <div className={styles.logo}>F</div>
        {!collapsed && (
          <div className={styles.brandText}>
            <p className={styles.brandTitle}>ForgeAI</p>
            <p className={styles.brandSubtitle}>Agent Forge</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {navigationItems.map((item) => {
          const active = pathname === item.href;
          const Icon = iconsByRoute[item.href] ?? Gauge;
          
          let itemClass = styles.navItem;
          if (active) itemClass += ` ${styles.navItemActive}`;
          if (collapsed) itemClass += ` ${styles.navItemCollapsed}`;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={itemClass}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} />
              {!collapsed && <span className={styles.navLabel}>{item.label}</span>}

              {/* Tooltip on collapsed */}
              {collapsed && (
                <span className={styles.tooltip}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button */}
      <div className={styles.footer}>
        <button
          onClick={() => setCollapsed((v) => !v)}
          className={styles.collapseButton}
        >
          {collapsed ? <ChevronRight size={14} /> : (
            <>
              <ChevronLeft size={14} /> Collapse
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
