"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Bell, Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const rows = [
  { id: "motion", icon: Sparkles, title: "Reduced motion", description: "Tone down spring animations" },
  { id: "notify", icon: Bell, title: "Push notifications", description: "Deploys, reviews and mentions" },
  { id: "private", icon: Lock, title: "Private registry", description: "Only your team can install" },
];

export interface SettingsListProps {
  className?: string;
}

/** Grouped preference rows with tactile, spring-loaded switches. */
export function SettingsList({ className }: SettingsListProps) {
  const [state, setState] = React.useState<Record<string, boolean>>({
    motion: false,
    notify: true,
    private: true,
  });

  return (
    <div className={cn("w-full max-w-[340px] rounded-2xl bg-surface p-1 shadow-raised", className)}>
      {rows.map((row, i) => {
        const Icon = row.icon;
        const on = state[row.id];
        return (
          <label
            key={row.id}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]",
              i > 0 && "relative before:absolute before:inset-x-3 before:top-0 before:h-px before:bg-line"
            )}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-neutral-500 shadow-hairline dark:text-neutral-400">
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-medium text-foreground">{row.title}</span>
              <span className="block truncate text-xs text-muted-foreground">{row.description}</span>
            </span>
            <Switch checked={on} onCheckedChange={(v) => setState((s) => ({ ...s, [row.id]: v }))} />
          </label>
        );
      })}
    </div>
  );
}

export function Switch({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative flex h-[22px] w-[38px] shrink-0 items-center rounded-full p-[3px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        checked
          ? "justify-end bg-neutral-900 shadow-[inset_0_1px_2px_rgb(0_0_0/0.3)] dark:bg-white"
          : "justify-start bg-black/[0.08] shadow-inset dark:bg-white/[0.1]"
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 700, damping: 35 }}
        whileTap={{ width: 20 }}
        className="block h-4 w-4 rounded-full bg-white shadow-[0_1px_2px_rgb(0_0_0/0.2),0_0_0_0.5px_rgb(0_0_0/0.06)] dark:bg-neutral-900"
      />
    </button>
  );
}
