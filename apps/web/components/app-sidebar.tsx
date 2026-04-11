"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, Gauge, Rocket, Store, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/lib/constants/navigation";
import { useState } from "react";

const iconsByRoute: Record<string, ComponentType<{ size?: number }>> = {
  "/dashboard": Gauge,
  "/builder": Boxes,
  "/marketplace": Store,
  "/deployments": Rocket,
};

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "shrink-0 border-r flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
      style={{
        borderColor: "var(--forge-border)",
        background: "var(--forge-bg-subtle)",
      }}
    >
      {/* Brand */}
      <div className="h-14 px-4 flex items-center gap-2.5 border-b shrink-0" style={{ borderColor: "var(--forge-border)" }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ background: "var(--forge-gradient-accent)" }}
        >
          F
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold" style={{ color: "var(--forge-fg)" }}>ForgeAI</p>
            <p className="text-[10px]" style={{ color: "var(--forge-fg-subtle)" }}>Agent Forge</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navigationItems.map((item) => {
          const active = pathname === item.href;
          const Icon = iconsByRoute[item.href] ?? Gauge;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 relative group",
                collapsed && "justify-center px-2",
              )}
              style={{
                background: active ? "var(--forge-accent-muted)" : "transparent",
                color: active ? "var(--forge-accent-hover)" : "var(--forge-fg-muted)",
                borderLeft: active ? "3px solid var(--forge-accent)" : "3px solid transparent",
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} />
              {!collapsed && <span className="font-medium">{item.label}</span>}

              {/* Tooltip on collapsed */}
              {collapsed && (
                <span
                  className="absolute left-full ml-2 px-2 py-1 rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50"
                  style={{
                    background: "var(--forge-bg-elevated)",
                    border: "1px solid var(--forge-border)",
                    color: "var(--forge-fg)",
                  }}
                >
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button */}
      <div className="p-3 border-t" style={{ borderColor: "var(--forge-border)" }}>
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs transition-all duration-200 cursor-pointer"
          style={{
            background: "transparent",
            color: "var(--forge-fg-subtle)",
            border: "1px solid var(--forge-border)",
          }}
        >
          {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /> Collapse</>}
        </button>
      </div>
    </aside>
  );
}
