"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusMark } from "@/components/interract/frame";
import { CommandMenu } from "@/components/blocks/command-menu";
import { NotificationStack } from "@/components/blocks/notification-stack";
import { StatCard } from "@/components/blocks/stat-card";
import { AvatarStack } from "@/components/blocks/avatar-stack";

const ease = [0.16, 1, 0.3, 1] as const;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 14, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, delay, ease },
});

export function HeroSection() {
  const [copied, setCopied] = useState(false);
  const installCmd = "npx shadcn@latest add https://interract.dev/r/button.json";

  return (
    <section className="relative">
      {/* faint grid behind the headline */}
      <div className="bg-grid mask-radial pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-70" />

      <div className="relative px-6 pt-20 pb-14 text-center md:pt-28">
        <motion.div {...rise(0)} className="flex justify-center">
          <Link
            href="/components"
            className="group inline-flex items-center gap-2 rounded-full bg-surface py-1 pr-3 pl-1 text-xs text-neutral-600 shadow-btn transition-shadow hover:shadow-soft dark:text-neutral-400"
          >
            <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-medium text-white dark:bg-white dark:text-neutral-900">
              New
            </span>
            8 interactive blocks just landed
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <motion.h1
          {...rise(0.08)}
          className="mx-auto mt-7 max-w-3xl text-[44px] leading-[1.02] font-semibold tracking-[-0.045em] text-balance text-foreground md:text-7xl"
        >
          Components that move{" "}
          <span className="text-neutral-400 dark:text-neutral-500">with intent.</span>
        </motion.h1>

        <motion.p
          {...rise(0.16)}
          className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-pretty text-muted-foreground"
        >
          Carefully tuned UI with micro-interactions built in. Copy the source, own the
          code, ship interfaces that feel considered.
        </motion.p>

        <motion.div {...rise(0.24)} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="group h-10 rounded-[11px] px-5">
            <Link href="/components">
              Browse components
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-10 rounded-[11px] px-5">
            <Link href="/docs">
              Read the docs
            </Link>
          </Button>
        </motion.div>

        <motion.div {...rise(0.32)} className="mt-6 flex justify-center">
          <button
            onClick={() => {
              navigator.clipboard.writeText(installCmd);
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            }}
            className="group flex max-w-full items-center gap-2.5 rounded-lg px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-black/[0.03] hover:text-foreground dark:hover:bg-white/[0.04]"
          >
            <span className="text-neutral-300 dark:text-neutral-600">$</span>
            <span className="truncate">{installCmd}</span>
            {copied ? (
              <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5 shrink-0 opacity-50 group-hover:opacity-100" />
            )}
          </button>
        </motion.div>
      </div>

      <HeroStage />
    </section>
  );
}

function HeroStage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.35, ease }}
      className="relative px-3 pb-3 md:px-6 md:pb-6"
    >
      <div className="relative rounded-[28px] bg-black/[0.02] p-2 shadow-inset dark:bg-white/[0.02]">
        <PlusMark className="-top-[5px] -left-[5px]" />
        <PlusMark className="-top-[5px] -right-[5px]" />
        <PlusMark className="-bottom-[5px] -left-[5px]" />
        <PlusMark className="-right-[5px] -bottom-[5px]" />
        <div className="bg-dots relative flex min-h-[520px] items-center justify-center overflow-hidden rounded-[22px] bg-background px-4 py-12 shadow-hairline md:min-h-[560px]">
          {/* window chrome */}
          <div className="absolute top-4 left-5 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-2.5 w-2.5 rounded-full bg-black/[0.08] dark:bg-white/[0.08]" />
            ))}
          </div>
          <span className="absolute top-3.5 right-5 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
            Live · try it
          </span>

          <Floating className="absolute top-16 left-8 hidden lg:block" delay={0.6}>
            <NotificationStack />
          </Floating>

          <Floating className="relative z-10" delay={0.45}>
            <CommandMenu />
          </Floating>

          <Floating className="absolute right-8 bottom-12 hidden lg:block" delay={0.75}>
            <StatCard />
          </Floating>

          <Floating className="absolute bottom-14 left-12 hidden xl:block" delay={0.9}>
            <div className="rounded-2xl bg-surface/80 p-3 shadow-soft backdrop-blur">
              <AvatarStack />
            </div>
          </Floating>
        </div>
      </div>
    </motion.div>
  );
}

function Floating({
  children,
  className,
  delay,
}: {
  children: React.ReactNode;
  className?: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
