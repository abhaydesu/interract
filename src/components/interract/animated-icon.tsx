"use client";

import * as React from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type AnimationPreset = "none" | "bounce" | "pulse" | "wiggle" | "spin" | "shake";

// Every preset returns to the same resting pose, so ending a hover settles
// the icon back into place instead of freezing it mid-animation.
const rest = { x: 0, y: 0, scale: 1, rotate: 0, transition: { duration: 0.2 } };

const animationVariants: Record<Exclude<AnimationPreset, "none">, Variants> = {
  bounce: {
    rest,
    animate: { y: [0, -4, 0], transition: { repeat: Infinity, duration: 0.6, ease: "easeInOut" } },
  },
  pulse: {
    rest,
    animate: { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 0.8, ease: "easeInOut" } },
  },
  wiggle: {
    rest,
    animate: { rotate: [-8, 8, -8], transition: { repeat: Infinity, duration: 0.5, ease: "easeInOut" } },
  },
  spin: {
    rest: { ...rest, transition: { duration: 0 } },
    animate: { rotate: 360, transition: { repeat: Infinity, duration: 1, ease: "linear" } },
  },
  shake: {
    rest,
    animate: { x: [-2, 2, -2, 2, 0], transition: { repeat: Infinity, duration: 0.4, ease: "easeInOut" } },
  },
};

export interface AnimatedIconProps {
  icon: LucideIcon;
  preset?: AnimationPreset;
  className?: string;
  size?: number;
  /**
   * Drive the animation from outside (e.g. while a parent card is hovered).
   * When omitted, the icon animates while it is hovered itself.
   */
  active?: boolean;
}

export function AnimatedIcon({
  icon: Icon,
  preset = "none",
  className,
  size = 24,
  active,
}: AnimatedIconProps) {
  if (preset === "none") {
    return <Icon size={size} className={className} />;
  }

  const controlled = active !== undefined;

  return (
    <motion.span
      className={cn("inline-flex", className)}
      variants={animationVariants[preset]}
      initial="rest"
      animate={controlled ? (active ? "animate" : "rest") : "rest"}
      whileHover={controlled ? undefined : "animate"}
    >
      <Icon size={size} />
    </motion.span>
  );
}

interface IconButtonMotionProps {
  icon: LucideIcon;
  preset?: AnimationPreset;
  className?: string;
  onClick?: () => void;
}

export function IconButtonMotion({
  icon: Icon,
  preset = "bounce",
  className,
  onClick,
}: IconButtonMotionProps) {
  return (
    <motion.button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9",
        className
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
    >
      <AnimatedIcon icon={Icon} preset={preset} />
    </motion.button>
  );
}
