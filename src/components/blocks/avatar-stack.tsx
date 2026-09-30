"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const people = [
  { initials: "AV", name: "Ava V.", tone: "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" },
  { initials: "MK", name: "Mira K.", tone: "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-100" },
  { initials: "JL", name: "Jonas L.", tone: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300" },
  { initials: "RP", name: "Riya P.", tone: "bg-neutral-300 text-neutral-800 dark:bg-neutral-600 dark:text-white" },
];

export interface AvatarStackProps {
  className?: string;
}

/** Overlapping team avatars that fan out on hover, with an inline invite action. */
export function AvatarStack({ className }: AvatarStackProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [expanded, setExpanded] = React.useState(false);
  const [invited, setInvited] = React.useState(false);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className="flex items-center"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => {
          setExpanded(false);
          setHovered(null);
        }}
      >
        {people.map((p, i) => (
          <motion.div
            key={p.initials}
            className="relative"
            animate={{ marginLeft: i === 0 ? 0 : expanded ? 6 : -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onMouseEnter={() => setHovered(i)}
            style={{ zIndex: hovered === i ? 10 : people.length - i }}
          >
            <motion.div
              whileHover={{ y: -3 }}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold ring-[2.5px] ring-background",
                p.tone
              )}
            >
              {p.initials}
            </motion.div>
            <AnimatePresence>
              {hovered === i && (
                <motion.span
                  initial={{ opacity: 0, y: 4, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-neutral-900 px-2 py-0.5 text-[11px] font-medium whitespace-nowrap text-white shadow-btn-primary dark:bg-white dark:text-neutral-900"
                >
                  {p.name}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
        <motion.span
          animate={{ marginLeft: expanded ? 6 : -10 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface font-mono text-[10px] text-muted-foreground shadow-btn ring-[2.5px] ring-background"
        >
          +3
        </motion.span>
      </div>

      <motion.button
        layout
        onClick={() => setInvited((v) => !v)}
        whileTap={{ scale: 0.96 }}
        className={cn(
          "flex h-9 items-center gap-1.5 overflow-hidden rounded-full px-3.5 text-xs font-medium transition-colors",
          invited
            ? "bg-emerald-500/10 text-emerald-700 shadow-[inset_0_0_0_1px_rgb(16_185_129/0.25)] dark:text-emerald-400"
            : "bg-surface text-foreground shadow-btn"
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={invited ? "y" : "n"}
            initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            {invited ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          </motion.span>
        </AnimatePresence>
        <motion.span layout="position">{invited ? "Invite sent" : "Invite"}</motion.span>
      </motion.button>
    </div>
  );
}
