"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = {
  monthly: { price: 24, note: "billed monthly" },
  yearly: { price: 19, note: "billed $228 yearly" },
} as const;

type Cycle = keyof typeof plans;

const features = ["Unlimited components", "Private registry", "Figma source files", "Priority support"];

export interface PricingToggleProps {
  className?: string;
}

/** Pricing card with a segmented billing switch and rolling digits. */
export function PricingToggle({ className }: PricingToggleProps) {
  const [cycle, setCycle] = React.useState<Cycle>("yearly");
  const plan = plans[cycle];

  return (
    <div className={cn("w-full max-w-[300px] rounded-2xl bg-surface p-1.5 shadow-raised", className)}>
      <div className="rounded-xl bg-surface-2 p-4 shadow-inset">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-medium text-foreground">Pro</p>
          <div className="relative flex rounded-lg bg-black/[0.04] p-0.5 dark:bg-white/[0.05]">
            {(Object.keys(plans) as Cycle[]).map((c) => (
              <button
                key={c}
                onClick={() => setCycle(c)}
                className={cn(
                  "relative h-6 rounded-md px-2 text-[11px] font-medium capitalize transition-colors",
                  cycle === c ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {cycle === c && (
                  <motion.span
                    layoutId="pricing-pill"
                    className="absolute inset-0 rounded-md bg-surface shadow-btn"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative">{c}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-end gap-1">
          <span className="mb-1.5 text-lg font-medium text-muted-foreground">$</span>
          <RollingNumber value={plan.price} />
          <span className="mb-1.5 text-xs text-muted-foreground">/mo</span>
          <AnimatePresence>
            {cycle === "yearly" && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                className="mb-2 ml-auto rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 shadow-[inset_0_0_0_1px_rgb(16_185_129/0.2)] dark:text-emerald-400"
              >
                −20%
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <p className="text-[11px] text-muted-foreground">{plan.note}</p>
      </div>

      <ul className="space-y-2 px-3 pt-4 pb-3">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-black/[0.04] dark:bg-white/[0.06]">
              <Check className="h-2.5 w-2.5 text-foreground" />
            </span>
            {f}
          </li>
        ))}
      </ul>
      <button className="h-9 w-full rounded-[10px] bg-neutral-900 text-[13px] font-medium text-white shadow-btn-primary transition-transform active:scale-[0.98] dark:bg-white dark:text-neutral-900">
        Get started
      </button>
    </div>
  );
}

function RollingNumber({ value }: { value: number }) {
  const digits = String(value).split("");
  return (
    <span className="relative inline-flex overflow-hidden text-5xl font-semibold tracking-[-0.04em] text-foreground tabular-nums">
      {digits.map((d, i) => (
        <span key={i} className="relative inline-block h-[1em] w-[0.6em] leading-none">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={d}
              initial={{ y: "100%", opacity: 0, filter: "blur(2px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: "-100%", opacity: 0, filter: "blur(2px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 26, delay: i * 0.04 }}
              className="absolute inset-0"
            >
              {d}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}
