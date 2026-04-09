import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, style, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn("h-9 w-full rounded-md border px-3 text-sm outline-none", className)}
      style={{ borderColor: "var(--border)", background: "var(--background)", color: "var(--foreground)", ...style }}
      {...props}
    />
  );
}
