import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-xl border shadow-sm", className)}
      style={{ borderColor: "var(--border)", background: "var(--card)", ...style }}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-4 pt-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-sm font-semibold", className)} {...props} />;
}

export function CardDescription({ className, style, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs", className)} style={{ color: "var(--muted-foreground)", ...style }} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 pt-3", className)} {...props} />;
}
