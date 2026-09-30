import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-[background-color,box-shadow,transform,color] duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-900 text-white shadow-btn-primary hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100",
        destructive:
          "bg-red-600 text-white shadow-[0_0_0_1px_rgb(185_28_28),0_1px_2px_rgb(0_0_0/0.2),inset_0_1px_0_rgb(255_255_255/0.2)] hover:bg-red-500",
        outline:
          "bg-surface text-foreground shadow-btn hover:bg-surface-2",
        secondary:
          "bg-black/[0.04] text-foreground hover:bg-black/[0.07] dark:bg-white/[0.06] dark:hover:bg-white/[0.09]",
        ghost:
          "text-neutral-600 hover:bg-black/[0.04] hover:text-foreground dark:text-neutral-400 dark:hover:bg-white/[0.06]",
        link: "text-foreground underline decoration-line-strong underline-offset-4 hover:decoration-foreground active:scale-100",
        interract:
          "bg-neutral-900 text-white shadow-btn-primary hover:-translate-y-px hover:shadow-[var(--sh-btn-primary),0_8px_16px_-6px_rgb(0_0_0/0.35)] dark:bg-white dark:text-neutral-900",
      },
      size: {
        default: "h-9 px-4",
        sm: "h-8 px-3 text-[13px]",
        lg: "h-11 rounded-xl px-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
