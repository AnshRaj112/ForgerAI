import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, style, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn("min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none", className)}
      style={{ borderColor: "var(--border)", background: "var(--background)", color: "var(--foreground)", ...style }}
      {...props}
    />
  );
}
