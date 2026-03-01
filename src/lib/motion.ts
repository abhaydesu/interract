import { type HTMLMotionProps, type Variants } from "framer-motion";

export const motionVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  } as Variants,

  fadeInUp: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  } as Variants,

  fadeInDown: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  } as Variants,

  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  } as Variants,

  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  } as Variants,

  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  } as Variants,
};

export const transitionPresets = {
  fast: {
    duration: 0.15,
    ease: "easeOut",
  },
  normal: {
    duration: 0.25,
    ease: "easeOut",
  },
  slow: {
    duration: 0.4,
    ease: "easeOut",
  },
  spring: {
    type: "spring",
    stiffness: 400,
    damping: 30,
  },
  springBounce: {
    type: "spring",
    stiffness: 500,
    damping: 15,
  },
};

export const hoverVariants = {
  scale: {
    scale: 1.02,
    transition: transitionPresets.fast,
  },
  lift: {
    y: -2,
    transition: transitionPresets.fast,
  },
  glow: {
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
    transition: transitionPresets.normal,
  },
};

export const pressVariants = {
  scale: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

export type MotionConfig = {
  variants?: Variants;
  transition?: typeof transitionPresets.normal;
};
