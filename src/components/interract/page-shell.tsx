import * as React from "react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/interract/header";
import { Footer } from "@/components/interract/landing/footer";

/**
 * Page chrome: a centered column bounded by hairline rails.
 * Sections inside draw full-bleed horizontal rules with "+" marks
 * where they cross the rails.
 */
export function PageShell({
  children,
  className,
  footer = true,
}: {
  children: React.ReactNode;
  className?: string;
  footer?: boolean;
}) {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <Header />
      <div
        className={cn(
          "relative mx-auto min-h-screen max-w-6xl border-x border-line",
          className
        )}
      >
        <main className="relative pt-20">{children}</main>
        {footer && <Footer />}
      </div>
    </div>
  );
}
