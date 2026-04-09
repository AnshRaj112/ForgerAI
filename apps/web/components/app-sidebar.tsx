"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, Gauge, Rocket, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/lib/constants/navigation";

const iconsByRoute: Record<string, ComponentType<{ size?: number }>> = {
  "/dashboard": Gauge,
  "/builder": Boxes,
  "/marketplace": Store,
  "/deployments": Rocket,
};

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
      <div className="mb-6">
        <h1 className="text-lg font-semibold">ForgeAI</h1>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          Agent Forge Platform
        </p>
      </div>
      <nav className="space-y-1">
        {navigationItems.map((item) => {
          const active = pathname === item.href;
          const Icon = iconsByRoute[item.href] ?? Gauge;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                active && "font-medium",
              )}
              style={{
                background: active ? "var(--muted)" : "transparent",
                color: "var(--foreground)",
              }}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
