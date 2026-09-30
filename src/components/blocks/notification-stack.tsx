"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { GitPullRequest, MessageSquare, RotateCcw, Rocket, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Notification = {
  id: number;
  icon: React.ElementType;
  title: string;
  body: string;
  time: string;
};

const initial: Notification[] = [
  { id: 1, icon: Rocket, title: "Deployed to production", body: "interract-web · main · 42s", time: "now" },
  { id: 2, icon: GitPullRequest, title: "PR #128 approved", body: "feat: spring-based accordion", time: "2m" },
  { id: 3, icon: MessageSquare, title: "Mira left a comment", body: "“That hover state is so good.”", time: "8m" },
];

export interface NotificationStackProps {
  className?: string;
}

/**
 * A stacked set of notifications that fans out on hover.
 * Dismiss with the close button; restore when empty.
 */
export function NotificationStack({ className }: NotificationStackProps) {
  const [items, setItems] = React.useState(initial);
  const [expanded, setExpanded] = React.useState(false);

  const dismiss = (id: number) => setItems((xs) => xs.filter((x) => x.id !== id));

  return (
    <div
      className={cn("relative w-full max-w-[340px]", className)}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onBlur={() => setExpanded(false)}
    >
      <motion.div
        className="relative"
        animate={{ height: items.length === 0 ? 72 : expanded ? items.length * 76 - 8 : 68 + (items.length - 1) * 10 }}
        transition={{ type: "spring", stiffness: 380, damping: 34 }}
      >
        <AnimatePresence initial={false}>
          {items.map((n, i) => {
            const Icon = n.icon;
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: -16, scale: 0.96 }}
                animate={{
                  opacity: expanded || i < 3 ? 1 - (expanded ? 0 : i * 0.18) : 0,
                  y: expanded ? i * 76 : i * 10,
                  scale: expanded ? 1 : 1 - i * 0.05,
                }}
                exit={{ opacity: 0, x: 40, transition: { duration: 0.18 } }}
                transition={{ type: "spring", stiffness: 380, damping: 34 }}
                style={{ zIndex: items.length - i }}
                className="group/n absolute inset-x-0 top-0 flex h-[68px] items-center gap-3 rounded-2xl bg-surface px-3.5 shadow-soft"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-surface-2 text-neutral-600 shadow-hairline dark:text-neutral-300">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[13px] font-medium text-foreground">{n.title}</p>
                    <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{n.time}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{n.body}</p>
                </div>
                <button
                  onClick={() => dismiss(n.id)}
                  aria-label="Dismiss"
                  tabIndex={expanded || i === 0 ? 0 : -1}
                  className="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-surface text-neutral-500 opacity-0 shadow-btn transition-opacity hover:text-foreground group-hover/n:opacity-100 focus-visible:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <AnimatePresence>
          {items.length === 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setItems(initial)}
              className="absolute inset-0 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-line-strong text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              All caught up — restore
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
