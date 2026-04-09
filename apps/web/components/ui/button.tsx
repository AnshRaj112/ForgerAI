import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-white",
        outline: "border",
        ghost: "",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, style, ...props }: ButtonProps) {
  const toneStyle =
    variant === "default"
      ? { background: "var(--primary)", color: "var(--primary-foreground)" }
      : variant === "outline"
        ? { borderColor: "var(--border)", background: "var(--card)", color: "var(--foreground)" }
        : { background: "transparent", color: "var(--foreground)" };

  return <button className={cn(buttonVariants({ variant, size, className }))} style={{ ...toneStyle, ...style }} {...props} />;
}
