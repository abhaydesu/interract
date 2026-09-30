import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-900 text-white shadow-btn-primary dark:bg-white dark:text-neutral-900",
        secondary:
          "bg-black/[0.04] text-neutral-600 dark:bg-white/[0.06] dark:text-neutral-300",
        destructive:
          "bg-red-500/10 text-red-600 shadow-[inset_0_0_0_1px_rgb(239_68_68/0.2)] dark:text-red-400",
        outline: "bg-surface text-neutral-600 shadow-btn dark:text-neutral-300",
        interract:
          "bg-surface text-foreground shadow-key",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
