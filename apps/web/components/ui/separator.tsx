import type { HTMLAttributes } from "react";

export function Separator({ style, ...props }: HTMLAttributes<HTMLHRElement>) {
  return <hr style={{ borderColor: "var(--border)", ...style }} {...props} />;
}
