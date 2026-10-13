"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCopy } from "@/hooks/use-copy";

export function CopyButton({
  text,
  label = "Copy",
  className,
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const { copied, copy } = useCopy();
  const done = copied !== null;

  return (
    <button
      type="button"
      onClick={() => copy(text)}
      aria-label={done ? "Copied" : label}
      title={done ? "Copied" : label}
      className={cn(
        "relative flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-[background-color,color,box-shadow] hover:bg-surface hover:text-foreground hover:shadow-btn",
        className
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={done ? "check" : "copy"}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {done ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {done ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}

/** A single command on one line: scrolls horizontally instead of truncating. */
export function CommandLine({
  command,
  prompt = true,
  className,
}: {
  command: string;
  /** Show the leading `$` shell prompt. Turn off for code snippets. */
  prompt?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 rounded-xl bg-surface py-2 pr-2 pl-4 shadow-soft", className)}>
      <code className="no-scrollbar min-w-0 flex-1 overflow-x-auto py-1 font-mono text-[13px] whitespace-nowrap text-foreground">
        {prompt && <span className="text-muted-foreground select-none">$ </span>}
        {command}
      </code>
      <CopyButton text={command} label={prompt ? "Copy command" : "Copy code"} />
    </div>
  );
}
