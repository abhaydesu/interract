"use client";

import { useState, useCallback } from "react";
import { motion, type MotionValue, type useMotionTemplate } from "framer-motion";
import { useMemo } from "react";

export function useHoverScale(scale: number = 1.02) {
  const [isHovered, setIsHovered] = useState(false);

  const variants = useMemo(
    () => ({
      rest: { scale: 1 },
      hover: { scale },
    }),
    [scale]
  );

  return {
    isHovered,
    setIsHovered,
    variants,
  };
}

export function usePressAnimation(scale: number = 0.98) {
  const [isPressed, setIsPressed] = useState(false);

  const variants = useMemo(
    () => ({
      rest: { scale: 1 },
      press: { scale },
    }),
    [scale]
  );

  return {
    isPressed,
    setIsPressed,
    variants,
  };
}

export function useFadeIn(delay: number = 0) {
  return {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: "easeOut" },
  };
}

export function useSlideUp(delay: number = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] },
  };
}

export function useStaggerChildren(delay: number = 0.05) {
  return {
    animate: {
      transition: {
        staggerChildren: delay,
      },
    },
  };
}

export function useCardHover() {
  const [isHovered, setIsHovered] = useState(false);

  return {
    isHovered,
    setIsHovered,
    variants: {
      rest: { y: 0, scale: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
      hover: { 
        y: -4, 
        scale: 1.01,
        boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        transition: { duration: 0.25, ease: "easeOut" }
      },
    },
  };
}

export function useButtonPress() {
  return {
    variants: {
      rest: { scale: 1 },
      hover: { scale: 1.02 },
      press: { scale: 0.98 },
    },
    transition: { duration: 0.1 },
  };
}
