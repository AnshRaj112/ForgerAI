import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, style, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium", className)}
      style={{ borderColor: "var(--border)", background: "var(--muted)", color: "var(--muted-foreground)", ...style }}
      {...props}
    />
  );
}
