"use client";

import * as React from "react";
import { MotionConfig } from "motion/react";
import { ThemeProvider } from "@/components/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {/* Honour the OS "reduce motion" setting across every motion component. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeProvider>
  );
}
