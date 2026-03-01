"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export type AnimationPreset = "none" | "bounce" | "pulse" | "wiggle" | "spin" | "shake";

const animationVariants: Record<AnimationPreset, any> = {
  none: {},
  bounce: {
    animate: {
      y: [0, -4, 0],
      transition: {
        repeat: Infinity,
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  },
  pulse: {
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        repeat: Infinity,
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  },
  wiggle: {
    animate: {
      rotate: [-5, 5, -5],
      transition: {
        repeat: Infinity,
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  },
  spin: {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: "linear",
      },
    },
  },
  shake: {
    animate: {
      x: [-2, 2, -2, 2, 0],
      transition: {
        repeat: Infinity,
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  },
};

export interface AnimatedIconProps {
  icon: LucideIcon;
  preset?: AnimationPreset;
  className?: string;
  size?: number;
}

export function AnimatedIcon({
  icon: Icon,
  preset = "none",
  className,
  size = 24,
}: AnimatedIconProps) {
  if (preset === "none") {
    return <Icon size={size} className={className} />;
  }

  return (
    <motion.div
      className={cn("inline-flex", className)}
      variants={animationVariants[preset]}
      initial="initial"
      whileHover="animate"
    >
      <Icon size={size} />
    </motion.div>
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
