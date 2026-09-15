import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/80 px-3 py-1.5 text-[11px] font-medium tracking-[0.18em] text-muted uppercase shadow-sm shadow-black/10 backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "border-line-strong bg-surface/80 text-muted",
        accent: "border-accent/40 bg-accent/10 text-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type BadgeProps = ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
