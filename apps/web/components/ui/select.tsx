import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Select({ className, style, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn("h-9 w-full rounded-md border px-3 text-sm outline-none", className)}
      style={{ borderColor: "var(--border)", background: "var(--background)", color: "var(--foreground)", ...style }}
      {...props}
    >
      {children}
    </select>
  );
}
