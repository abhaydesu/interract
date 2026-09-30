"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Eyebrow, Section } from "@/components/interract/frame";

const tabs = {
  pnpm: ["pnpm dlx shadcn@latest init", "pnpm dlx shadcn@latest add https://interract.dev/r/command-menu.json"],
  npm: ["npx shadcn@latest init", "npx shadcn@latest add https://interract.dev/r/command-menu.json"],
  bun: ["bunx --bun shadcn@latest init", "bunx --bun shadcn@latest add https://interract.dev/r/command-menu.json"],
} as const;

type Tab = keyof typeof tabs;

export function GetStartedSection() {
  const [tab, setTab] = React.useState<Tab>("npm");
  const [copied, setCopied] = React.useState<number | null>(null);

  const copy = (text: string, i: number) => {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 1600);
  };

  return (
    <Section>
      <div className="grid gap-12 px-6 py-16 md:px-10 lg:grid-cols-[1fr_1.3fr] lg:items-center">
        <div>
          <Eyebrow index="03">Install</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-balance text-foreground md:text-4xl">
            Two commands.{" "}
            <span className="text-neutral-400 dark:text-neutral-500">Then it’s yours.</span>
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Works with any Next.js + Tailwind project. Components land in your repo as plain TSX —
            read them, change them, delete what you don’t need.
          </p>
          <Button asChild variant="outline" className="group mt-6">
            <Link href="/docs">
              Installation guide
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        <div className="overflow-hidden rounded-2xl bg-surface shadow-raised">
          <div className="flex items-center justify-between border-b border-line px-3 py-2">
            <div className="flex gap-0.5">
              {(Object.keys(tabs) as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "relative h-7 rounded-md px-2.5 font-mono text-xs transition-colors",
                    tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab === t && (
                    <motion.span
                      layoutId="install-tab"
                      className="absolute inset-0 rounded-md bg-surface-2 shadow-btn"
                      transition={{ type: "spring", stiffness: 500, damping: 38 }}
                    />
                  )}
                  <span className="relative">{t}</span>
                </button>
              ))}
            </div>
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
              Terminal
            </span>
          </div>

          <div className="space-y-1 p-2">
            {tabs[tab].map((cmd, i) => (
              <div
                key={i}
                className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-surface-2"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-surface-2 font-mono text-[10px] text-muted-foreground shadow-hairline">
                  {i + 1}
                </span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.code
                    key={cmd}
                    initial={{ opacity: 0, y: 4, filter: "blur(3px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -4, filter: "blur(3px)" }}
                    transition={{ duration: 0.18 }}
                    className="min-w-0 flex-1 truncate font-mono text-[13px] text-foreground"
                  >
                    <span className="text-muted-foreground select-none">$ </span>
                    {cmd}
                  </motion.code>
                </AnimatePresence>
                <button
                  onClick={() => copy(cmd, i)}
                  aria-label="Copy command"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-surface hover:text-foreground hover:shadow-btn focus-visible:opacity-100"
                >
                  {copied === i ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-line bg-surface-2/60 px-5 py-3 font-mono text-[11px] text-muted-foreground">
            <span className="text-emerald-600 dark:text-emerald-400">✓</span> Created
            components/blocks/command-menu.tsx
          </div>
        </div>
      </div>
    </Section>
  );
}
