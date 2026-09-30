import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "./button";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-[background-color,box-shadow,transform] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-900 text-white shadow-btn-primary hover:bg-neutral-800 dark:bg-white dark:text-neutral-900",
        destructive:
          "bg-red-600 text-white shadow-[0_0_0_1px_rgb(185_28_28),inset_0_1px_0_rgb(255_255_255/0.2)] hover:bg-red-500",
        outline:
          "bg-surface text-foreground shadow-btn hover:bg-surface-2",
        secondary:
          "bg-black/[0.04] text-foreground hover:bg-black/[0.07] dark:bg-white/[0.06]",
        ghost: "text-neutral-500 hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 w-9",
        sm: "h-8 w-8",
        lg: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  asChild?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <Button
        className={cn(iconButtonVariants({ variant, size, className }))}
        ref={ref}
        size="icon"
        {...props}
      />
    );
  }
);
IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
