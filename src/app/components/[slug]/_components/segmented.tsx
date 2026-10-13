"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
  label: string;
}) {
  const id = React.useId();
  return (
    <div
      role="tablist"
      aria-label={label}
      className="inline-flex gap-0.5 rounded-[10px] bg-black/[0.04] p-[3px] shadow-inset dark:bg-white/[0.04]"
    >
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="tab"
          aria-selected={value === o}
          onClick={() => onChange(o)}
          className={cn(
            "relative h-7 rounded-[7px] px-3 text-[13px] font-medium capitalize transition-colors",
            value === o ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {value === o && (
            <motion.span
              layoutId={id}
              className="absolute inset-0 rounded-[7px] bg-surface shadow-btn"
              transition={{ type: "spring", stiffness: 500, damping: 38 }}
            />
          )}
          <span className="relative">{o === "cli" ? "CLI" : o}</span>
        </button>
      ))}
    </div>
  );
}
